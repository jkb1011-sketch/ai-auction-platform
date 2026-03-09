import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const caseNumber = searchParams.get('caseNumber') || ''
    const court = searchParams.get('court') || '전체'

    const where: any = {}
    if (caseNumber) {
      where.caseNumber = { contains: caseNumber, mode: 'insensitive' }
    }
    if (court !== '전체') {
      where.court = { contains: court, mode: 'insensitive' }
    }

    const results = await prisma.property.findMany({
      where,
      orderBy: { biddingDate: 'asc' },
      take: 50,
    })

    return NextResponse.json({ success: true, results, count: results.length })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ success: false, results: [], count: 0 }, { status: 500 })
  }
}
