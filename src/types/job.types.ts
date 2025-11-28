export type JobType = 'Full-Time' | 'Part-Time' | 'Remote' | 'Internship'
export type ApplicationStatus = 'Pending' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Accepted'

export interface Job {
  id: string
  slug?: string | null
  title: string
  company: Company
  location: Location
  type: JobType
  typeDisplayName?: string
  workplaceType?: string
  experienceLevel?: string
  salary: Salary | string;
  description: string
  descriptionHtml?: string
  responsibilities?: string
  requirements?: string
  requirementsHtml?: string
  benefits?: string
  skills?: string[]
  applyUrl?: string
  postedDate?: string
  deadline?: string
  daysUntilDeadline?: number
  isActive?: boolean
  applicationCount?: number
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

export interface Salary {
  min: number | null;
  max: number | null;
  currency: string | null;
  period: string;
  isNegotiable: boolean | null;
  formatted: string | null;
}


export type CompanyStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  ownerId?: string;
  status?: CompanyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyCreateRequest {
  name: string;
  description: string;
  website: string;
  location: string;
  industry?: string;
  size?: string;
}

export interface CompanyUpdateRequest {
  name?: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  size?: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}