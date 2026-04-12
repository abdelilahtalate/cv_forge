import { useRef, useState } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export default function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const canSend = value.trim() && !disabled

  return (
    <div className="border-t border-[#27272a] p-4">
      <div className="input-glow mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-[#27272a] bg-[#16161a] px-4 py-2.5 transition-all duration-200">
        <button
          className="mb-0.5 flex-shrink-0 p-1 text-zinc-500 transition-colors hover:text-zinc-300"
          aria-label="Attach file"
        >
          <i className="fa-solid fa-paperclip text-sm" />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you need..."
          rows={1}
          className="max-h-40 flex-1 resize-none border-none bg-transparent text-[15px] leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600"
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`mb-0.5 flex-shrink-0 rounded-xl p-2 transition-all duration-200 ${
            canSend
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400'
              : 'cursor-not-allowed bg-zinc-800 text-zinc-600'
          }`}
          aria-label="Send message"
        >
          <i className="fa-solid fa-arrow-up text-sm font-bold" />
        </button>
      </div>
      <p className="mt-2.5 text-center text-xs text-zinc-600">
        CV Forge runs locally. Your data never leaves your device.
      </p>
    </div>
  )
}
