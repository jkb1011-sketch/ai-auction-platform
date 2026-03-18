import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: '모든 필드를 입력하세요' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: '이미 사용 중인 이메일입니다' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })
    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {console.error("REGISTER_500", error)
    return NextResponse.json({ error: '회원가입 실패' }, { status: 500 })
  }
}
