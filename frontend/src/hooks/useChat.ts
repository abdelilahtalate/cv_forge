import { useCallback } from 'react'
import { useChatStore, nowTime } from '@/store/chatStore'
import { useCVStore } from '@/store/cvStore'
import { useSettingsStore } from '@/store/settingsStore'
import { chatApi } from '@/services/api'
import type { Message } from '@/types/message'

export function useChat() {
  const { 
    user, 
    activeConversationId, 
    addMessage, 
    setMessages,
    setTyping 
  } = useChatStore()
  
  const { setActiveView } = useCVStore()
  const { settings } = useSettingsStore()

  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        const msgs = await chatApi.getMessages(conversationId)
        const mapped = msgs.map(m => ({
          ...m,
          role: m.role === 'assistant' ? 'ai' as const : 'user' as const,
          time: m.created_at 
            ? new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            : nowTime(),
          typing: false
        }))
        setMessages(mapped)
      } catch (err) {
        console.error('Failed to load messages:', err)
      }
    },
    [setMessages]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !activeConversationId) return

      // 1. Optimistic Update: Add user message locally
      const tempId = Date.now()
      const optimisticMsg: Message = {
        id: tempId,
        role: 'user',
        content: text,
        time: nowTime(),
        typing: false
      }
      addMessage(optimisticMsg)
      
      setTyping(true)
      setActiveView('chat')

      try {
        // 2. Send to backend
        const responseMessages = await chatApi.sendMessage(
          user.id,
          activeConversationId,
          'user',
          text
        )

        // 3. Sync with backend: Map all messages returned
        const mappedMessages = responseMessages
          .filter((m: any) => m !== null)
          .map((m: any) => ({
            ...m,
            role: m.role === 'assistant' ? 'ai' as const : 'user' as const,
            time: m.created_at 
              ? new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              : nowTime(),
            // Temporarily disabling typing for backend sync to check visibility
            typing: false 
          }))

        // We replace the optimistic message with the ones from the backend.
        useChatStore.setState((s) => {
          const filtered = s.messages.filter(msg => msg.id !== tempId)
          return {
            messages: [...filtered, ...mappedMessages]
          }
        })

      } catch (err) {
        console.error('Failed to send message:', err)
        // Optionally remove the optimistic message on error
        useChatStore.setState((s) => ({
          messages: s.messages.filter(m => m.id !== tempId)
        }))
      } finally {
        setTyping(false)
      }
    },
    [user, activeConversationId, addMessage, setTyping, setActiveView, settings]
  )

  return { sendMessage, loadMessages }
}
