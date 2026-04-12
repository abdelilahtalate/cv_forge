export interface Experience {
  id: number
  company: string
  role: string
  period: string
  bullets: string[]
}

export interface Education {
  id: number
  institution: string
  degree: string
  period: string
  gpa?: string
}

export interface Project {
  id: number
  name: string
  description: string
  tech: string[]
}

export interface Profile {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  summary: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
}
