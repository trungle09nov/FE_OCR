# OCR Document Processor - Frontend Architecture

## 1. Tổng quan hệ thống

Hệ thống xử lý tài liệu OCR với khả năng:
- Upload và quản lý tài liệu (PDF, images)
- Xử lý OCR tự động
- View kết quả OCR
- Edit và điều chỉnh kết quả
- Export kết quả

## 2. Tech Stack

### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

### Libraries
- **State Management**: Zustand / React Context
- **File Upload**: react-dropzone
- **PDF Viewer**: react-pdf / pdf.js
- **Image Viewer**: react-image-crop / konva
- **Rich Text Editor**: TipTap / Lexical / Slate
- **API Client**: Axios / Fetch
- **Form Handling**: React Hook Form + Zod
- **Toast/Notifications**: sonner

## 3. Cấu trúc thư mục

```
ocr-document-processor/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Main app routes
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── documents/
│   │   │   ├── page.tsx          # Documents list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Document detail
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx  # Edit OCR result
│   │   │   └── upload/
│   │   │       └── page.tsx      # Upload page
│   │   └── history/
│   │       └── page.tsx          # Processing history
│   ├── api/                      # API routes (nếu cần proxy)
│   │   └── ocr/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── document/                 # Document related components
│   │   ├── DocumentCard.tsx
│   │   ├── DocumentList.tsx
│   │   ├── DocumentUploader.tsx
│   │   ├── DocumentViewer.tsx    # View PDF/Image
│   │   └── DocumentPreview.tsx
│   │
│   ├── ocr/                      # OCR specific components
│   │   ├── OCRViewer.tsx         # View OCR result
│   │   ├── OCREditor.tsx         # Edit OCR text
│   │   ├── OCRRegionSelector.tsx # Select region to re-OCR
│   │   ├── OCRCompareView.tsx    # Compare original vs OCR
│   │   ├── OCRProgress.tsx       # Processing progress
│   │   └── OCRConfidenceBar.tsx  # Show confidence score
│   │
│   ├── editor/                   # Text editor components
│   │   ├── RichTextEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── EditorSidebar.tsx
│   │   └── EditorActions.tsx
│   │
│   └── common/                   # Common reusable components
│       ├── FileUpload.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── SearchBar.tsx
│       └── Pagination.tsx
│
├── lib/
│   ├── api/                      # API client
│   │   ├── client.ts             # Axios instance
│   │   ├── documents.ts          # Document APIs
│   │   ├── ocr.ts                # OCR APIs
│   │   └── types.ts              # API types
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useDocument.ts
│   │   ├── useOCR.ts
│   │   ├── useUpload.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/                    # State management
│   │   ├── documentStore.ts
│   │   ├── ocrStore.ts
│   │   └── uiStore.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # Class names
│   │   ├── file.ts               # File utilities
│   │   ├── ocr.ts                # OCR utilities
│   │   └── format.ts             # Format utilities
│   │
│   └── constants/
│       ├── routes.ts
│       ├── api.ts
│       └── config.ts
│
├── types/
│   ├── document.ts
│   ├── ocr.ts
│   └── user.ts
│
└── public/
    ├── images/
    └── icons/

```

## 4. Các trang chính (Pages)

### 4.1 Dashboard (`/`)
- Tổng quan số liệu: tổng documents, đã xử lý, đang xử lý
- Recent documents
- Quick actions: Upload, View all

### 4.2 Documents List (`/documents`)
- Grid/List view documents
- Filter: status (pending, processing, completed, failed)
- Search documents
- Sort: date, name, status
- Bulk actions: delete, re-process

### 4.3 Upload Page (`/documents/upload`)
- Drag & drop zone
- Multiple files upload
- File preview
- Configure OCR options:
  - Language selection
  - OCR engine selection
  - Quality settings
- Upload progress
- Batch upload management

### 4.4 Document Detail (`/documents/[id]`)
**Left Panel: Original Document Viewer**
- PDF/Image viewer
- Zoom in/out
- Page navigation
- Rotate
- Region selection for re-OCR

**Right Panel: OCR Result**
- Extracted text display
- Confidence score per block/line
- Highlight low confidence areas
- Export options (TXT, DOCX, JSON)

**Actions**
- Edit button → Navigate to edit page
- Re-process button
- Download original
- Delete document

### 4.5 Edit Page (`/documents/[id]/edit`)
**Split View Layout**

**Left: Original Document (Reference)**
- Synchronized with right panel
- Click on area to jump to corresponding text

**Right: Editable Text**
- Rich text editor
- Format preservation
- Real-time save
- Undo/Redo
- Find & Replace
- Spell check

**Toolbar**
- Save
- Export (multiple formats)
- Compare view toggle
- Reset to original

### 4.6 History Page (`/history`)
- Processing history
- Failed jobs with retry option
- Processing time statistics
- Cost tracking (if applicable)

## 5. Components Chi tiết

### 5.1 DocumentUploader
```typescript
Props:
- onUpload: (files: File[]) => Promise<void>
- accept: string[]
- maxSize: number
- multiple: boolean

Features:
- Drag & drop
- Click to browse
- File validation
- Preview thumbnails
- Remove file before upload
- Upload progress per file
```

