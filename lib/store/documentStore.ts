import { create } from 'zustand';
import { Document, DocumentUploadOptions, UploadProgress } from '@/types/document';
import { documentApi } from '../api/documents';

interface DocumentStore {
  // State
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: Map<string, UploadProgress>;
  
  // Actions
  fetchDocuments: (params?: any) => Promise<void>;
  fetchDocument: (id: string) => Promise<void>;
  uploadDocument: (file: File, options: DocumentUploadOptions) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  setUploadProgress: (fileName: string, progress: UploadProgress) => void;
  clearError: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  uploadProgress: new Map(),

  // Fetch all documents
  fetchDocuments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { documents } = await documentApi.getDocuments(params);
      set({ documents, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch single document
  fetchDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const document = await documentApi.getDocument(id);
      set({ currentDocument: document, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Upload document
  uploadDocument: async (file, options) => {
    const fileName = file.name;
    set({ error: null });
    
    try {
      // Set initial progress
      let progressMap = new Map(get().uploadProgress);
      progressMap.set(fileName, {
        documentId: '',
        fileName,
        progress: 0,
        status: 'uploading',
      });
      set({ uploadProgress: progressMap });

      // Upload with progress callback
      const { document, jobId } = await documentApi.uploadDocument(
        file,
        options,
        (progress) => {
          const progressMap2 = new Map(get().uploadProgress);
          progressMap2.set(fileName, {
            documentId: document?.id || '',
            fileName,
            progress,
            status: 'uploading',
          });
          set({ uploadProgress: progressMap2 });
        }
      );

      // Update progress to processing
      const progressMap3 = new Map(get().uploadProgress);
      progressMap3.set(fileName, {
        documentId: document.id,
        fileName,
        progress: 100,
        status: 'processing',
      });
      set({ uploadProgress: progressMap3 });

      // Add to documents list
      set((state) => ({
        documents: [document, ...state.documents],
      }));

      return document;
    } catch (error: any) {
      const progressMap4 = new Map(get().uploadProgress);
      progressMap4.set(fileName, {
        documentId: '',
        fileName,
        progress: 0,
        status: 'failed',
        error: error.message,
      });
      set({ uploadProgress: progressMap4, error: error.message });
      throw error;
    }
  },

  // Update document
  updateDocument: async (id, updates) => {
    set({ error: null });
    try {
      const updated = await documentApi.updateDocument(id, updates);
      set((state) => ({
        documents: state.documents.map((doc) => (doc.id === id ? updated : doc)),
        currentDocument: state.currentDocument?.id === id ? updated : state.currentDocument,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Delete document
  deleteDocument: async (id) => {
    set({ error: null });
    try {
      await documentApi.deleteDocument(id);
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
        currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setCurrentDocument: (document) => set({ currentDocument: document }),
  
  setUploadProgress: (fileName, progress) => {
    const progressMap = new Map(get().uploadProgress);
    progressMap.set(fileName, progress);
    set({ uploadProgress: progressMap });
  },

  clearError: () => set({ error: null }),
}));
