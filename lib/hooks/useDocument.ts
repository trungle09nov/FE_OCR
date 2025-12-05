import { useCallback } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { DocumentUploadOptions } from '@/types/document';
import { toast } from 'sonner';

export function useDocument(documentId?: string) {
  const {
    documents,
    currentDocument,
    isLoading,
    error,
    uploadProgress,
    fetchDocuments,
    fetchDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument,
    clearError,
  } = useDocumentStore();

  // Load document on mount if ID provided
  const loadDocument = useCallback(async () => {
    if (documentId) {
      try {
        await fetchDocument(documentId);
      } catch (error: any) {
        toast.error('Failed to load document', {
          description: error.message,
        });
      }
    }
  }, [documentId, fetchDocument]);

  // Upload with toast notifications
  const handleUpload = useCallback(
    async (file: File, options: DocumentUploadOptions) => {
      try {
        const document = await uploadDocument(file, options);
        toast.success('Document uploaded successfully', {
          description: `${file.name} is being processed`,
        });
        return document;
      } catch (error: any) {
        toast.error('Upload failed', {
          description: error.message,
        });
        throw error;
      }
    },
    [uploadDocument]
  );

  // Delete with confirmation
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteDocument(id);
        toast.success('Document deleted successfully');
      } catch (error: any) {
        toast.error('Delete failed', {
          description: error.message,
        });
      }
    },
    [deleteDocument]
  );

  // Update with toast
  const handleUpdate = useCallback(
    async (id: string, updates: any) => {
      try {
        await updateDocument(id, updates);
        toast.success('Document updated successfully');
      } catch (error: any) {
        toast.error('Update failed', {
          description: error.message,
        });
      }
    },
    [updateDocument]
  );

  return {
    documents,
    currentDocument,
    isLoading,
    error,
    uploadProgress,
    loadDocument,
    fetchDocuments,
    handleUpload,
    handleDelete,
    handleUpdate,
    setCurrentDocument,
    clearError,
  };
}
