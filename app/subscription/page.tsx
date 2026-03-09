'use client'
import { useState } from 'react'
import { CheckCircle2, Crown } from 'lucide-react'

const PLANS = [
  { id: '1month', name: '1개월', price: 44000, months: 1, badge: null },
  { id: '6month', name: '6개월', price: 165000, months: 6, badge: '⭐ 인기', perMonth: 27500, save: 37 },
  { id: '12month', name: '12개월', price: 220000, months: 12, badge: '💎 최대 절약', perMonth: 18333, save: 58 },
]
const TIERS = [
  { id: 'bronze', label: '🥉 브론즈', rate: 5 },
  { id: 'silver', label: '🥈 실버', rate: 10 },
  { id: 'gold',   label: '🥇 골드', rate: 20 },
]

export default function SubscriptionPage() {
  const [plan, setPlan] = useState('6month')
  const [code, setCode] = useState('')
  const [codeStatus, setCodeStatus] = useState<{ valid: boolean; tier?: string; rate?: number; msg: string } | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [done, setDone] = useState(false)

  const selectedPlan = PLANS.find(p => p.id === plan)!

  const verifyCode = async () => {
    if (!code.trim()) return
    setVerifying(true)
    try {
      const res = await fetch('/api/referral/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      setCodeStatus({ valid: data.valid, tier: data.tier, rate: data.rewardRate, msg: data.message || data.error })
    } catch { setCodeStatus({ valid: false, msg: '확인 실패' }) }
    setVerifying(false)
  }

  const subscribe = async () => {
    setSubscribing(true)
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: plan, referralCode: code || null }),
      })
      const data = await res.json()
      if (data.success) setDone(true)
      else alert(data.error || '구독 생성 실패')
    } catch { alert('오류가 발생했습니다') }
    setSubscribing(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center shadow max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">구독 완료!</h2>
          <p className="text-gray-600 mb-2">{selectedPlan.name} 플랜이 시작되었습니다</p>
          <p className="text-blue-600 font-bold text-xl">{selectedPlan.price.toLocaleString()}원 결제</p>
          <button onClick={() => window.location.href='/'} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition w-full">
            홈으로 이동
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💎 구독 플랜</h1>
          <p className="text-gray-500">AI 경매 정보 플랫폼 – 합리적인 요금으로 시작하세요</p>
        </div>

        {/* 플랜 선택 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PLANS.map(p => (
            <button key={p.id} onClick={() => setPlan(p.id)}
              className={`p-6 rounded-2xl border-2 text-left transition ${plan === p.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
              {p.badge && <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full inline-block mb-3">{p.badge}</div>}
              <div className="text-xl font-bold text-gray-800 mb-1">{p.name}</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">₩{p.price.toLocaleString()}</div>
              {p.perMonth && <div className="text-sm text-gray-500">월 {p.perMonth.toLocaleString()}원</div>}
              {p.save && <div className="text-xs text-green-600 mt-1">최대 {p.save}% 절약</div>}
              {plan === p.id && <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm"><CheckCircle2 className="w-4 h-4"/> 선택됨</div>}
            </button>
          ))}
        </div>

        {/* 추천인 코드 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500"/> 추천인 코드 입력 (선택사항)
          </h3>
          <div className="flex gap-3">
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="추천인 코드 입력 (예: GOLD2026)"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <button onClick={verifyCode} disabled={verifying || !code.trim()}
              className="bg-gray-800 text-white px-5 py-3 rounded-xl hover:bg-gray-700 transition disabled:opacity-50">
              {verifying ? '확인중...' : '확인'}
            </button>
          </div>
          {codeStatus && (
            <div className={`mt-3 p-3 rounded-xl text-sm ${codeStatus.valid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {codeStatus.valid ? '✅' : '❌'} {codeStatus.msg}
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {TIERS.map(t => (
              <div key={t.id} className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                <div>{t.label}</div>
                <div className="font-bold text-gray-700">추천인 {t.rate}% 리워드</div>
              </div>
            ))}
          </div>
        </div>

        {/* 결제 요약 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4">결제 요약</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">선택한 플랜</span><span className="font-medium">{selectedPlan.name}</span></div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>결제 금액</span>
              <span className="text-blue-600">{selectedPlan.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <button onClick={subscribe} disabled={subscribing}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50">
          {subscribing ? '처리 중...' : `${selectedPlan.price.toLocaleString()}원 결제하기`}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">결제 후 즉시 서비스가 시작됩니다</p>
      </div>
    </div>
  )
}
