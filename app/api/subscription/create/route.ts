import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const PLANS = {
  '1month':  { price: 44000,  months: 1 },
  '6month':  { price: 165000, months: 6 },
  '12month': { price: 220000, months: 12 },
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { planType, referralCode } = await req.json()
    const plan = PLANS[planType as keyof typeof PLANS]
    if (!plan) return NextResponse.json({ error: '잘못된 플랜입니다' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })

    let referralCodeData = null
    if (referralCode) {
      referralCodeData = await prisma.referralCode.findUnique({
        where: { code: referralCode.toUpperCase(), isActive: true },
      })
    }

    const finalPrice = plan.price
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + plan.months)

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planType,
        durationMonths: plan.months,
        originalPrice: plan.price,
        finalPrice,
        referralCode: referralCode || null,
        referralDiscount: 0,
        endDate,
        status: 'active',
      },
    })

    // 추천인 리워드 지급
    if (referralCodeData) {
      const rewardAmount = Math.round(finalPrice * referralCodeData.rewardRate)
      await prisma.referralReward.create({
        data: {
          referralCode: referralCodeData.code,
          userId: user.id,
          paidAmount: finalPrice,
          rewardAmount,
        },
      })
      await prisma.referralCode.update({
        where: { code: referralCodeData.code },
        data: {
          usageCount: { increment: 1 },
          totalReward: { increment: rewardAmount },
        },
      })
    }

    return NextResponse.json({ success: true, subscriptionId: subscription.id })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: '구독 생성 실패' }, { status: 500 })
  }
}
