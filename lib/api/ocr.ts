import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';
import { OCRResult, OCRProcessingStatus, RegionReprocessRequest } from '@/types/ocr';

export const ocrApi = {
  // Start OCR processing
  async startOCR(documentId: string, options?: any): Promise<{ jobId: string }> {
    return apiClient.post(API_ENDPOINTS.OCR_PROCESS, {
      documentId,
      options,
    });
  },

  // Get OCR status
  async getStatus(jobId: string): Promise<OCRProcessingStatus> {
    return apiClient.get(API_ENDPOINTS.OCR_STATUS(jobId));
  },

  // Get OCR result
  async getResult(documentId: string): Promise<OCRResult> {
    return apiClient.get(API_ENDPOINTS.OCR_RESULT(documentId));
  },

  // Update OCR result (after editing)
  async updateResult(documentId: string, result: Partial<OCRResult>): Promise<OCRResult> {
    return apiClient.put(API_ENDPOINTS.OCR_UPDATE(documentId), result);
  },

  // Reprocess a specific region
  async reprocessRegion(request: RegionReprocessRequest): Promise<{ jobId: string }> {
    return apiClient.post(API_ENDPOINTS.OCR_REPROCESS, request);
  },

  // Export OCR result
  async exportResult(
    documentId: string,
    format: 'txt' | 'docx' | 'json' | 'pdf'
  ): Promise<Blob> {
    const response = await apiClient.post(
      API_ENDPOINTS.EXPORT,
      { documentId, format },
      { responseType: 'blob' }
    );
    return response as unknown as Blob;
  },
};
