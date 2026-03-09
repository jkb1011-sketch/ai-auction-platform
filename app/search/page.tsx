'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Building2, MapPin, Calendar, DollarSign } from 'lucide-react'

const COURTS = ['전체','서울중앙','서울동부','서울남부','서울북부','서울서부','인천','수원','부산','대구','광주','대전','울산','창원','제주','의정부','춘천','청주','전주','제주','순천','해남','홍성']

interface Property {
  id: string
  caseNumber: string
  court: string
  address: string
  appraisalPrice: number
  minimumPrice: number
  biddingDate: string
  propertyType?: string
  area?: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const searchType = searchParams.get('type') === 'full' ? 'full' : 'case'

  const [activeTab, setActiveTab] = useState<'case'|'full'>(searchType)
  const [caseNumber, setCaseNumber] = useState('')
  const [selectedCourt, setSelectedCourt] = useState('전체')
  const [fullYear, setFullYear] = useState('2024')
  const [fullKeyword, setFullKeyword] = useState('')
  const [results, setResults] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const formatPrice = (n: number) => (n / 10000).toLocaleString() + '만원'

  const searchByCase = async () => {
    setLoading(true); setSearched(true)
    try {
      const res = await fetch(`/api/search/case?caseNumber=${encodeURIComponent(caseNumber)}&court=${encodeURIComponent(selectedCourt)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch { setResults([]) }
    setLoading(false)
  }

  const searchFull = async () => {
    setLoading(true); setSearched(true)
    try {
      const res = await fetch(`/api/search/full?court=${encodeURIComponent(selectedCourt)}&year=${fullYear}&keyword=${encodeURIComponent(fullKeyword)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch { setResults([]) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">🔍 경매 사건 검색</h1>

        {/* 탭 */}
        <div className="flex bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => { setActiveTab('case'); setResults([]); setSearched(false) }}
            className={`flex-1 py-4 font-bold text-sm transition ${activeTab === 'case' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            📋 통합검색 사건번호 타경 검색
          </button>
          <button
            onClick={() => { setActiveTab('full'); setResults([]); setSearched(false) }}
            className={`flex-1 py-4 font-bold text-sm transition ${activeTab === 'full' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            🏛️ 경매사건 전체 타경 검색
          </button>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {activeTab === 'case' ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <select
                  value={selectedCourt}
                  onChange={e => setSelectedCourt(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COURTS.map(c => <option key={c}>{c}</option>)}
                </select>
                <input
                  value={caseNumber}
                  onChange={e => setCaseNumber(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchByCase()}
                  placeholder="사건번호 입력 (예: 2024타경12345 또는 타경)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={searchByCase} disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
                  <Search className="w-4 h-4"/>
                  {loading ? '검색중...' : '검색'}
                </button>
              </div>
              <p className="text-xs text-gray-400">* 사건번호 전체 또는 일부 입력 (예: "타경", "2024타경", "12345")</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <select
                  value={selectedCourt}
                  onChange={e => setSelectedCourt(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {COURTS.map(c => <option key={c}>{c}</option>)}
                </select>
                <input
                  value={fullYear}
                  onChange={e => setFullYear(e.target.value)}
                  placeholder="연도 (예: 2024)"
                  className="w-28 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  value={fullKeyword}
                  onChange={e => setFullKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchFull()}
                  placeholder="키워드 (주소, 물건 유형 등)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={searchFull} disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2">
                  <Search className="w-4 h-4"/>
                  {loading ? '검색중...' : '전체 검색'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 결과 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">검색 중...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">다른 사건번호로 검색해 보세요</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">총 <span className="font-bold text-blue-600">{results.length}건</span> 검색됨</p>
            {results.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">{p.caseNumber}</span>
                      {p.court && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{p.court}지방법원</span>}
                      {p.propertyType && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{p.propertyType}</span>}
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"/>
                      <p className="text-gray-700 text-sm">{p.address}</p>
                    </div>
                    {p.area && (
                      <p className="text-gray-500 text-xs ml-6">전용면적: {p.area}㎡</p>
                    )}
                  </div>
                  <div className="md:text-right space-y-1 flex-shrink-0">
                    <div className="flex items-center gap-2 md:justify-end">
                      <DollarSign className="w-4 h-4 text-gray-400"/>
                      <span className="text-xs text-gray-500">감정가</span>
                      <span className="font-bold text-gray-800">{formatPrice(p.appraisalPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <DollarSign className="w-4 h-4 text-orange-400"/>
                      <span className="text-xs text-gray-500">최저가</span>
                      <span className="font-bold text-orange-600">{formatPrice(p.minimumPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <Calendar className="w-4 h-4 text-blue-400"/>
                      <span className="text-xs text-gray-500">입찰일</span>
                      <span className="font-bold text-blue-600">{new Date(p.biddingDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      낙찰률: {Math.round(p.minimumPrice / p.appraisalPrice * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
