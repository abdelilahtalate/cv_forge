import { useEffect, useState } from 'react'
import { useCVStore } from '@/store/cvStore'
import { useMemoryStore } from '@/store/memoryStore'
import { useChatStore } from '@/store/chatStore'
import Sidebar from '@/components/sidebar/Sidebar'
import ChatPage from '@/pages/ChatPage'
import TemplatesPage from '@/pages/TemplatesPage'
import SettingsPage from '@/pages/SettingsPage'
import HistoryPage from '@/pages/HistoryPage'
import LoginPage from '@/pages/LoginPage'

export default function App() {
  const {
    activeView,
    setActiveView,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    showCVPreview,
    setShowCVPreview,
    selectedCVId,
    setSelectedCVId,
    selectedTemplate,
    generatedCVs,
  } = useCVStore()

  const { user } = useChatStore()
  const { profile } = useMemoryStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
      if (e.key === 'Escape') {
        if (showCVPreview) {
          setShowCVPreview(false)
          setSelectedCVId(null)
        }
        if (mobileMenuOpen) setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showCVPreview, mobileMenuOpen, toggleSidebar, setShowCVPreview, setSelectedCVId])

  if (!user) {
    return <LoginPage />
  }

  const handleCVClick = (id: number) => {
    setSelectedCVId(id)
    setShowCVPreview(true)
    setActiveView('chat')
    setMobileMenuOpen(false)
  }

  const handleViewChange = (view: typeof activeView) => {
    setActiveView(view)
    setMobileMenuOpen(false)
  }

  const closeCVPreview = () => {
    setShowCVPreview(false)
    setSelectedCVId(null)
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#09090b]">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[#27272a] bg-[#1c1c21] text-zinc-400 transition-colors hover:text-zinc-200 md:hidden"
        aria-label="Open menu"
      >
        <i className="fa-solid fa-bars text-sm" />
      </button>

      {/* Sidebar — mobile overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden ${mobileMenuOpen ? 'animate-slide-left' : 'hidden'}`}
      >
        <Sidebar
          open={true}
          activeView={activeView}
          onViewChange={handleViewChange}
          generatedCVs={generatedCVs}
          onCVClick={handleCVClick}
          selectedCVId={selectedCVId}
          onToggle={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Sidebar — desktop */}
      <div className="hidden md:block">
        <Sidebar
          open={sidebarOpen}
          activeView={activeView}
          onViewChange={handleViewChange}
          generatedCVs={generatedCVs}
          onCVClick={handleCVClick}
          selectedCVId={selectedCVId}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main content */}
      <div className="relative flex min-w-0 flex-1">
        {/* Top accent line */}
        <div className="absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        {/* Page views */}
        <div className="flex min-w-0 flex-1 flex-col">
          {activeView === 'chat' && <ChatPage />}
          {activeView === 'profile' && <HistoryPage />}
          {activeView === 'templates' && <TemplatesPage />}
          {activeView === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  )
}
