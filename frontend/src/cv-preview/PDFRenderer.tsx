import type { Profile } from '@/types/memory'
import type { Template } from '@/types/cv'

interface Props {
  profile: Profile
  template: Template
}

export default function PDFRenderer({ profile, template }: Props) {
  return (
    <div
      className="w-full max-w-[210mm] rounded-[4px] bg-white p-10 text-[#1a1a1a]"
      style={{
        fontSize: '10.5px',
        lineHeight: '1.6',
        minHeight: '297mm',
        boxShadow:
          '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.5), 0 12px 48px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div className="mb-5 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
          {profile.name}
        </h1>
        <p className="mt-0.5 text-sm font-medium text-gray-500">{profile.title}</p>
        <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-gray-400">
          <span>{profile.email}</span>
          <span className="text-gray-300">|</span>
          <span>{profile.phone}</span>
          <span className="text-gray-300">|</span>
          <span>{profile.location}</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-3 text-[10px] text-gray-400">
          <span>{profile.website}</span>
          <span className="text-gray-300">|</span>
          <span>{profile.linkedin}</span>
        </div>
        <div className="mx-auto mt-3 h-0.5 w-16" style={{ background: template.accent }} />
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider text-gray-800"
          style={{ borderColor: '#e5e5e5' }}
        >
          Professional Summary
        </h2>
        <p className="leading-relaxed text-gray-600">{profile.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider text-gray-800"
          style={{ borderColor: '#e5e5e5' }}
        >
          Experience
        </h2>
        {profile.experience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-bold text-gray-900">{exp.role}</span>
                <span className="text-gray-500"> — {exp.company}</span>
              </div>
              <span className="flex-shrink-0 text-[10px] text-gray-400">{exp.period}</span>
            </div>
            <ul className="mt-1.5 space-y-0.5 text-gray-600">
              {exp.bullets.map((b, bi) => (
                <li key={bi} className="flex gap-2">
                  <span className="mt-1.5 flex-shrink-0 text-[6px]" style={{ color: template.accent }}>
                    ●
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider text-gray-800"
          style={{ borderColor: '#e5e5e5' }}
        >
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((s, i) => (
            <span
              key={i}
              className="rounded px-2 py-0.5 text-[10px] font-medium"
              style={{
                background: template.accent + '18',
                color: template.accent,
                border: '1px solid ' + template.accent + '30',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-4">
        <h2
          className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider text-gray-800"
          style={{ borderColor: '#e5e5e5' }}
        >
          Projects
        </h2>
        {profile.projects.map((p) => (
          <div key={p.id} className="mb-2">
            <span className="font-bold text-gray-900">{p.name}</span>
            <span className="text-gray-500"> — {p.description}</span>
            <div className="mt-1 flex gap-1.5">
              {p.tech.map((t, ti) => (
                <span key={ti} className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-500">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div>
        <h2
          className="mb-2 border-b pb-1 text-xs font-bold uppercase tracking-wider text-gray-800"
          style={{ borderColor: '#e5e5e5' }}
        >
          Education
        </h2>
        {profile.education.map((edu) => (
          <div key={edu.id} className="mb-1 flex items-baseline justify-between">
            <div>
              <span className="font-bold text-gray-900">{edu.degree}</span>
              <span className="text-gray-500"> — {edu.institution}</span>
            </div>
            <span className="text-[10px] text-gray-400">
              {edu.period}
              {edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