### 5.2 DocumentViewer
```typescript
Props:
- documentUrl: string
- type: 'pdf' | 'image'
- currentPage: number
- onPageChange: (page: number) => void
- onRegionSelect: (region: BoundingBox) => void

Features:
- PDF rendering with pdf.js
- Image display with zoom/pan
- Page navigation
- Region selection tool
- Annotations overlay
```

### 5.3 OCRViewer
```typescript
Props:
- ocrResult: OCRResult
- onEdit: (blockId: string) => void
- highlightLowConfidence: boolean

Features:
- Display text blocks
- Color coding by confidence
- Click block to edit
- Expandable/collapsible blocks
- Export options
```

### 5.4 OCREditor
```typescript
Props:
- initialText: string
- ocrData: OCRResult
- onSave: (updatedText: string) => Promise<void>
- readonly: boolean

Features:
- Rich text editing
- Sync with original document view
- Auto-save
- Version control
- Collaborative editing (optional)
```

### 5.5 OCRCompareView
```typescript
Props:
- originalText: string
- editedText: string
- showDiff: boolean

Features:
- Side-by-side comparison
- Diff highlighting
- Accept/reject changes
- Merge tool
```

## 6. State Management

### Document Store (Zustand)
```typescript
interface DocumentStore {
  documents: Document[]
  currentDocument: Document | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchDocuments: () => Promise<void>
  uploadDocument: (file: File, options: OCROptions) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>
}
```

### OCR Store
```typescript
interface OCRStore {
  ocrResults: Map<string, OCRResult>
  processingStatus: Map<string, ProcessingStatus>
  
  // Actions
  startOCR: (documentId: string, options: OCROptions) => Promise<void>
  getOCRResult: (documentId: string) => Promise<OCRResult>
  updateOCRResult: (documentId: string, result: OCRResult) => Promise<void>
  reprocessRegion: (documentId: string, region: BoundingBox) => Promise<void>
}
```

## 7. Data Flow

### Upload Flow
```
User selects file
  → DocumentUploader validates
    → Upload to server
      → Server processes OCR
        → Poll for status
          → Update UI with result
            → Navigate to document detail
```

### Edit Flow
```
User clicks Edit
  → Load OCR result
    → Initialize editor with data
      → User edits text
        → Auto-save changes
          → Update OCR result
            → Show success notification
```

### Re-process Flow
```
User selects region
  → Capture bounding box
    → Send re-process request
      → Poll for result
        → Merge with existing OCR data
          → Update viewer
```

## 8. API Integration

### Endpoints Expected
```typescript
// Documents
GET    /api/documents              // List all
POST   /api/documents              // Upload
GET    /api/documents/:id          // Get detail
PUT    /api/documents/:id          // Update
DELETE /api/documents/:id          // Delete

// OCR
POST   /api/ocr/process            // Start OCR
GET    /api/ocr/status/:jobId      // Check status
GET    /api/ocr/result/:documentId // Get result
POST   /api/ocr/reprocess          // Re-process region
PUT    /api/ocr/result/:documentId // Update edited result

// Export
POST   /api/export                 // Export to format
```

## 9. Performance Considerations

### Optimization Strategies
1. **Image/PDF Loading**
   - Lazy load pages
   - Progressive image loading
   - Thumbnail generation
   - Caching strategy

2. **Large Document Handling**
   - Virtual scrolling for text
   - Pagination for pages
   - Chunked upload for large files
   - Background processing

3. **Real-time Updates**
   - WebSocket for processing status
   - Server-Sent Events for progress
   - Polling with exponential backoff

4. **Caching**
   - React Query for server state
   - Local storage for drafts
   - Service Worker for offline support

## 10. User Experience Features

### Must-have
- ✅ Responsive design (mobile-friendly)
- ✅ Keyboard shortcuts
- ✅ Progress indicators
- ✅ Error handling with retry
- ✅ Loading states
- ✅ Toast notifications

### Nice-to-have
- 🎯 Dark mode
- 🎯 Multi-language support (i18n)
- 🎯 Collaborative editing
- 🎯 Version history
- 🎯 Batch operations
- 🎯 Advanced search with filters
- 🎯 Export templates
- 🎯 OCR quality presets

## 11. Security Considerations

- File type validation
- File size limits
- CSRF protection
- XSS prevention
- Secure file storage URLs
- Authentication & Authorization
- Rate limiting on API calls

## 12. Testing Strategy

- **Unit Tests**: Utils, hooks, pure components
- **Integration Tests**: API integration, state management
- **E2E Tests**: Critical user flows (upload, edit, export)
- **Visual Regression Tests**: UI components

## 13. Deployment

- **Build**: `npm run build`
- **Static Export**: Consider SSG for landing pages
- **CDN**: For static assets and images
- **Environment Variables**: API endpoints, feature flags

---

## Next Steps

1. ✅ Setup project structure
2. ⬜ Implement core UI components
3. ⬜ Build document upload flow
4. ⬜ Integrate OCR viewer
5. ⬜ Implement edit functionality
6. ⬜ Add export features
7. ⬜ Testing & optimization
8. ⬜ Documentation