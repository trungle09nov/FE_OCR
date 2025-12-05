'use client';

import Link from 'next/link';
import { FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold text-xl">OCR Processor</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href={ROUTES.DOCUMENTS}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Tài liệu
          </Link>
          <Link
            href={ROUTES.HISTORY}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Lịch sử
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={ROUTES.DOCUMENT_UPLOAD}>
            <Button>Upload tài liệu</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
