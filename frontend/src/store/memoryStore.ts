import { create } from 'zustand'
import type { Profile } from '@/types/memory'
import { MOCK_PROFILE } from '@/services/api'

interface MemoryState {
  profile: Profile
  setProfile: (profile: Profile) => void
  updateField: <K extends keyof Profile>(key: K, value: Profile[K]) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
}

export const useMemoryStore = create<MemoryState>((set) => ({
  profile: MOCK_PROFILE,
  setProfile: (profile) => set({ profile }),
  updateField: (key, value) =>
    set((s) => ({ profile: { ...s.profile, [key]: value } })),
  addSkill: (skill) =>
    set((s) => ({
      profile: { ...s.profile, skills: [...s.profile.skills, skill] },
    })),
  removeSkill: (skill) =>
    set((s) => ({
      profile: { ...s.profile, skills: s.profile.skills.filter((sk) => sk !== skill) },
    })),
}))
