'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { File, FileText, MoreVertical, Download, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document, DocumentStatus } from '@/types/document';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
  onDownload?: (document: Document) => void;
}

const statusConfig: Record<DocumentStatus, { label: string; variant: any }> = {
  pending: { label: 'Chờ xử lý', variant: 'outline' },
  processing: { label: 'Đang xử lý', variant: 'default' },
  completed: { label: 'Hoàn thành', variant: 'success' },
  failed: { label: 'Thất bại', variant: 'destructive' },
};

export function DocumentCard({ document, onDelete, onDownload }: DocumentCardProps) {
  const statusInfo = statusConfig[document.status];

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Thumbnail or Icon */}
          <div className="flex-shrink-0">
            {document.thumbnailUrl ? (
              <img
                src={document.thumbnailUrl}
                alt={document.name}
                className="h-20 w-20 object-cover rounded-lg border"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg border bg-muted flex items-center justify-center">
                {document.type === 'pdf' ? (
                  <FileText className="h-10 w-10 text-muted-foreground" />
                ) : (
                  <File className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {document.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.DOCUMENT_DETAIL(document.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Link>
                  </DropdownMenuItem>
                  {onDownload && (
                    <DropdownMenuItem onClick={() => onDownload(document)}>
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(document.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Loại: {document.type.toUpperCase()}
                {document.pageCount && ` • ${document.pageCount} trang`}
              </p>
              <p>Kích thước: {(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              <p>
                {format(new Date(document.createdAt), 'dd MMM yyyy, HH:mm', {
                  locale: vi,
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          
          {document.status === 'completed' && (
            <Link href={ROUTES.DOCUMENT_DETAIL(document.id)}>
              <Button size="sm" variant="outline">
                Xem kết quả
              </Button>
            </Link>
          )}
          
          {document.status === 'processing' && (
            <span className="text-sm text-muted-foreground">
              Đang xử lý...
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
