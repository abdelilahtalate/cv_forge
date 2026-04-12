import { create } from 'zustand'
import type { Settings } from '@/types/agent'

interface SettingsState {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    offlineMode: true,
    model: 'llama-3.1-70b',
    autoPreview: true,
    typingAnim: true,
  },
  updateSettings: (patch) =>
    set((s) => ({ settings: { ...s.settings, ...patch } })),
}))
