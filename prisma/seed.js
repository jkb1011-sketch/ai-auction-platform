const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('📦 샘플 데이터 추가 중...')

  // 샘플 경매 물건 추가
  const properties = [
    {
      id: 'sample-apt-001',
      caseNumber: '2024타경12345',
      court: '서울중앙',
      address: '서울특별시 강남구 역삼동 123-45 삼성아파트 101동 1001호',
      appraisalPrice: 595000000,
      minimumPrice: 476000000,
      biddingDate: new Date('2026-03-15T10:00:00Z'),
      propertyType: '아파트',
      area: 84.5,
    },
    {
      id: 'sample-off-001',
      caseNumber: '2024타경23456',
      court: '서울중앙',
      address: '서울특별시 송파구 잠실동 456-78 롯데오피스텔 5층 501호',
      appraisalPrice: 224000000,
      minimumPrice: 179200000,
      biddingDate: new Date('2026-03-20T14:00:00Z'),
      propertyType: '오피스텔',
      area: 35.2,
    },
    {
      id: 'sample-shop-001',
      caseNumber: '2024타경34567',
      court: '부산',
      address: '부산광역시 해운대구 우동 789-12 해운대상가 1층 101호',
      appraisalPrice: 315000000,
      minimumPrice: 252000000,
      biddingDate: new Date('2026-03-25T11:00:00Z'),
      propertyType: '상가',
      area: 45.8,
    },
    {
      id: 'sample-apt-002',
      caseNumber: '2024타경45678',
      court: '수원',
      address: '경기도 성남시 분당구 정자동 321-65 분당아파트 202동 505호',
      appraisalPrice: 364000000,
      minimumPrice: 291200000,
      biddingDate: new Date('2026-04-05T10:00:00Z'),
      propertyType: '아파트',
      area: 74.2,
    },
    {
      id: 'sample-house-001',
      caseNumber: '2024타경56789',
      court: '인천',
      address: '인천광역시 연수구 송도동 100-200 단독주택',
      appraisalPrice: 450000000,
      minimumPrice: 360000000,
      biddingDate: new Date('2026-04-10T10:00:00Z'),
      propertyType: '단독주택',
      area: 120.0,
    },
  ]

  for (const p of properties) {
    await prisma.property.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    })
    console.log(`  ✓ ${p.caseNumber} 추가됨`)
  }

  console.log('\n✅ 샘플 데이터 추가 완료!')
  console.log('\n📋 다음 단계:')
  console.log('  1. npm run dev 로 서버 시작')
  console.log('  2. http://localhost:3000/search 에서 "타경" 검색 테스트')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
