import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { message, files, history } = await req.json()

    let systemPrompt = `당신은 부동산 경매 전문 AI 어시스턴트입니다. 
경매 물건 분석, 권리분석, 투자 가치 평가, 법원 경매 절차 등에 대해 전문적으로 답변합니다.
답변은 한국어로 하고, 친절하고 전문적으로 설명해주세요.`

    if (files && files.length > 0) {
      systemPrompt += `\n\n사용자가 ${files.length}개의 파일을 업로드했습니다: ${files.map((f: any) => f.name).join(', ')}`
    }

    const openaiKey = process.env.OPENAI_API_KEY

    if (!openaiKey) {
      // OpenAI 키가 없으면 기본 답변
      const responses: Record<string, string> = {
        '분석': '선택하신 물건에 대한 AI 분석을 진행하겠습니다. OpenAI API 키가 설정되면 더 정확한 분석이 가능합니다.',
        '권리': '권리분석 결과, 해당 물건의 선순위 권리관계를 검토해야 합니다.',
        '투자': '투자 가치 분석을 위해서는 현재 시세, 임대 수익률, 지역 개발 계획 등을 종합적으로 검토해야 합니다.',
      }

      let reply = '안녕하세요! DB Auction AI 어시스턴트입니다. 경매 관련 질문이 있으시면 무엇이든 물어보세요!'
      for (const [key, val] of Object.entries(responses)) {
        if (message.includes(key)) { reply = val; break }
      }

      return NextResponse.json({ success: true, message: reply })
    }

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-10),
          { role: 'user', content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '답변을 생성할 수 없습니다.'

    return NextResponse.json({ success: true, message: reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      success: true,
      message: '안녕하세요! DB Auction AI 어시스턴트입니다. 경매 관련 질문이 있으시면 무엇이든 물어보세요!',
    })
  }
}
