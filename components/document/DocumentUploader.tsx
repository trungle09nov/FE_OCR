'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
  preview?: string;
}

interface DocumentUploaderProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export function DocumentUploader({
  onUpload,
  maxFiles = 10,
  className,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setErrors([]);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const newErrors = rejectedFiles.map((file) => {
          if (file.errors[0]?.code === 'file-too-large') {
            return `${file.file.name}: File quá lớn (max ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`;
          }
          if (file.errors[0]?.code === 'file-invalid-type') {
            return `${file.file.name}: Định dạng file không hợp lệ`;
          }
          return `${file.file.name}: ${file.errors[0]?.message}`;
        });
        setErrors(newErrors);
      }

      // Add accepted files
      const filesWithPreview = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        });
      });

      setFiles((prev) => [...prev, ...filesWithPreview].slice(0, maxFiles));
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.tiff'],
    },
    maxSize: CONFIG.MAX_FILE_SIZE,
    maxFiles,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      // Revoke preview URL
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = () => {
    if (files.length > 0 && onUpload) {
      onUpload(files);
      // Clear files after upload
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Thả file vào đây...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">
              Kéo thả file vào đây hoặc click để chọn
            </p>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ PDF và ảnh (PNG, JPG, WEBP, TIFF)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Tối đa {maxFiles} files, mỗi file tối đa{' '}
              {CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB
            </p>
          </>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive mb-2">
                  Có lỗi xảy ra:
                </p>
                <ul className="text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium">
                  Đã chọn {files.length} file{files.length > 1 ? 's' : ''}
                </p>
                <Button onClick={handleUpload} size="sm">
                  Upload tất cả
                </Button>
              </div>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <File className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
