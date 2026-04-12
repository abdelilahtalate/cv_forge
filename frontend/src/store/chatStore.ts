import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, User, Conversation } from '@/types/message'
import { INITIAL_MESSAGES } from '@/services/api'

let _id = 100
export const genId = () => ++_id

export function nowTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

interface ChatState {
  user: User | null
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Message[]
  isTyping: boolean
  
  setUser: (user: User | null) => void
  setConversations: (convs: Conversation[]) => void
  setActiveConversationId: (id: string | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (msg: Message) => void
  setTyping: (typing: boolean) => void
  markTypingDone: (id: string | number) => void
  resetMessages: () => void
  logout: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      user: null,
      conversations: [],
      activeConversationId: null,
      messages: INITIAL_MESSAGES,
      isTyping: false,

      setUser: (user) => set({ user }),
      setConversations: (conversations) => set({ conversations }),
      setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
      setMessages: (messages) => set({ messages }),
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      setTyping: (typing) => set({ isTyping: typing }),
      markTypingDone: (id) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, typing: false } : m)),
        })),
      resetMessages: () => set({ messages: INITIAL_MESSAGES, isTyping: false }),
      logout: () => set({ user: null, conversations: [], activeConversationId: null, messages: INITIAL_MESSAGES }),
    }),
    {
      name: 'cv-forge-chat-storage', // storage key
    }
  )
)
