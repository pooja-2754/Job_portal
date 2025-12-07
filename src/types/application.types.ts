export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  jobCompany: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string;
  resumePreviewUrl: string;
  coverLetter: string;
  experience: string;
  education: string;
  status: ApplicationStatus;
  statusDisplayName: string;
  appliedDate: string | number[];
  updatedAt: string | number[];
}

export interface ApplicationsResponse {
  content: Application[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  empty: boolean;
}

export interface ApplicationsQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}