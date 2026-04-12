export interface Template {
  id: number
  name: string
  desc: string
  accent: string
  layout: 'single' | 'dual'
}

export interface GeneratedCV {
  id: number
  target: string
  date: string
  template: string
}

export type ViewType = 'chat' | 'profile' | 'templates' | 'settings'
