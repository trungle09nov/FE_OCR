// lib/hooks/useExport.ts
import { ocrApi } from '../api/ocr';
import { toast } from 'sonner';

export function useExport() {
  const handleExport = async (
    documentId: string,
    format: 'txt' | 'docx' | 'json' | 'pdf'
  ) => {
    try {
      const blob = await ocrApi.exportResult(documentId, format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error('Export failed', {
        description: error.message,
      });
    }
  };

  return { handleExport };
}