'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Paperclip, Trash2, FileText, Image } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string; files?: UploadedFile[] }
interface UploadedFile { name: string; url: string; type: string; size: number }

const PRESETS = [
  '사건번호 검색 방법 알려주세요',
  '경매 입찰 절차를 설명해주세요',
  '권리분석이란 무엇인가요?',
  '최저가 낙찰률이란?',
  '구독 요금제 안내해주세요',
  '파일을 업로드하면 분석해드릴게요',
  '임차인 보호 방법은?',
  '낙찰 후 절차가 궁금해요',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! 🏠 DB Auction AI 어시스턴트입니다.\n경매 관련 궁금한 점이나 문서 파일을 업로드해서 분석 받으세요!' }
  ])
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const uploadFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name}은(는) 10MB를 초과합니다`)
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setFiles(prev => [...prev, { name: data.name, url: data.url, type: data.type, size: data.size }])
      }
    } catch { alert('파일 업로드에 실패했습니다') }
    setUploading(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    for (const f of selected) await uploadFile(f)
    e.target.value = ''
  }

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg && files.length === 0) return
    const userMsg: Message = { role: 'user', content: msg || '파일을 분석해주세요', files: files.length > 0 ? [...files] : undefined }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setFiles([])
    setLoading(true)

    try {
      const res = await fetch('/api/chat/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg || '업로드된 파일을 분석해주세요',
          files: userMsg.files || [],
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || '답변을 생성하지 못했습니다.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' }])
    }
    setLoading(false)
  }

  const formatSize = (n: number) => n < 1024 ? `${n}B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)}KB` : `${(n / 1024 / 1024).toFixed(1)}MB`

  return (
    <>
      {/* 플로팅 버튼 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center z-50"
        >
          <MessageCircle className="w-6 h-6"/>
        </button>
      )}

      {/* 채팅 창 */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold">DB Auction AI</span>
            </div>
            <button onClick={() => setOpen(false)}><X className="w-5 h-5"/></button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.files && m.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {m.files.map((f, j) => (
                        <div key={j} className={`flex items-center gap-1 text-xs rounded px-2 py-1 ${m.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                          {f.type.startsWith('image') ? <Image className="w-3 h-3"/> : <FileText className="w-3 h-3"/>}
                          <span className="truncate max-w-[120px]">{f.name}</span>
                          <span className="text-gray-400">({formatSize(f.size)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* 프리셋 버튼 */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1 flex-shrink-0">
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition border border-blue-200">
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* 업로드된 파일 미리보기 */}
          {files.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50 flex-shrink-0">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-white border rounded-lg px-3 py-2 mb-1">
                  <div className="flex items-center gap-2">
                    {f.type.startsWith('image') ? <Image className="w-4 h-4 text-blue-500"/> : <FileText className="w-4 h-4 text-blue-500"/>}
                    <span className="truncate max-w-[200px]">{f.name}</span>
                    <span className="text-gray-400">({formatSize(f.size)})</span>
                  </div>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                    <Trash2 className="w-3 h-3 text-red-400"/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 입력 영역 */}
          <div className="border-t p-3 flex-shrink-0">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input ref={fileRef} type="file" multiple accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.hwp,.txt"
                onChange={handleFileChange} className="hidden"/>
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50">
                <Paperclip className="w-4 h-4 text-gray-500"/>
              </button>
              <button onClick={() => sendMessage()} disabled={loading || (!input.trim() && files.length === 0)}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                <Send className="w-4 h-4"/>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center">파일 첨부 가능 (이미지, PDF, 문서 최대 10MB)</p>
          </div>
        </div>
      )}
    </>
  )
}
