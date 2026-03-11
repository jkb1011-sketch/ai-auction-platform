'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SearchContent() {
  const searchParams = useSearchParams()
  return <div>검색 페이지</div>
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  )
}
