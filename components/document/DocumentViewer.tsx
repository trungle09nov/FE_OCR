// components/document/DocumentViewer.tsx
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document as DocumentType } from '@/types/document';

interface DocumentViewerProps {
  document: DocumentType;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DocumentViewer({
  document,
  currentPage = 1,
  onPageChange,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [numPages, setNumPages] = useState<number | null>(null);

  if (document.type === 'pdf') {
    return (
      <div className="border rounded-lg overflow-hidden flex flex-col h-full">
        <div className="bg-muted p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} / {numPages || '?'}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(Math.min(numPages || currentPage, currentPage + 1))}
              disabled={currentPage === numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto flex justify-center items-start bg-black p-4">
          <Document
            file={document.fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page
              pageNumber={currentPage}
              scale={zoom / 100}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    );
  }

  // Image viewer
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-4 flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
        <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-center items-center bg-black p-4 max-h-96 overflow-auto">
        <img
          src={document.fileUrl}
          alt={document.name}
          style={{ maxWidth: '100%', maxHeight: '100%', width: `${zoom}%` }}
        />
      </div>
    </div>
  );
}