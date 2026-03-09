import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">🏠 DB Auction</h3>
            <p className="text-sm text-gray-400 mb-4">
              AI 기반 부동산 경매 정보 플랫폼<br/>
              전국 법원 경매 정보를 한 번에
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-white font-bold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="hover:text-white transition">경매 사건 검색</Link></li>
              <li><Link href="/subscription" className="hover:text-white transition">구독 플랜</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">개인정보처리방침</Link></li>
            </ul>
          </div>

          {/* 회사 상세 */}
          <div>
            <h4 className="text-white font-bold mb-4">회사 정보</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">상호:</span> 디지털뱅크(주)</p>
              <p><span className="text-gray-500">대표:</span> 제경배</p>
              <p><span className="text-gray-500">사업자번호:</span> 365-81-03733</p>
              <p><span className="text-gray-500">통신판매신고:</span> 2026-부산동래-0129호</p>
              <p><span className="text-gray-500">주소:</span> 부산시 동래구 충렬대로271번길 10, 2층 202-105호</p>
              <p>
                <span className="text-gray-500">전화:</span>{' '}
                <a href="tel:010-4000-4383" className="hover:text-white transition">010-4000-4383</a>
              </p>
              <p>
                <span className="text-gray-500">이메일:</span>{' '}
                <a href="mailto:jkb1011@hanmail.net" className="hover:text-white transition">jkb1011@hanmail.net</a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © 2026 디지털뱅크(주). All rights reserved. | DB Auction AI 경매 플랫폼
        </div>
      </div>
    </footer>
  )
}
