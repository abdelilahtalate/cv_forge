import { useState } from 'react'
import { useMemoryStore } from '@/store/memoryStore'
import type { Profile } from '@/types/memory'

interface SectionProps {
  title: string
  icon: string
  children: React.ReactNode
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div className="rounded-2xl border border-[#27272a] bg-[#1c1c21] p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <i className={`fa-solid ${icon} text-sm text-amber-500`} />
        <h3 className="font-display text-sm font-semibold text-zinc-200">{title}</h3>
      </div>
      {children}
    </div>
  )
}

interface EditableFieldProps {
  value: string
  onSave: (v: string) => void
  multiline?: boolean
}

function EditableField({ value, onSave, multiline }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const save = () => {
    if (draft.trim()) onSave(draft.trim())
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex gap-2">
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 resize-none rounded-xl border border-amber-500/30 bg-[#16161a] px-3 py-2 text-sm text-zinc-200 outline-none"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 rounded-xl border border-amber-500/30 bg-[#16161a] px-3 py-2 text-sm text-zinc-200 outline-none"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
        )}
        <button
          onClick={save}
          className="rounded-xl bg-amber-500/15 px-3 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/25"
        >
          <i className="fa-solid fa-check" />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-700"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
    )
  }

  return (
    <div
      className="group flex cursor-pointer items-start justify-between gap-2"
      onClick={() => { setDraft(value); setEditing(true) }}
    >
      <span className="text-sm text-zinc-300">{value || <span className="italic text-zinc-600">Not set</span>}</span>
      <i className="fa-solid fa-pen mt-1 flex-shrink-0 text-xs text-zinc-700 transition-colors group-hover:text-zinc-400" />
    </div>
  )
}

export default function HistoryPage() {
  const { profile, updateField, addSkill, removeSkill } = useMemoryStore()
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !profile.skills.includes(trimmed)) {
      addSkill(trimmed)
      setNewSkill('')
    }
  }

  const updateProfile = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    updateField(key, value)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-zinc-100">Profile Memory</h2>
          <p className="mt-1 text-sm text-zinc-500">
            This data fuels all CV generations. Keep it updated for best results.
          </p>
        </div>

        {/* Personal Info */}
        <Section title="Personal Information" icon="fa-user">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Full Name</label>
              <div className="mt-1">
                <EditableField value={profile.name} onSave={(v) => updateProfile('name', v)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Title</label>
              <div className="mt-1">
                <EditableField value={profile.title} onSave={(v) => updateProfile('title', v)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Email</label>
                <div className="mt-1">
                  <EditableField value={profile.email} onSave={(v) => updateProfile('email', v)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Phone</label>
                <div className="mt-1">
                  <EditableField value={profile.phone} onSave={(v) => updateProfile('phone', v)} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Location</label>
                <div className="mt-1">
                  <EditableField value={profile.location} onSave={(v) => updateProfile('location', v)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Website</label>
                <div className="mt-1">
                  <EditableField value={profile.website} onSave={(v) => updateProfile('website', v)} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Summary */}
        <Section title="Professional Summary" icon="fa-align-left">
          <EditableField
            value={profile.summary}
            onSave={(v) => updateProfile('summary', v)}
            multiline
          />
        </Section>

        {/* Skills */}
        <Section title="Skills" icon="fa-code">
          <div className="mb-3 flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#27272a] bg-[#16161a] px-3 py-1.5 text-sm text-zinc-300 transition-all hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
              >
                {s}
                <button
                  onClick={() => removeSkill(s)}
                  className="ml-0.5 text-zinc-600 transition-colors hover:text-red-400"
                  aria-label={`Remove ${s}`}
                >
                  <i className="fa-solid fa-xmark text-[10px]" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add a skill..."
              className="flex-1 rounded-xl border border-[#27272a] bg-[#16161a] px-3 py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-amber-500/30 transition-colors"
            />
            <button
              onClick={handleAddSkill}
              className="rounded-xl bg-amber-500/15 px-3 py-2 text-sm text-amber-400 transition-colors hover:bg-amber-500/25"
            >
              <i className="fa-solid fa-plus" />
            </button>
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience" icon="fa-briefcase">
          <div className="space-y-4">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="rounded-xl border border-[#27272a] bg-[#16161a] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{exp.role}</p>
                    <p className="text-sm text-amber-500/80">{exp.company}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{exp.period}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-2 text-sm text-zinc-400">
                      <span className="mt-1.5 flex-shrink-0 text-[6px] text-amber-500/50">●</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon="fa-graduation-cap">
          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div
                key={edu.id}
                className="flex items-center justify-between rounded-xl border border-[#27272a] bg-[#16161a] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{edu.degree}</p>
                  <p className="text-sm text-zinc-400">
                    {edu.institution}
                    {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-zinc-500">{edu.period}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Projects" icon="fa-rocket">
          <div className="space-y-3">
            {profile.projects.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-[#27272a] bg-[#16161a] px-4 py-3"
              >
                <p className="text-sm font-semibold text-zinc-200">{p.name}</p>
                <p className="mt-0.5 text-sm text-zinc-400">{p.description}</p>
                <div className="mt-2 flex gap-1.5">
                  {p.tech.map((t, ti) => (
                    <span
                      key={ti}
                      className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="h-6" />
      </div>
    </div>
  )
}
