# OCR Document Processor - Frontend

Hệ thống xử lý tài liệu OCR với khả năng upload, xử lý, view và edit kết quả OCR.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **File Upload**: react-dropzone
- **API Client**: Axios
- **Notifications**: Sonner

## 📁 Cấu trúc project

```
ocr-document-processor/
├── app/
│   ├── (dashboard)/              # Dashboard routes
│   │   ├── layout.tsx
│   │   ├── documents/
│   │   │   ├── page.tsx          # Danh sách tài liệu
│   │   │   ├── upload/
│   │   │   │   └── page.tsx      # Upload tài liệu
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Chi tiết tài liệu
│   │   │       └── edit/
│   │   │           └── page.tsx  # Edit OCR result
│   │   └── history/
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   └── dropdown-menu.tsx
│   ├── layout/
│   │   └── Header.tsx
│   ├── document/
│   │   ├── DocumentCard.tsx      # Card hiển thị document
│   │   └── DocumentUploader.tsx  # Upload component
│   ├── ocr/                      # OCR components (TODO)
│   └── editor/                   # Editor components (TODO)
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios client
│   │   ├── documents.ts          # Document API
│   │   └── ocr.ts                # OCR API
│   ├── hooks/
│   │   ├── useDocument.ts        # Document operations hook
│   │   └── useOCR.ts             # OCR operations hook
│   ├── store/
│   │   ├── documentStore.ts      # Document Zustand store
│   │   └── ocrStore.ts           # OCR Zustand store
│   ├── constants/
│   │   └── index.ts              # Routes, API endpoints, config
│   └── utils.ts                  # Utility functions
│
└── types/
    ├── document.ts               # Document types
    └── ocr.ts                    # OCR types

```

## 🎯 Các tính năng chính

### ✅ Đã hoàn thành

1. **Document Management**
   - Upload tài liệu (PDF, images) với drag & drop
   - Danh sách tài liệu với filter và search
   - Xem chi tiết tài liệu
   - Xóa tài liệu

2. **OCR Processing**
   - Cấu hình OCR options (language, engine, quality)
   - Upload và tự động bắt đầu OCR
   - Polling status để theo dõi tiến trình
   - Store OCR results

3. **UI Components**
   - Header với navigation
   - DocumentCard với preview
   - DocumentUploader với validation
   - Form với Select, Input components
   - Toast notifications

4. **State Management**
   - Document store (Zustand)
   - OCR store (Zustand)
   - Custom hooks cho operations

5. **API Integration**
   - Axios client với interceptors
   - Document API service
   - OCR API service
   - Upload progress tracking

### 🚧 Cần phát triển thêm

1. **OCR Viewer**
   - Component hiển thị kết quả OCR
   - Highlight confidence scores
   - Compare view (original vs OCR)
   - Region selection cho re-OCR

2. **OCR Editor**
   - Rich text editor (TipTap/Lexical)
   - Split view (document + text)
   - Auto-save
   - Export options (TXT, DOCX, JSON, PDF)

3. **Document Viewer**
   - PDF viewer (react-pdf)
   - Image viewer với zoom/pan
   - Page navigation
   - Sync với editor

4. **Additional Features**
   - Dashboard với statistics
   - History page
   - Batch operations
   - Dark mode
   - Multi-language (i18n)

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone project
cd ocr-document-processor

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run Development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 📡 API Integration

Frontend này kỳ vọng backend có các endpoints sau:

### Documents API

```
GET    /api/documents              # List documents
POST   /api/documents/upload       # Upload document
GET    /api/documents/:id          # Get document detail
PUT    /api/documents/:id          # Update document
DELETE /api/documents/:id          # Delete document
POST   /api/documents/bulk-delete  # Bulk delete
```

### OCR API

```
POST   /api/ocr/process            # Start OCR
GET    /api/ocr/status/:jobId      # Check status
GET    /api/ocr/result/:documentId # Get result
PUT    /api/ocr/result/:documentId # Update result
POST   /api/ocr/reprocess          # Re-process region
POST   /api/export                 # Export result
```

### Expected Response Formats

**Document Object:**
```typescript
{
  id: string;
  name: string;
  type: 'pdf' | 'image';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

**OCR Result:**
```typescript
{
  id: string;
  documentId: string;
  pages: OCRPage[];
  fullText: string;
  language: string;
  averageConfidence: number;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 UI/UX Features

- Responsive design (mobile-friendly)
- Loading states
- Error handling với toast notifications
- Progress tracking cho uploads
- Filter và search
- Drag & drop upload
- File validation
- Preview thumbnails

## 🔒 Security

- File type validation
- File size limits (10MB default)
- API client với auth interceptors
- XSS prevention với React
- CSRF protection (cần implement ở backend)

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## 🚀 Deployment

### Build

```bash
npm run build
```

### Environment cho Production

Đảm bảo set đúng `NEXT_PUBLIC_API_URL` cho production environment.

## 📚 Next Steps

1. **Implement OCR Viewer**: Component hiển thị kết quả OCR với confidence scores
2. **Implement Editor**: Rich text editor với split view
3. **Implement PDF Viewer**: react-pdf integration
4. **Add Export**: Export sang TXT, DOCX, JSON, PDF
5. **Dashboard**: Statistics và recent documents
6. **Testing**: Unit tests, integration tests, E2E tests
7. **Optimization**: Performance optimization, caching

## 🤝 Contributing

Để contribute:
1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

---

**Developed by**: Trung
**Date**: December 2024
**Version**: 1.0.0
