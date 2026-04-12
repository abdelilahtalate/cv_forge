import React from 'react'

export interface ContentPart {
  type: 'text' | 'code'
  content: string
  language?: string
}

export function parseContent(text: string): ContentPart[] {
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  const parts: ContentPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', language: match[1], content: match[2].trim() })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }
  return parts.length ? parts : [{ type: 'text', content: text }]
}

export function renderFormattedText(text: string): React.ReactNode {
  const lines = text.split('\n')
  return React.createElement(
    React.Fragment,
    null,
    lines.map((line, i) => {
      const parts: React.ReactNode[] = []
      const boldRegex = /\*\*(.+?)\*\*/g
      let lastIdx = 0
      let m: RegExpExecArray | null
      while ((m = boldRegex.exec(line)) !== null) {
        if (m.index > lastIdx)
          parts.push(React.createElement('span', { key: `t${i}p${lastIdx}` }, line.slice(lastIdx, m.index)))
        parts.push(
          React.createElement('strong', { key: `b${i}p${m.index}`, className: 'font-semibold text-zinc-100' }, m[1]),
        )
        lastIdx = boldRegex.lastIndex
      }
      if (lastIdx < line.length)
        parts.push(React.createElement('span', { key: `e${i}p${lastIdx}` }, line.slice(lastIdx)))
      if (parts.length === 0)
        parts.push(React.createElement('span', { key: `l${i}` }, line))

      return React.createElement(
        React.Fragment,
        { key: `ln${i}` },
        i > 0 && React.createElement('br'),
        line.trim() === '' ? React.createElement('br') : parts,
      )
    }),
  )
}
