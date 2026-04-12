import { useSettingsStore } from '@/store/settingsStore'
import Toggle from '@/components/Toggle'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="mb-2">
          <h2 className="font-display text-2xl font-bold text-zinc-100">Settings</h2>
          <p className="mt-1 text-sm text-zinc-500">Configure your CV Forge experience.</p>
        </div>

        {/* AI Model */}
        <div className="space-y-5 rounded-2xl border border-[#27272a] bg-[#1c1c21] p-5">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-zinc-200">
            <i className="fa-solid fa-microchip text-sm text-amber-500" />
            AI Model
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Model Selection</p>
              <p className="mt-0.5 text-xs text-zinc-500">Choose the AI model for CV generation</p>
            </div>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="cursor-pointer rounded-xl border border-[#27272a] bg-[#16161a] px-3 py-2 text-sm text-zinc-300 outline-none transition-colors focus:border-amber-500/30"
            >
              <option value="llama-3.1-70b">Llama 3.1 70B (Local)</option>
              <option value="mistral-7b">Mistral 7B (Local)</option>
              <option value="phi-3-medium">Phi-3 Medium (Local)</option>
              <option value="gpt-4o">GPT-4o (Online RAG)</option>
              <option value="claude-sonnet">Claude Sonnet (Online RAG)</option>
            </select>
          </div>
        </div>

        {/* Connectivity */}
        <div className="space-y-5 rounded-2xl border border-[#27272a] bg-[#1c1c21] p-5">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-zinc-200">
            <i className="fa-solid fa-wifi text-sm text-amber-500" />
            Connectivity
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Offline Mode</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Run everything locally — no data leaves your device
              </p>
            </div>
            <Toggle
              value={settings.offlineMode}
              onChange={(v) => updateSettings({ offlineMode: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">RAG Enhancement</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Fetch live job data from the web for better targeting
              </p>
            </div>
            <Toggle
              value={!settings.offlineMode}
              onChange={(v) => updateSettings({ offlineMode: !v })}
            />
          </div>
        </div>

        {/* Generation */}
        <div className="space-y-5 rounded-2xl border border-[#27272a] bg-[#1c1c21] p-5">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-zinc-200">
            <i className="fa-solid fa-sliders text-sm text-amber-500" />
            Generation
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Auto-show Preview</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Automatically open CV preview after generation
              </p>
            </div>
            <Toggle
              value={settings.autoPreview}
              onChange={(v) => updateSettings({ autoPreview: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Typing Animation</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Show character-by-character AI response
              </p>
            </div>
            <Toggle
              value={settings.typingAnim}
              onChange={(v) => updateSettings({ typingAnim: v })}
            />
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-[#27272a] bg-[#1c1c21] p-5">
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-zinc-200">
            <i className="fa-solid fa-circle-info text-sm text-amber-500" />
            About
          </h3>
          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-mono text-xs text-zinc-300">0.9.0-beta</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span className="font-mono text-xs text-zinc-300">2024.12.15</span>
            </div>
            <div className="flex justify-between">
              <span>Runtime</span>
              <span className="font-mono text-xs text-zinc-300">Local-first</span>
            </div>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  )
}
