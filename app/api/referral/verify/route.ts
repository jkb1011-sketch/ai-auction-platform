import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ valid: false, error: '코드를 입력하세요' })

    const referralCode = await prisma.referralCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!referralCode) return NextResponse.json({ valid: false, error: '존재하지 않는 코드입니다' })
    if (!referralCode.isActive) return NextResponse.json({ valid: false, error: '비활성화된 코드입니다' })

    return NextResponse.json({
      valid: true,
      tier: referralCode.tier,
      rewardRate: referralCode.rewardRate,
      message: `${referralCode.tier} 코드 확인! 추천인에게 결제금액의 ${Math.round(referralCode.rewardRate * 100)}%가 지급됩니다`,
    })
  } catch (error) {
    return NextResponse.json({ valid: false, error: '오류가 발생했습니다' }, { status: 500 })
  }
}
