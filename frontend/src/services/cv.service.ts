import type { Profile } from '@/types/memory'

export function buildResumeText(profile: Profile): string {
  const lines: string[] = [
    profile.name,
    profile.title,
    `${profile.email} | ${profile.phone} | ${profile.location}`,
    `${profile.website} | ${profile.linkedin}`,
    '',
    'PROFESSIONAL SUMMARY',
    profile.summary,
    '',
    'EXPERIENCE',
    ...profile.experience.flatMap((e) => [
      `${e.role} — ${e.company} (${e.period})`,
      ...e.bullets.map((b) => `  • ${b}`),
      '',
    ]),
    'SKILLS',
    profile.skills.join(', '),
    '',
    'EDUCATION',
    ...profile.education.map(
      (e) => `${e.degree} — ${e.institution} ${e.period}${e.gpa ? ` | GPA: ${e.gpa}` : ''}`,
    ),
  ]
  return lines.join('\n')
}
