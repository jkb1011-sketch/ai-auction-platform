'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SearchContent() {
  const searchParams = useSearchParams()
  const searchType = searchParams.get('type') === 'full' ? 'full' : 'case'
  return <div>검색중...</div>
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  )
}