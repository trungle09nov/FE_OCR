import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';
import { Document, DocumentUploadOptions } from '@/types/document';

export const documentApi = {
  // Get all documents
  async getDocuments(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ documents: Document[]; total: number }> {
    return apiClient.get(API_ENDPOINTS.DOCUMENTS, { params });
  },

  // Get single document
  async getDocument(id: string): Promise<Document> {
    return apiClient.get(API_ENDPOINTS.DOCUMENT_DETAIL(id));
  },

  // Upload document
  async uploadDocument(
    file: File,
    options: DocumentUploadOptions,
    onProgress?: (progress: number) => void
  ): Promise<{ document: Document; jobId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    return apiClient.post(API_ENDPOINTS.DOCUMENT_UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Update document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    return apiClient.put(API_ENDPOINTS.DOCUMENT_DETAIL(id), updates);
  },

  // Delete document
  async deleteDocument(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.DOCUMENT_DETAIL(id));
  },

  // Bulk delete
  async bulkDelete(ids: string[]): Promise<void> {
    return apiClient.post(`${API_ENDPOINTS.DOCUMENTS}/bulk-delete`, { ids });
  },
};
