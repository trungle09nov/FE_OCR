import { useCallback, useEffect } from 'react';
import { useOCRStore } from '../store/ocrStore';
import { toast } from 'sonner';

export function useOCR(documentId?: string) {
  const {
    ocrResults,
    processingStatus,
    isLoading,
    error,
    startOCR,
    getResult,
    updateResult,
    clearError,
  } = useOCRStore();

  const ocrResult = documentId ? ocrResults.get(documentId) : null;

  // Load OCR result on mount if documentId provided
  useEffect(() => {
    if (documentId && !ocrResult) {
      handleLoadResult(documentId);
    }
  }, [documentId]);

  const handleLoadResult = useCallback(
    async (docId: string) => {
      try {
        await getResult(docId);
      } catch (error: any) {
        // Silently fail if no result exists yet
        console.error('Failed to load OCR result:', error);
      }
    },
    [getResult]
  );

  const handleStartOCR = useCallback(
    async (docId: string, options?: any) => {
      try {
        const jobId = await startOCR(docId, options);
        toast.info('OCR processing started', {
          description: 'We will notify you when processing is complete',
        });
        return jobId;
      } catch (error: any) {
        toast.error('Failed to start OCR', {
          description: error.message,
        });
        throw error;
      }
    },
    [startOCR]
  );

  const handleUpdateResult = useCallback(
    async (docId: string, updates: any) => {
      try {
        await updateResult(docId, updates);
        toast.success('OCR result updated successfully');
      } catch (error: any) {
        toast.error('Update failed', {
          description: error.message,
        });
      }
    },
    [updateResult]
  );

  // Get processing status for current document
  const currentStatus = documentId
    ? Array.from(processingStatus.values()).find(
        (status) => status.documentId === documentId
      )
    : null;

  return {
    ocrResult,
    ocrResults,
    processingStatus: currentStatus,
    allProcessingStatus: processingStatus,
    isLoading,
    error,
    handleStartOCR,
    handleLoadResult,
    handleUpdateResult,
    clearError,
  };
}
