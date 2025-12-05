export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type DocumentType = 'pdf' | 'image';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface DocumentUploadOptions {
  language: string;
  ocrEngine?: 'tesseract' | 'google' | 'aws';
  quality?: 'fast' | 'balanced' | 'accurate';
  autoRotate?: boolean;
  deskew?: boolean;
}

export interface UploadProgress {
  documentId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
}
