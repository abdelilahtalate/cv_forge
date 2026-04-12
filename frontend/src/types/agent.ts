export interface AIResponseRule {
  triggers: string[]
  response: string
  showPreview: boolean
  addCV?: { target: string; template: string }
}

export interface Settings {
  offlineMode: boolean
  model: string
  autoPreview: boolean
  typingAnim: boolean
}
