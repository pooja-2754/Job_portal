export interface Resume {
  id: number;
  name: string;
  fileUrl: string;
  previewUrl: string;
  cloudinaryId: string;
  createdAt: string | number[];
  isPrimary?: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UploadResumeResponse {
  id: number;
  name: string;
  fileUrl: string;
  previewUrl: string;
  cloudinaryId: string;
  createdAt: string | number[];
  isPrimary?: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ResumeUploadFormData {
  file: File;
}