import { useState } from 'react'
import { chatApi } from '@/services/api'
import { useChatStore } from '@/store/chatStore'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setUser = useChatStore((s) => s.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const user = await chatApi.login(name.trim())
      setUser(user)
    } catch (err) {
      setError('Failed to connect to the forge. Is the backend running?')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#09090b] px-4">
      {/* Background Glow */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
        <div className="h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="glass-card overflow-hidden rounded-3xl border border-[#27272a] bg-[#16161a]/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30">
              <i className="fa-solid fa-fire text-3xl text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              CV Forge
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              Forge your professional identity with AI.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-400"
              >
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should I call you?"
                className="w-full rounded-xl border border-[#27272a] bg-[#1c1c21]/50 px-4 py-3 text-zinc-200 outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
                autoFocus
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-center text-xs text-red-500 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className={`relative w-full overflow-hidden rounded-xl py-4 font-bold transition-all duration-300 ${
                isLoading || !name.trim()
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin" />
              ) : (
                'Enter the Forge'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-zinc-600">
            By entering, you agree to local data processing on this device.
          </p>
        </div>
      </div>
    </div>
  )
}
