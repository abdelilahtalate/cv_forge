import type { Profile } from '@/types/memory'
import type { GeneratedCV, Template } from '@/types/cv'
import type { Message, User, Conversation } from '@/types/message'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    role: 'ai',
    content:
      "Welcome to CV Forge. I'm your AI resume assistant — I can help you build, tailor, and iterate on professional CVs using your profile data.\n\nPlease login or start a new chat to begin.",
    time: new Date().toLocaleTimeString(),
    typing: false,
  },
]

export const QUICK_PROMPTS = [
  { icon: 'fa-bolt', text: 'Generate CV for Staff Engineer at Notion' },
  { icon: 'fa-pen-to-square', text: 'Rewrite my summary to be more impact-driven' },
  { icon: 'fa-palette', text: 'Show me template options' },
  { icon: 'fa-code', text: 'Export my CV as LaTeX' },
]

export const chatApi = {
  async login(displayName: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: displayName }),
    })
    if (!response.ok) throw new Error('Login failed')
    return response.json()
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/conversations/user/${userId}`)
    if (!response.ok) return []
    return response.json()
  },

  async createConversation(userId: string, title: string = 'New Conversation'): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, title }),
    })
    if (!response.ok) throw new Error('Failed to create conversation')
    return response.json()
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chat/conversation/${conversationId}`)
    if (!response.ok) throw new Error('Failed to fetch messages')
    return response.json()
  },

  async sendMessage(userId: string, conversationId: string, role: string, content: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        conversation_id: conversationId,
        role,
        content,
      }),
    })
    if (!response.ok) throw new Error('Failed to send message')
    return response.json()
  },
}

// Keeping these for UI reference until models are fully integrated
export const MOCK_PROFILE: Profile = {
  name: 'Alexandra Chen',
  title: 'Senior Software Engineer',
  email: 'alex.chen@email.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  website: 'alexchen.dev',
  linkedin: 'linkedin.com/in/alexchen',
  summary: 'Passionate software engineer...',
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: [],
  education: [],
  projects: [],
}

export const MOCK_TEMPLATES: Template[] = [
  { id: 1, name: 'Minimal', desc: 'Clean and focused', accent: '#f59e0b', layout: 'single' },
  { id: 3, name: 'Developer', desc: 'Tech-optimized', accent: '#06b6d4', layout: 'single' },
  { id: 6, name: 'Modern', desc: 'Contemporary balance', accent: '#f97316', layout: 'dual' },
]

export const MOCK_GENERATED_CVS: GeneratedCV[] = []

