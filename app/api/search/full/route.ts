import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const court = searchParams.get('court') || '전체'
    const year = searchParams.get('year') || '2024'
    const keyword = searchParams.get('keyword') || ''

    const where: any = {}
    if (court !== '전체') {
      where.court = { contains: court, mode: 'insensitive' }
    }
    if (year) {
      where.caseNumber = { contains: year, mode: 'insensitive' }
    }
    if (keyword) {
      where.OR = [
        { address: { contains: keyword, mode: 'insensitive' } },
        { propertyType: { contains: keyword, mode: 'insensitive' } },
        { caseNumber: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    const results = await prisma.property.findMany({
      where,
      orderBy: { biddingDate: 'asc' },
      take: 100,
    })

    return NextResponse.json({ success: true, results, count: results.length })
  } catch (error) {
    console.error('Full search error:', error)
    return NextResponse.json({ success: false, results: [], count: 0 }, { status: 500 })
  }
}
