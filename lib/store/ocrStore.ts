import { create } from 'zustand';
import { OCRResult, OCRProcessingStatus } from '@/types/ocr';
import { ocrApi } from '../api/ocr';

interface OCRStore {
  // State
  ocrResults: Map<string, OCRResult>;
  processingStatus: Map<string, OCRProcessingStatus>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startOCR: (documentId: string, options?: any) => Promise<string>;
  pollStatus: (jobId: string, documentId: string) => Promise<void>;
  getResult: (documentId: string) => Promise<OCRResult>;
  updateResult: (documentId: string, result: Partial<OCRResult>) => Promise<void>;
  setProcessingStatus: (jobId: string, status: OCRProcessingStatus) => void;
  clearError: () => void;
}

export const useOCRStore = create<OCRStore>((set, get) => ({
  // Initial state
  ocrResults: new Map(),
  processingStatus: new Map(),
  isLoading: false,
  error: null,

  // Start OCR processing
  startOCR: async (documentId, options) => {
    set({ error: null });
    try {
      const { jobId } = await ocrApi.startOCR(documentId, options);
      
      // Initialize status
      get().setProcessingStatus(jobId, {
        jobId,
        documentId,
        status: 'queued',
        progress: 0,
        startedAt: new Date().toISOString(),
      });

      // Start polling
      get().pollStatus(jobId, documentId);
      
      return jobId;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Poll for OCR status
  pollStatus: async (jobId, documentId) => {
    const maxAttempts = 150; // 5 minutes max (2s interval)
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await ocrApi.getStatus(jobId);
        get().setProcessingStatus(jobId, status);

        if (status.status === 'completed') {
          // Fetch final result
          const result = await ocrApi.getResult(documentId);
          const resultsMap = new Map(get().ocrResults);
          resultsMap.set(documentId, result);
          set({ ocrResults: resultsMap });
          return;
        }

        if (status.status === 'failed') {
          set({ error: status.error || 'OCR processing failed' });
          return;
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          set({ error: 'OCR processing timeout' });
        }
      } catch (error: any) {
        set({ error: error.message });
      }
    };

    poll();
  },

  // Get OCR result
  getResult: async (documentId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await ocrApi.getResult(documentId);
      const resultsMap = new Map(get().ocrResults);
      resultsMap.set(documentId, result);
      set({ ocrResults: resultsMap, isLoading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update OCR result (after editing)
  updateResult: async (documentId, updates) => {
    set({ error: null });
    try {
      const updated = await ocrApi.updateResult(documentId, updates);
      const resultsMap = new Map(get().ocrResults);
      resultsMap.set(documentId, updated);
      set({ ocrResults: resultsMap });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setProcessingStatus: (jobId, status) => {
    const statusMap = new Map(get().processingStatus);
    statusMap.set(jobId, status);
    set({ processingStatus: statusMap });
  },

  clearError: () => set({ error: null }),
}));
