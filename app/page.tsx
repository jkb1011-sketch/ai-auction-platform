import Link from 'next/link'
import { Search, TrendingUp, Shield, Brain } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🏠 DB Auction
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            AI 기반 부동산 경매 정보 플랫폼
          </p>
          <p className="text-lg text-blue-200 mb-10">
            전국 법원 경매 사건을 한 번에 검색하고 AI로 분석하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search"
              className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
              🔍 사건번호 검색
            </Link>
            <Link href="/subscription"
              className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition border border-blue-300">
              💎 구독 시작
            </Link>
          </div>
        </div>
      </section>

      {/* 통합 검색 섹션 */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🔍 통합 검색
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/search"
                className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition text-center group">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-xl font-bold mb-2">사건번호 타경 검색</div>
                <div className="text-blue-100 text-sm">예: 2024타경12345</div>
                <div className="mt-3 text-xs bg-blue-500 rounded-lg py-1 px-3 inline-block">
                  통합검색 사건번호 타경 검색
                </div>
              </Link>
              <Link href="/search?type=full"
                className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition text-center group">
                <div className="text-4xl mb-3">🏛️</div>
                <div className="text-xl font-bold mb-2">경매사건 전체 타경 검색</div>
                <div className="text-green-100 text-sm">법원별 전체 경매 목록</div>
                <div className="mt-3 text-xs bg-green-500 rounded-lg py-1 px-3 inline-block">
                  경매사건 전체 타경 검색
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">주요 기능</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Search className="w-8 h-8"/>, title: '전국 법원 검색', desc: '23개 법원 통합 검색', color: 'blue' },
              { icon: <Brain className="w-8 h-8"/>, title: 'AI 분석', desc: '권리분석·투자가치 자동 분석', color: 'purple' },
              { icon: <TrendingUp className="w-8 h-8"/>, title: '실시간 정보', desc: '최신 경매 정보 제공', color: 'green' },
              { icon: <Shield className="w-8 h-8"/>, title: '안전한 거래', desc: '검증된 정보만 제공', color: 'red' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className={`text-${f.color}-600 flex justify-center mb-4`}>{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금제 미리보기 */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">합리적인 요금제</h2>
          <p className="text-gray-500 mb-10">월 18,333원부터 시작하는 AI 경매 플랫폼</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: '1개월', price: '44,000', per: '44,000', badge: null },
              { name: '6개월', price: '165,000', per: '27,500', badge: '인기 ⭐' },
              { name: '12개월', price: '220,000', per: '18,333', badge: '최대 절약' },
            ].map((p, i) => (
              <div key={i} className={`p-6 rounded-xl border-2 ${i === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                {p.badge && <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-3">{p.badge}</div>}
                <div className="text-xl font-bold text-gray-800 mb-1">{p.name}</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">₩{p.price}</div>
                <div className="text-gray-500 text-sm">월 {p.per}원</div>
              </div>
            ))}
          </div>
          <Link href="/subscription" className="mt-8 inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition">
            지금 시작하기 →
          </Link>
        </div>
      </section>
    </div>
  )
}
