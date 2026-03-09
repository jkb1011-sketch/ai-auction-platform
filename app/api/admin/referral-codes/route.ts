import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
    }
    const codes = await prisma.referralCode.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, codes })
  } catch (error) {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
    }
    const { code, tier } = await req.json()

    const TIERS: Record<string, number> = { bronze: 0.05, silver: 0.10, gold: 0.20 }
    if (!TIERS[tier]) return NextResponse.json({ error: '잘못된 티어' }, { status: 400 })

    const existing = await prisma.referralCode.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) return NextResponse.json({ error: '이미 존재하는 코드입니다' }, { status: 400 })

    const newCode = await prisma.referralCode.create({
      data: { code: code.toUpperCase(), tier, rewardRate: TIERS[tier] },
    })
    return NextResponse.json({ success: true, code: newCode })
  } catch (error) {
    return NextResponse.json({ error: '생성 실패' }, { status: 500 })
  }
}
