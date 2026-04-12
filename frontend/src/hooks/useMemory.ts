import { useMemoryStore } from '@/store/memoryStore'

export function useMemory() {
  const { profile, setProfile, updateField, addSkill, removeSkill } = useMemoryStore()
  return { profile, setProfile, updateField, addSkill, removeSkill }
}
