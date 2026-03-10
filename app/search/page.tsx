'use client'
import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Building2, MapPin, Calendar, DollarSign } from 'lucide-react'

const COURTS = ['?ÑÏ≤¥','?úÏö∏Ï§ëÏïô','?úÏö∏?ôÎ?','?úÏö∏?®Î?','?úÏö∏Î∂ÅÎ?','?úÏö∏?úÎ?','?∏Ï≤ú','?òÏõê','Î∂Ä??,'?ÄÍµ?,'Í¥ëÏ£º','?Ä??,'?∏ÏÇ∞','Ï∞ΩÏõê','?úÏ£º','?òÏ†ïÎ∂Ä','Ï∂òÏ≤ú','Ï≤?£º','?ÑÏ£º','?úÏ£º','?úÏ≤ú','?¥ÎÇ®','?çÏÑ±']

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

function SearchContent() {
  const searchParams = useSearchParams()
  const searchType = searchParams.get('type') === 'full' ? 'full' : 'case'

  const [activeTab, setActiveTab] = useState<'case'|'full'>(searchType)
  const [caseNumber, setCaseNumber] = useState('')
  const [selectedCourt, setSelectedCourt] = useState('?ÑÏ≤¥')
  const [fullYear, setFullYear] = useState('2024')
  const [fullKeyword, setFullKeyword] = useState('')
  const [results, setResults] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const formatPrice = (n: number) => (n / 10000).toLocaleString() + 'ÎßåÏõê'

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
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">?îç Í≤ΩÎß§ ?¨Í±¥ Í≤Ä??/h1>

        {/* ??*/}
        <div className="flex bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => { setActiveTab('case'); setResults([]); setSearched(false) }}
            className={`flex-1 py-4 font-bold text-sm transition ${activeTab === 'case' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            ?ìã ?µÌï©Í≤Ä???¨Í±¥Î≤àÌò∏ ?ÄÍ≤?Í≤Ä??          </button>
          <button
            onClick={() => { setActiveTab('full'); setResults([]); setSearched(false) }}
            className={`flex-1 py-4 font-bold text-sm transition ${activeTab === 'full' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            ?èõÔ∏?Í≤ΩÎß§?¨Í±¥ ?ÑÏ≤¥ ?ÄÍ≤?Í≤Ä??          </button>
        </div>

        {/* Í≤Ä????*/}
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
                  placeholder="?¨Í±¥Î≤àÌò∏ ?ÖÎ†• (?? 2024?ÄÍ≤?2345 ?êÎäî ?ÄÍ≤?"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={searchByCase} disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
                  <Search className="w-4 h-4"/>
                  {loading ? 'Í≤Ä?âÏ§ë...' : 'Í≤Ä??}
                </button>
              </div>
              <p className="text-xs text-gray-400">* ?¨Í±¥Î≤àÌò∏ ?ÑÏ≤¥ ?êÎäî ?ºÎ? ?ÖÎ†• (?? "?ÄÍ≤?, "2024?ÄÍ≤?, "12345")</p>
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
                  placeholder="?∞ÎèÑ (?? 2024)"
                  className="w-28 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  value={fullKeyword}
                  onChange={e => setFullKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchFull()}
                  placeholder="?§Ïõå??(Ï£ºÏÜå, Î¨ºÍ±¥ ?†Ìòï ??"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button onClick={searchFull} disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2">
                  <Search className="w-4 h-4"/>
                  {loading ? 'Í≤Ä?âÏ§ë...' : '?ÑÏ≤¥ Í≤Ä??}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Í≤∞Í≥º */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Í≤Ä??Ï§?..</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-4">?îç</div>
            <p className="text-gray-500 text-lg">Í≤Ä??Í≤∞Í≥ºÍ∞Ä ?ÜÏäµ?àÎã§</p>
            <p className="text-gray-400 text-sm mt-2">?§Î•∏ ?¨Í±¥Î≤àÌò∏Î°?Í≤Ä?âÌï¥ Î≥¥ÏÑ∏??/p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">Ï¥?<span className="font-bold text-blue-600">{results.length}Í±?/span> Í≤Ä?âÎê®</p>
            {results.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">{p.caseNumber}</span>
                      {p.court && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{p.court}ÏßÄÎ∞©Î≤ï??/span>}
                      {p.propertyType && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{p.propertyType}</span>}
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"/>
                      <p className="text-gray-700 text-sm">{p.address}</p>
                    </div>
                    {p.area && (
                      <p className="text-gray-500 text-xs ml-6">?ÑÏö©Î©¥Ï†Å: {p.area}??/p>
                    )}
                  </div>
                  <div className="md:text-right space-y-1 flex-shrink-0">
                    <div className="flex items-center gap-2 md:justify-end">
                      <DollarSign className="w-4 h-4 text-gray-400"/>
                      <span className="text-xs text-gray-500">Í∞êÏ†ïÍ∞Ä</span>
                      <span className="font-bold text-gray-800">{formatPrice(p.appraisalPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <DollarSign className="w-4 h-4 text-orange-400"/>
                      <span className="text-xs text-gray-500">ÏµúÏ?Í∞Ä</span>
                      <span className="font-bold text-orange-600">{formatPrice(p.minimumPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 md:justify-end">
                      <Calendar className="w-4 h-4 text-blue-400"/>
                      <span className="text-xs text-gray-500">?ÖÏ∞∞??/span>
                      <span className="font-bold text-blue-600">{new Date(p.biddingDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      ?ôÏ∞∞Î•? {Math.round(p.minimumPrice / p.appraisalPrice * 100)}%
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


export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}