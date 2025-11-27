export type JobType = 'Full-Time' | 'Part-Time' | 'Remote' | 'Internship'
export type ApplicationStatus = 'Pending' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Accepted'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  salary?: string
  description: string
  requirements?: string
  postedDate?: string
  deadline?: string
  isActive?: boolean
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  applicantPhone?: string
  resume?: string
  coverLetter?: string
  status: ApplicationStatus
  appliedDate: string
  experience?: string
  education?: string
}