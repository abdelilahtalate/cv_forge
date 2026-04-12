import { useEffect, useRef } from 'react'
import type { Message } from '@/types/message'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface Props {
  messages: Message[]
  isTyping: boolean
  onTypingComplete: (id: number) => void
}

export default function MessageList({ messages, isTyping, onTypingComplete }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  return (
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onTypingComplete={onTypingComplete} />
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  )
}
