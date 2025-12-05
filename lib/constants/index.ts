export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/documents',
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: (id: string) => `/documents/${id}`,
  DOCUMENT_EDIT: (id: string) => `/documents/${id}/edit`,
  DOCUMENT_UPLOAD: '/documents/upload',
  HISTORY: '/history',
} as const;

export const API_ENDPOINTS = {
  // Documents
  DOCUMENTS: '/api/documents',
  DOCUMENT_DETAIL: (id: string) => `/api/documents/${id}`,
  DOCUMENT_UPLOAD: '/api/documents/upload',
  
  // OCR
  OCR_PROCESS: '/api/ocr/process',
  OCR_STATUS: (jobId: string) => `/api/ocr/status/${jobId}`,
  OCR_RESULT: (documentId: string) => `/api/ocr/result/${documentId}`,
  OCR_REPROCESS: '/api/ocr/reprocess',
  OCR_UPDATE: (documentId: string) => `/api/ocr/result/${documentId}`,
  
  // Export
  EXPORT: '/api/export',
} as const;

export const CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_FILE_TYPES: {
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff'],
  },
  POLLING_INTERVAL: 2000, // 2 seconds
  MAX_POLLING_ATTEMPTS: 150, // 5 minutes max
  
  OCR_LANGUAGES: [
    { value: 'vie', label: 'Tiếng Việt' },
    { value: 'eng', label: 'English' },
    { value: 'de', label: 'German' },
  ],
  
  OCR_ENGINES: [
    { value: 'tesseract', label: 'Tesseract OCR' },
    { value: 'google', label: 'Google Cloud Vision' },
    { value: 'aws', label: 'AWS Textract' },
  ],
  
  OCR_QUALITY: [
    { value: 'fast', label: 'Fast (Lower accuracy)' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'accurate', label: 'Accurate (Slower)' },
  ],
  
  CONFIDENCE_THRESHOLDS: {
    HIGH: 0.9,
    MEDIUM: 0.7,
    LOW: 0.5,
  },
} as const;
