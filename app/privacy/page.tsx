export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">개인정보처리방침</h1>
        <div className="prose text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2">1. 개인정보 수집 항목</h2>
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>필수: 이메일 주소, 이름</li>
              <li>소셜 로그인 시: 소셜 계정 식별자, 프로필 이미지</li>
              <li>자동 수집: 접속 IP, 쿠키, 서비스 이용 기록</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">2. 개인정보 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>서비스 제공 및 회원 관리</li>
              <li>구독 서비스 결제 및 관리</li>
              <li>고객 문의 응대</li>
              <li>서비스 개선 및 통계 분석</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">3. 개인정보 보유 기간</h2>
            <p>회원 탈퇴 시까지 보유하며, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">4. 개인정보 제3자 제공</h2>
            <p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 경우는 예외입니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">5. 개인정보 보호 책임자</h2>
            <p>이름: 제경배 | 이메일: jkb1011@hanmail.net | 전화: 010-4000-4383</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">6. 권리 행사 방법</h2>
            <p>이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 위 연락처로 문의하시기 바랍니다.</p>
          </section>
          <p className="text-xs text-gray-400 border-t pt-4">시행일: 2026년 2월 1일 | 디지털뱅크(주)</p>
        </div>
      </div>
    </div>
  )
}
