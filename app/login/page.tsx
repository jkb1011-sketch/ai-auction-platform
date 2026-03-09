'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏠</div>
          <h1 className="text-2xl font-bold text-gray-800">DB Auction 로그인</h1>
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-3 mb-6">
          {process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== 'false' && (
            <button onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition">
              <span className="text-lg">G</span>
              <span className="font-medium text-gray-700">Google로 로그인</span>
            </button>
          )}
          <button onClick={() => signIn('kakao', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-yellow-400 rounded-xl py-3 hover:bg-yellow-500 transition">
            <span className="text-lg">💬</span>
            <span className="font-medium text-gray-800">카카오로 로그인</span>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
          <div className="relative text-center"><span className="bg-white px-4 text-sm text-gray-400">또는</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">{error}</div>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  )
}
