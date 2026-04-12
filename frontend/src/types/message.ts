export type MessageRole = 'user' | 'ai' | 'assistant'

export interface User {
  id: string
  display_name: string
  session_token: string
}

export interface Conversation {
  id: string
  title: string
  user_id: string
  created_at: string
}

export interface Message {
  id: string | number
  role: MessageRole
  content: string
  time: string
  typing: boolean
  created_at?: string
  pdf_url?: string
}
