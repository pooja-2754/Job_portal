export type JobType = 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'INTERNSHIP'
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type WorkplaceType = 'ONSITE' | 'REMOTE' | 'HYBRID'
export type ExperienceLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD'
export type SalaryPeriod = 'HOURLY' | 'MONTHLY' | 'YEARLY'
export type ApplicationStatus = 'Pending' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Accepted'

// Legacy types for backward compatibility
export type JobTypeLegacy = 'Full-Time' | 'Part-Time' | 'Remote' | 'Internship'
export type JobTypeApi = JobType

// Interface for API requests that matches backend expectations
export interface JobApiRequest {
  title: string;
  description: string;
  status: JobStatus;
  type: JobType;
  workplaceType: WorkplaceType;
  experienceLevel?: ExperienceLevel;
  companyId?: number;
  companyName?: string;
  companyWebsite?: string;
  companyLogoUrl?: string;
  companyDescription?: string;
  companyIndustry?: string;
  companySize?: string;
  salary?: SalaryRequest;
  location?: LocationRequest;
  skills?: string[];
  applyUrl?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  deadline?: string;
  isActive?: boolean;
}

export interface SalaryRequest {
  min: number;
  max: number;
  currency: string;
  period: SalaryPeriod;
  isNegotiable: boolean;
}

export interface LocationRequest {
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Legacy interface for backward compatibility
export interface JobApiRequestLegacy {
  title: string;
  companyId?: number;
  company?: Company;
  location?: Location;
  type: JobTypeApi;
  typeDisplayName?: string;
  workplaceType?: string;
  experienceLevel?: string;
  salary?: Salary | string;
  description: string;
  descriptionHtml?: string;
  responsibilities?: string;
  responsibilitiesHtml?: string;
  requirements?: string;
  requirementsHtml?: string;
  benefits?: string;
  benefitsHtml?: string;
  skills?: string[];
  applyUrl?: string;
  deadline?: string;
  isActive?: boolean;
  postedDate?: string;
}

export interface Job {
  id: string
  slug?: string | null
  title: string
  company: Company
  location: Location
  type: JobType
  status?: JobStatus
  typeDisplayName?: string
  workplaceType?: WorkplaceType
  experienceLevel?: ExperienceLevel
  salary: Salary | string;
  description: string
  descriptionHtml?: string
  responsibilities?: string
  responsibilitiesHtml?: string
  requirements?: string
  requirementsHtml?: string
  benefits?: string
  benefitsHtml?: string
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