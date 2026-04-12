import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Message } from '@/types/message'
import { parseContent, renderFormattedText } from '@/utils/format'
import CodeBlock from './CodeBlock'

interface Props {
  message: Message
  onTypingComplete?: (id: number) => void
}

function AIAvatar() {
  return (
    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
      <i className="fa-solid fa-wand-magic-sparkles text-xs text-white" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-700">
      <i className="fa-solid fa-user text-xs text-zinc-400" />
    </div>
  )
}

function BubbleContent({ text, showCursor }: { text: string; showCursor: boolean }) {
  const parts = parseContent(text)
  return (
    <>
      {parts.map((p, i) =>
        p.type === 'code' ? (
          <CodeBlock key={i} code={p.content} language={p.language} />
        ) : (
          <span key={i}>{renderFormattedText(p.content)}</span>
        ),
      )}
      {showCursor && <span className="typing-cursor">|</span>}
    </>
  )
}

import { useCVStore } from '@/store/cvStore'
import { Eye } from 'lucide-react'

export default function MessageBubble({ message, onTypingComplete }: Props) {
  const isUser = message.role === 'user'
  const { setShowCVPreview, setActivePdfUrl } = useCVStore()
  
  const [displayed, setDisplayed] = useState(message.typing ? '' : message.content)
  const [done, setDone] = useState(!message.typing)
  const hasStarted = useRef(false)

  const handleOpenPreview = () => {
    if (message.pdf_url) {
      setActivePdfUrl(message.pdf_url)
      setShowCVPreview(true)
    }
  }

  useEffect(() => {
    if (!message.typing) {
      setDisplayed(message.content)
      setDone(true)
      return
    }
    
    if (hasStarted.current) return
    hasStarted.current = true
    let i = 0
    const text = message.content
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        setDone(true)
        clearInterval(timer)
        onTypingComplete?.(message.id as any)
      }
    }, 12)
    return () => clearInterval(timer)
  }, [message.typing, message.content, message.id, onTypingComplete])

  return (
    <div
      className={`flex animate-fade-in-up items-start gap-3 px-4 md:px-0 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {isUser ? <UserAvatar /> : <AIAvatar />}
      <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
            isUser
              ? 'rounded-tr-md border border-amber-500/20 bg-amber-500/15 text-amber-50'
              : 'rounded-tl-md border border-[#27272a] bg-[#1c1c21] text-zinc-300'
          }`}
        >
          <BubbleContent text={displayed} showCursor={!done} />
        </div>

        {/* Action Buttons (e.g. View CV) */}
        {!isUser && message.pdf_url && done && (
          <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
            {/* View Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenPreview}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 active:bg-white/20"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
                <Eye size={12} />
              </div>
              <span>Open CV Preview</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
