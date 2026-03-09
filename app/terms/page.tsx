export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">이용약관</h1>
        <div className="prose text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2">제1조 (목적)</h2>
            <p>본 약관은 디지털뱅크(주)(이하 "회사")가 운영하는 DB Auction 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">제2조 (서비스 내용)</h2>
            <p>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>전국 법원 부동산 경매 정보 검색 서비스</li>
              <li>AI 기반 경매 물건 분석 서비스</li>
              <li>사건번호 타경 검색 및 경매사건 전체 검색</li>
              <li>파일 업로드 기반 AI 분석 서비스</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">제3조 (구독 및 요금)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>1개월 구독: 44,000원</li>
              <li>6개월 구독: 165,000원</li>
              <li>12개월 구독: 220,000원</li>
            </ul>
            <p className="mt-2">요금은 부가세 포함이며, 구독 기간 내 환불은 잔여 기간에 따라 처리됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">제4조 (추천인 프로그램)</h2>
            <p>추천인 코드를 보유한 이용자에게는 피추천인의 결제금액에 따라 다음과 같이 리워드가 지급됩니다:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>브론즈 코드: 결제금액의 5%</li>
              <li>실버 코드: 결제금액의 10%</li>
              <li>골드 코드: 결제금액의 20%</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">제5조 (면책사항)</h2>
            <p>본 서비스에서 제공하는 경매 정보는 참고용으로만 활용해야 하며, 실제 투자 결정은 전문가와 상담 후 신중하게 결정하시기 바랍니다. 회사는 정보의 정확성을 보장하지 않으며, 이로 인한 손해에 대해 책임을 지지 않습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2">제6조 (문의)</h2>
            <p>서비스 관련 문의사항은 아래로 연락 주시기 바랍니다:</p>
            <p>이메일: jkb1011@hanmail.net | 전화: 010-4000-4383</p>
          </section>
          <p className="text-xs text-gray-400 border-t pt-4">시행일: 2026년 2월 1일 | 디지털뱅크(주)</p>
        </div>
      </div>
    </div>
  )
}
