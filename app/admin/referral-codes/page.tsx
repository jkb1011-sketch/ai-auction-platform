'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Power, Crown } from 'lucide-react'

interface Code { id: string; code: string; tier: string; rewardRate: number; isActive: boolean; usageCount: number; totalReward: number; createdAt: string }

const TIER_LABELS: Record<string, string> = { bronze: '🥉 브론즈', silver: '🥈 실버', gold: '🥇 골드' }

export default function AdminReferralPage() {
  const [codes, setCodes] = useState<Code[]>([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [newTier, setNewTier] = useState('bronze')
  const [creating, setCreating] = useState(false)

  const fetchCodes = async () => {
    const res = await fetch('/api/admin/referral-codes')
    const data = await res.json()
    if (data.success) setCodes(data.codes)
    setLoading(false)
  }

  useEffect(() => { fetchCodes() }, [])

  const createCode = async () => {
    if (!newCode.trim()) return
    setCreating(true)
    const res = await fetch('/api/admin/referral-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode.toUpperCase(), tier: newTier }),
    })
    const data = await res.json()
    if (data.success) { fetchCodes(); setNewCode('') }
    else alert(data.error)
    setCreating(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/referral-codes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    })
    fetchCodes()
  }

  const deleteCode = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/referral-codes/${id}`, { method: 'DELETE' })
    fetchCodes()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500"/> 추천인 코드 관리
        </h1>

        {/* 코드 생성 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-4">새 추천인 코드 생성</h2>
          <div className="flex gap-3 flex-wrap">
            <input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())}
              placeholder="코드 입력 (예: GOLD2026)"
              className="flex-1 min-w-48 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"/>
            <select value={newTier} onChange={e => setNewTier(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="bronze">🥉 브론즈 (5%)</option>
              <option value="silver">🥈 실버 (10%)</option>
              <option value="gold">🥇 골드 (20%)</option>
            </select>
            <button onClick={createCode} disabled={creating || !newCode.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
              <Plus className="w-4 h-4"/> {creating ? '생성 중...' : '생성'}
            </button>
          </div>
        </div>

        {/* 코드 목록 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">코드 목록 ({codes.length}개)</h2>
          </div>
          {loading ? (
            <div className="text-center py-10 text-gray-500">로딩 중...</div>
          ) : codes.length === 0 ? (
            <div className="text-center py-10 text-gray-400">등록된 코드가 없습니다</div>
          ) : (
            <div className="divide-y">
              {codes.map(c => (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-mono font-bold text-lg ${c.isActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{c.code}</span>
                    <span className="text-sm">{TIER_LABELS[c.tier]}</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">리워드 {Math.round(c.rewardRate * 100)}%</span>
                    <span className="text-xs text-gray-500">사용 {c.usageCount}회</span>
                    <span className="text-xs text-gray-500">총 리워드 {c.totalReward.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(c.id, c.isActive)}
                      className={`p-2 rounded-lg transition ${c.isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      <Power className="w-4 h-4"/>
                    </button>
                    <button onClick={() => deleteCode(c.id)} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">💡 추천인 코드는 수동으로 생성 및 관리합니다</p>
      </div>
    </div>
  )
}
