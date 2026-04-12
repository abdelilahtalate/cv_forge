import { useCVStore } from '@/store/cvStore'
import { MOCK_TEMPLATES } from '@/services/api'
import TemplateThumb from '@/cv-preview/TemplateThumb'

export default function TemplatesPage() {
  const { selectedTemplate, setSelectedTemplate } = useCVStore()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-zinc-100">Templates</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose a layout that matches your industry and style preference.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TEMPLATES.map((t) => (
            <TemplateThumb
              key={t.id}
              template={t}
              selected={selectedTemplate === t.id}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>
        <div className="h-6" />
      </div>
    </div>
  )
}
