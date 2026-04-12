import { create } from 'zustand'
import type { GeneratedCV, ViewType } from '@/types/cv'
import { MOCK_GENERATED_CVS } from '@/services/api'
import { genId } from './chatStore'

interface CVState {
  generatedCVs: GeneratedCV[]
  selectedCVId: number | null
  showCVPreview: boolean
  activePdfUrl: string | null
  selectedTemplate: number
  activeView: ViewType
  sidebarOpen: boolean

  addGeneratedCV: (cv: Omit<GeneratedCV, 'id'>) => void
  setSelectedCVId: (id: number | null) => void
  setShowCVPreview: (show: boolean) => void
  setActivePdfUrl: (url: string | null) => void
  setSelectedTemplate: (id: number) => void
  setActiveView: (view: ViewType) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useCVStore = create<CVState>((set) => ({
  generatedCVs: MOCK_GENERATED_CVS,
  selectedCVId: null,
  showCVPreview: false,
  activePdfUrl: null,
  selectedTemplate: 1,
  activeView: 'chat',
  sidebarOpen: true,

  addGeneratedCV: (cv) =>
    set((s) => ({
      generatedCVs: [{ ...cv, id: genId() }, ...s.generatedCVs],
    })),
  setSelectedCVId: (id) => set({ selectedCVId: id }),
  setShowCVPreview: (show) => set({ showCVPreview: show }),
  setActivePdfUrl: (url) => set({ activePdfUrl: url }),
  setSelectedTemplate: (id) => set({ selectedTemplate: id }),
  setActiveView: (view) => set({ activeView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
