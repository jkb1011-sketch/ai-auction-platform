'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Search, Home, CreditCard, LogIn, LogOut, User } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold text-blue-700">DB Auction</span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition">
            <Home className="w-4 h-4"/> 홈
          </Link>
          <Link href="/search" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition">
            <Search className="w-4 h-4"/> 경매검색
          </Link>
          <Link href="/subscription" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition">
            <CreditCard className="w-4 h-4"/> 구독
          </Link>
          {(session?.user as any)?.role === 'admin' && (
            <Link href="/admin/referral-codes" className="text-purple-600 hover:text-purple-700 transition text-sm font-medium">
              ⚙️ 관리자
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">👤 {session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut()}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition">
                <LogOut className="w-4 h-4"/> 로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition">
                <LogIn className="w-4 h-4"/> 로그인
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                회원가입
              </Link>
            </div>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 space-y-3">
          <Link href="/" className="block text-gray-700 py-2" onClick={() => setMobileOpen(false)}>🏠 홈</Link>
          <Link href="/search" className="block text-gray-700 py-2" onClick={() => setMobileOpen(false)}>🔍 경매검색</Link>
          <Link href="/subscription" className="block text-gray-700 py-2" onClick={() => setMobileOpen(false)}>💎 구독</Link>
          {session ? (
            <button onClick={() => { signOut(); setMobileOpen(false) }} className="block w-full text-left text-red-500 py-2">
              로그아웃
            </button>
          ) : (
            <Link href="/login" className="block text-blue-600 py-2" onClick={() => setMobileOpen(false)}>로그인</Link>
          )}
        </div>
      )}
    </header>
  )
}
