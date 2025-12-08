// components/ocr/OCRViewer.tsx
import React from 'react';
import { OCRResult, OCRBlock } from '@/types/ocr';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CONFIG } from '@/lib/constants';

interface OCRViewerProps {
  ocrResult: OCRResult;
  onBlockSelect?: (blockId: string) => void;
  highlightLowConfidence?: boolean;
}

export function OCRViewer({
  ocrResult,
  onBlockSelect,
  highlightLowConfidence = true,
}: OCRViewerProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= CONFIG.CONFIDENCE_THRESHOLDS.HIGH) return 'bg-green-50';
    if (confidence >= CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= CONFIG.CONFIDENCE_THRESHOLDS.HIGH) return 'success';
    if (confidence >= CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-4">
      {ocrResult.pages.map((page, pageIdx) => (
        <Card key={pageIdx} className="p-6">
          <h3 className="font-semibold mb-4">Trang {page.pageNumber}</h3>
          <div className="space-y-3">
            {page.blocks.map((block: OCRBlock) => (
              <div
                key={block.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${getConfidenceColor(block.confidence)}`}
                onClick={() => onBlockSelect?.(block.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1">{block.text}</p>
                  <Badge variant={getConfidenceBadge(block.confidence)}>
                    {(block.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
                {block.blockType && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Loại: {block.blockType}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm font-medium">Độ tin cậy trung bình: {(ocrResult.averageConfidence * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}