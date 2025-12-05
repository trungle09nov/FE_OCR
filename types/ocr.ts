export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRWord {
  id: string;
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface OCRLine {
  id: string;
  text: string;
  words: OCRWord[];
  confidence: number;
  boundingBox: BoundingBox;
}

export interface OCRBlock {
  id: string;
  text: string;
  lines: OCRLine[];
  confidence: number;
  boundingBox: BoundingBox;
  blockType?: 'text' | 'title' | 'table' | 'image';
}

export interface OCRPage {
  pageNumber: number;
  blocks: OCRBlock[];
  width: number;
  height: number;
  rotation?: number;
}

export interface OCRResult {
  id: string;
  documentId: string;
  pages: OCRPage[];
  fullText: string;
  language: string;
  averageConfidence: number;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OCRProcessingStatus {
  jobId: string;
  documentId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentPage?: number;
  totalPages?: number;
  message?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface RegionReprocessRequest {
  documentId: string;
  pageNumber: number;
  region: BoundingBox;
  options?: {
    language?: string;
    enhanceImage?: boolean;
  };
}
