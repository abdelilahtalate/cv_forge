import { useCallback } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useChat } from '@/hooks/useChat'
import MessageList from '@/chat/MessageList'
import InputBar from '@/chat/InputBar'
import { QUICK_PROMPTS } from '@/services/api'

function NoChatPlaceholder() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-[#09090b]">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1c1c21] text-zinc-600">
          <i className="fa-solid fa-plus text-xl" />
        </div>
        <h2 className="mb-2 font-display text-xl font-bold text-zinc-200">
          Ready to Forge?
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Create a new chat in the sidebar to start building your tailored CV. 
          Everything you say will be remembered across sessions.
        </p>
      </div>
    </div>
  )
}

function ChatWelcome({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-lg animate-fade-in text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20">
          <i className="fa-solid fa-fire text-2xl text-white" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-bold text-zinc-100">
          What should we build?
        </h2>
        <p className="mb-8 text-sm text-zinc-500">
          Tell me about a job you're targeting, and I'll craft a tailored CV from your profile.
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => onPrompt(p.text)}
              className="group flex items-center gap-2.5 rounded-xl border border-[#27272a] bg-[#1c1c21] px-4 py-3 text-left text-sm text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-[#232329] hover:text-zinc-200"
            >
              <i
                className={`fa-solid ${p.icon} text-xs text-amber-500/60 transition-colors group-hover:text-amber-400`}
              />
              <span className="truncate">{p.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import MessageBubble from '@/chat/MessageBubble'
import { CVPreviewPanel } from '@/components/CVPreviewPanel'
import { useCVStore } from '@/store/cvStore'

export default function ChatPage() {
  const { messages, isTyping, markTypingDone, activeConversationId } = useChatStore()
  const { showCVPreview } = useCVStore()
  const { sendMessage } = useChat()

  const handleTypingComplete = useCallback(
    (id: string | number) => markTypingDone(id),
    [markTypingDone],
  )

  if (!activeConversationId) {
    return <NoChatPlaceholder />
  }

  const showWelcome = messages.length <= 1

  return (
    <div className="flex flex-1 min-h-0 relative overflow-hidden">
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-500 ${showCVPreview ? 'mr-[50%]' : ''}`}>
        {showWelcome ? (
          <>
            <ChatWelcome onPrompt={sendMessage} />
            <InputBar onSend={sendMessage} disabled={false} />
          </>
        ) : (
          <>
            <MessageList
              messages={messages}
              isTyping={isTyping}
              onTypingComplete={handleTypingComplete}
            />
            <InputBar onSend={sendMessage} disabled={isTyping} />
          </>
        )}
      </div>
      
      {/* Preview Panel */}
      <CVPreviewPanel />
    </div>
  )
}
