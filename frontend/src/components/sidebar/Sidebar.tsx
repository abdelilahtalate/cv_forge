import { useEffect } from 'react'
import type { ViewType, GeneratedCV } from '@/types/cv'
import { chatApi } from '@/services/api'
import { useChatStore } from '@/store/chatStore'
import { useChat } from '@/hooks/useChat'

interface Props {
  open: boolean
  activeView: ViewType
  onViewChange: (v: ViewType) => void
  generatedCVs: GeneratedCV[]
  onCVClick: (id: number) => void
  selectedCVId: number | null
  onToggle: () => void
}

const NAV_ITEMS: { id: ViewType; icon: string; label: string }[] = [
  { id: 'chat', icon: 'fa-comment-dots', label: 'Chat' },
  { id: 'profile', icon: 'fa-brain', label: 'Profile Memory' },
  { id: 'templates', icon: 'fa-palette', label: 'Templates' },
  { id: 'settings', icon: 'fa-gear', label: 'Settings' },
]

export default function Sidebar({
  open,
  activeView,
  onViewChange,
  generatedCVs,
  onCVClick,
  selectedCVId,
  onToggle,
}: Props) {
  const { 
    user, 
    conversations, 
    activeConversationId, 
    setConversations, 
    setActiveConversationId,
    setMessages,
    resetMessages,
    logout 
  } = useChatStore()

  const { loadMessages } = useChat()

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      chatApi.getConversations(user.id).then(setConversations)
    }
  }, [user, setConversations])

  const handleNewChat = async () => {
    if (!user) return
    try {
      const newConv = await chatApi.createConversation(user.id, `Chat ${conversations.length + 1}`)
      setConversations([newConv, ...conversations])
      setActiveConversationId(newConv.id)
      resetMessages()
      onViewChange('chat')
    } catch (err) {
      console.error('Failed to create conversation', err)
    }
  }

  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col border-r border-[#27272a] bg-[#0f0f12] transition-all duration-300 ${open ? 'w-60' : 'w-16'}`}
    >
      {/* Brand */}
      <div className="flex h-14 flex-shrink-0 items-center gap-2.5 border-b border-[#27272a] px-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
          <i className="fa-solid fa-fire text-sm text-white" />
        </div>
        {open && (
          <span className="whitespace-nowrap font-display text-base font-bold gradient-text">
            CV Forge
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`nav-item w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
              activeView === item.id
                ? 'active text-amber-400'
                : 'text-zinc-500 hover:bg-[#1c1c21] hover:text-zinc-300'
            }`}
            title={item.label}
            aria-label={item.label}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-[13px]`} />
            {open && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        ))}

        {/* New Chat Button */}
        {open && (
          <button
            onClick={handleNewChat}
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-dashed border-[#27272a] px-3 py-2.5 text-sm text-amber-500/70 transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-500"
          >
            <i className="fa-solid fa-plus w-5 text-center text-[12px]" />
            <span className="font-semibold">New Chat</span>
          </button>
        )}

        {/* Conversations List */}
        {open && conversations.length > 0 && (
          <div className="px-3 pb-1 pt-6">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Recent Chats
            </span>
          </div>
        )}

        {open &&
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConversationId(conv.id)
                loadMessages(conv.id)
                onViewChange('chat')
              }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                activeConversationId === conv.id
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-zinc-500 hover:bg-[#1c1c21] hover:text-zinc-300'
              }`}
            >
              <i className="fa-solid fa-message w-5 text-center text-[12px]" />
              <div className="min-w-0 text-left">
                <p className="truncate text-xs font-medium">{conv.title}</p>
                <p className="text-[10px] text-zinc-600">
                  {new Date(conv.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </button>
          ))}

        {open && (
          <div className="px-3 pb-1 pt-6">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Generated CVs
            </span>
          </div>
        )}

        {open &&
          generatedCVs.map((cv) => (
            <button
              key={cv.id}
              onClick={() => onCVClick(cv.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                selectedCVId === cv.id
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-zinc-500 hover:bg-[#1c1c21] hover:text-zinc-300'
              }`}
            >
              <i className="fa-solid fa-file-lines w-5 text-center text-[12px]" />
              <div className="min-w-0 text-left">
                <p className="truncate text-xs">{cv.target}</p>
                <p className="text-[10px] text-zinc-600">{cv.date}</p>
              </div>
            </button>
          ))}

        {!open && generatedCVs.length > 0 && (
          <div className="my-3 border-t border-[#27272a]" />
        )}
      </nav>

      {/* User / Logout */}
      {open && user && (
        <div className="px-2 py-3">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center text-[12px]" />
            <span className="truncate">{user.display_name}</span>
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="flex-shrink-0 border-t border-[#27272a] p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-all duration-200 hover:bg-[#1c1c21] hover:text-zinc-300"
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <i className={`fa-solid ${open ? 'fa-angles-left' : 'fa-angles-right'} text-xs`} />
          {open && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
