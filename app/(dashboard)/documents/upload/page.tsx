'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentUploader } from '@/components/document/DocumentUploader';
import { useDocument } from '@/lib/hooks/useDocument';
import { useOCR } from '@/lib/hooks/useOCR';
import { CONFIG, ROUTES } from '@/lib/constants';
import { DocumentUploadOptions } from '@/types/document';
import { toast } from 'sonner';

export default function UploadPage() {
  const router = useRouter();
  const { handleUpload } = useDocument();
  const { handleStartOCR } = useOCR();
  
  const [options, setOptions] = useState<DocumentUploadOptions>({
    language: 'vie',
    ocrEngine: 'tesseract',
    quality: 'balanced',
    autoRotate: true,
    deskew: true,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesUpload = async (files: File[]) => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Upload all files
      const uploadPromises = files.map((file) => handleUpload(file, options));
      const documents = await Promise.all(uploadPromises);
      
      // Start OCR for all documents
      const ocrPromises = documents.map((doc: any) => handleStartOCR(doc.id, options));
      await Promise.all(ocrPromises);
      
      toast.success(`Đã upload ${files.length} tài liệu`, {
        description: 'Quá trình OCR đã được bắt đầu',
      });
      
      // Redirect to documents page
      setTimeout(() => {
        router.push(ROUTES.DOCUMENTS);
      }, 1500);
    } catch (error: any) {
      const message = error.message || 'Upload thất bại';
      setError(message);
      toast.error('Upload thất bại', {
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href={ROUTES.DOCUMENTS}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Upload tài liệu</h1>
        <p className="text-muted-foreground">
          Upload và cấu hình xử lý OCR cho tài liệu của bạn
        </p>
      </div>

      {/* OCR Options */}
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình OCR</CardTitle>
          <CardDescription>
            Tùy chỉnh các tham số xử lý OCR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ngôn ngữ</label>
              <Select
                value={options.language}
                onValueChange={(value: string) =>
                  setOptions({ ...options, language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONFIG.OCR_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* OCR Engine */}
            <div className="space-y-2">
              <label className="text-sm font-medium">OCR Engine</label>
              <Select
                value={options.ocrEngine}
                onValueChange={(value: string) =>
                  setOptions({ ...options, ocrEngine: value as DocumentUploadOptions['ocrEngine'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONFIG.OCR_ENGINES.map((engine) => (
                    <SelectItem key={engine.value} value={engine.value}>
                      {engine.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chất lượng</label>
              <Select
                value={options.quality}
                onValueChange={(value: string) =>
                  setOptions({ ...options, quality: value as DocumentUploadOptions['quality'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONFIG.OCR_QUALITY.map((quality) => (
                    <SelectItem key={quality.value} value={quality.value}>
                      {quality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.autoRotate}
                onChange={(e: any) =>
                  setOptions({ ...options, autoRotate: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Tự động xoay</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.deskew}
                onChange={(e: any) =>
                  setOptions({ ...options, deskew: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Chỉnh nghiêng</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploader */}
      <DocumentUploader onUpload={handleFilesUpload} maxFiles={10} />

      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Đang upload và xử lý tài liệu...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
