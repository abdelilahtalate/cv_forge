import type { Template } from '@/types/cv'

interface Props {
  template: Template
  selected: boolean
  onSelect: (id: number) => void
}

export default function TemplateThumb({ template, selected, onSelect }: Props) {
  const isDual = template.layout === 'dual'

  return (
    <div
      className={`template-card cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        selected
          ? 'border-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.12)]'
          : 'border-[#27272a] bg-[#1c1c21]'
      }`}
      onClick={() => onSelect(template.id)}
    >
      {/* Mini preview */}
      <div className="relative h-36 overflow-hidden bg-[#16161a] p-4">
        {isDual ? (
          <div className="flex h-full gap-2">
            <div className="flex w-1/3 flex-col gap-1.5 rounded bg-white/5 p-2">
              <div className="h-1.5 w-8 rounded-full" style={{ background: template.accent + '60' }} />
              <div className="h-1 w-full rounded bg-white/5" />
              <div className="h-1 w-3/4 rounded bg-white/5" />
              <div className="h-1 w-full rounded bg-white/5" />
              <div className="flex-1" />
              <div className="h-1 w-full rounded bg-white/5" />
              <div className="h-1 w-2/3 rounded bg-white/5" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 rounded bg-white/[0.03] p-2">
              <div className="h-2 w-16 rounded-full" style={{ background: template.accent + '40' }} />
              <div className="h-px w-full" style={{ background: template.accent + '20' }} />
              <div className="h-1 w-full rounded bg-white/5" />
              <div className="h-1 w-5/6 rounded bg-white/5" />
              <div className="flex-1" />
              <div className="h-1 w-full rounded bg-white/5" />
              <div className="h-1 w-4/5 rounded bg-white/5" />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-1.5 rounded bg-white/[0.03] p-3">
            <div className="mx-auto h-2 w-16 rounded-full" style={{ background: template.accent + '40' }} />
            <div className="mx-auto h-1 w-20 rounded bg-white/5" />
            <div className="mx-auto mt-1 h-px w-12" style={{ background: template.accent + '30' }} />
            <div className="h-1 w-full rounded bg-white/5" />
            <div className="h-1 w-5/6 rounded bg-white/5" />
            <div className="h-1 w-full rounded bg-white/5" />
            <div className="flex-1" />
            <div className="h-1 w-full rounded bg-white/5" />
            <div className="h-1 w-3/4 rounded bg-white/5" />
          </div>
        )}
        {selected && (
          <div
            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: template.accent }}
          >
            <i className="fa-solid fa-check text-[9px] text-white" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-zinc-200">{template.name}</p>
          <p className="text-xs text-zinc-500">{template.desc}</p>
        </div>
        <div className="h-3 w-3 rounded-full" style={{ background: template.accent }} />
      </div>
    </div>
  )
}
