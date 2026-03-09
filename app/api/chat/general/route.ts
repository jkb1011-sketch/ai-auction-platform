import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, files, history } = await req.json()
    const openaiKey = process.env.OPENAI_API_KEY

    if (!openaiKey) {
      const keywords: [string, string][] = [
        ['구독', '구독 요금제는 1개월 44,000원, 6개월 165,000원, 12개월 220,000원입니다. /subscription 페이지에서 확인하세요!'],
        ['검색', '경매 사건 검색은 상단 메뉴의 "경매검색" 또는 /search 페이지에서 가능합니다. 사건번호 타경 검색과 전체 타경 검색을 지원합니다.'],
        ['입찰', '경매 입찰 절차: 1. 물건 조사 → 2. 현장 방문 → 3. 권리분석 → 4. 입찰 준비 → 5. 입찰서 제출 → 6. 개찰 및 낙찰 확인'],
        ['권리분석', '권리분석은 경매 물건의 선순위 권리(저당권, 전세권, 임차권 등)를 분석하여 낙찰 후 인수해야 할 부담을 파악하는 것입니다.'],
        ['최저가', '최저가(최저경매가격)는 법원이 정한 최소 입찰 금액입니다. 보통 감정가의 80%에서 시작하여 유찰될수록 낮아집니다.'],
        ['임차인', '임차인 보호: 확정일자를 받은 임차인은 선순위이면 낙찰자가 보증금을 인수합니다. 대항력 여부 확인이 중요합니다.'],
        ['파일', '파일을 업로드하시면 AI가 분석해드립니다. 등기부등본, 감정평가서, 물건명세서 등을 첨부해주세요.'],
      ]
      for (const [kw, res] of keywords) {
        if (message.toLowerCase().includes(kw)) return NextResponse.json({ success: true, message: res })
      }
      return NextResponse.json({ success: true, message: '안녕하세요! DB Auction AI 어시스턴트입니다. 경매 사건 검색(/search), 구독 안내(/subscription), 파일 분석 등 무엇이든 도와드릴게요! 😊' })
    }

    const systemPrompt = `당신은 부동산 경매 전문 AI 어시스턴트입니다. 
경매 물건 분석, 권리분석, 투자 가치 평가, 법원 경매 절차, 임차인 보호 등에 대해 전문적으로 답변합니다.
이 플랫폼(DB Auction)은 디지털뱅크(주)가 운영하며 전국 법원 경매 정보를 제공합니다.
답변은 반드시 한국어로 하고, 친절하고 전문적으로 설명해주세요.
${files?.length > 0 ? `사용자가 ${files.length}개의 파일을 업로드했습니다: ${files.map((f: any) => f.name).join(', ')}. 파일 내용을 분석하여 답변해주세요.` : ''}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-10),
          { role: 'user', content: message },
        ],
        max_tokens: 800,
      }),
    })
    const data = await response.json()
    return NextResponse.json({ success: true, message: data.choices?.[0]?.message?.content || '답변 생성 실패' })
  } catch (error) {
    return NextResponse.json({ success: true, message: '안녕하세요! 경매 관련 질문이 있으시면 무엇이든 물어보세요!' })
  }
}
