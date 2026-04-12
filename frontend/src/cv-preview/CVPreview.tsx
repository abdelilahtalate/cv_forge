import type { Profile } from '@/types/memory'
import { MOCK_TEMPLATES } from '@/services/api'
import PDFRenderer from './PDFRenderer'

interface Props {
  profile: Profile
  templateId: number
  onClose: () => void
}

export default function CVPreview({ profile, templateId, onClose }: Props) {
  const template = MOCK_TEMPLATES.find((t) => t.id === templateId) ?? MOCK_TEMPLATES[0]

  return (
    <div className="flex h-full animate-slide-right flex-col border-l border-[#27272a] bg-[#0f0f12]">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[#27272a] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-display text-sm font-semibold text-zinc-200">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-300"
            aria-label="Download PDF"
          >
            <i className="fa-solid fa-download text-xs" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-300 md:hidden"
            aria-label="Close preview"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>
      </div>

      {/* Scrollable paper */}
      <div className="flex flex-1 justify-center overflow-y-auto p-6">
        <PDFRenderer profile={profile} template={template} />
      </div>
    </div>
  )
}
