import { useCVStore } from '@/store/cvStore'

export function useCV() {
  const store = useCVStore()
  return store
}
