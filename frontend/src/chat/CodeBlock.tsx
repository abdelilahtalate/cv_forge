import { useState } from 'react'

interface Props {
  code: string
  language?: string
}

export default function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const highlighted = code.split('\n').map((line, i) => {
    const html = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(\\[a-zA-Z]+)/g, '<span class="text-purple-400">$1</span>')
      .replace(/(\{[^}]*\})/g, '<span class="text-cyan-300">$1</span>')
      .replace(/(%.*$)/g, '<span class="text-zinc-600 italic">$1</span>')
    return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
  })

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#27272a] bg-[#0d0d10] font-mono text-[13px] leading-relaxed">
      <div className="flex items-center justify-between border-b border-[#27272a] px-4 py-2">
        <span className="text-xs font-medium text-zinc-500">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          aria-label="Copy code"
        >
          <i className={`fa-regular ${copied ? 'fa-circle-check text-emerald-400' : 'fa-copy'}`} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-zinc-300">{highlighted}</pre>
    </div>
  )
}
