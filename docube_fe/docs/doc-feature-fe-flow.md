# Doc Feature — FE Flow Documentation

Tài liệu này mô tả luồng dữ liệu, component tree, và UX flow của tính năng tài liệu trên frontend.

---

## Architecture Overview

```
src/
├── shared/
│   ├── types/doc.types.ts          # TypeScript types
│   ├── services/
│   │   ├── document.api.ts         # documentApi
│   │   ├── bookmark.api.ts         # bookmarkApi
│   │   ├── purchase.api.ts         # purchaseApi
│   │   ├── school.api.ts           # schoolApi
│   │   └── department.api.ts       # departmentApi
│   └── ui/
│       ├── DocumentCard.tsx        # Card hiển thị tài liệu
│       ├── DocumentGrid.tsx        # Grid responsive + loading state
│       ├── DocumentFilters.tsx     # Bộ lọc (search, school, dept, type, sort)
│       ├── FileTypeBadge.tsx       # Badge PDF/WORD/TEXT
│       ├── PriceDisplay.tsx        # Hiển thị giá / Miễn phí
│       ├── EmptyState.tsx          # Trạng thái rỗng
│       └── PurchaseModal.tsx       # Modal thanh toán (confirm + QR)
├── stores/document.store.ts        # Zustand: filter state
└── features/
    ├── home/components/DocumentsSection.tsx   # Preview 8 docs trên trang chủ
    ├── documents/DocumentsPage.tsx            # Danh sách + filter + phân trang
    ├── document-detail/DocumentDetailPage.tsx # Chi tiết + download/mua
    ├── upload/UploadDocumentPage.tsx          # Upload tài liệu mới
    ├── my-documents/
    │   ├── MyDocumentsPage.tsx                # Quản lý tài liệu của tôi
    │   └── EditDocumentPage.tsx               # Chỉnh sửa tài liệu
    ├── bookmarks/BookmarksPage.tsx            # Tài liệu đã lưu
    ├── purchases/PurchasesPage.tsx            # Lịch sử mua
    └── university/UniversityPage.tsx          # Danh sách trường
```

---

## Routes

| Path | Component | Auth | Mô tả |
|------|-----------|------|-------|
| `/` | `HomePage` | No | Trang chủ, preview 8 tài liệu mới nhất |
| `/documents` | `DocumentsPage` | No | Danh sách đầy đủ + bộ lọc |
| `/documents/:id` | `DocumentDetailPage` | No | Chi tiết tài liệu |
| `/university` | `UniversityPage` | No | Danh sách trường |
| `/university/:slug` | `SchoolDetailPage` | No | Chi tiết trường + tài liệu |
| `/private/upload` | `UploadDocumentPage` | **Yes** | Upload tài liệu |
| `/private/my-documents` | `MyDocumentsPage` | **Yes** | Quản lý tài liệu của mình |
| `/private/my-documents/:id/edit` | `EditDocumentPage` | **Yes** | Chỉnh sửa tài liệu |
| `/private/bookmarks` | `BookmarksPage` | **Yes** | Tài liệu đã bookmark |
| `/private/purchases` | `PurchasesPage` | **Yes** | Lịch sử mua |

---

## Flow 1: Xem danh sách tài liệu

```
DocumentsPage mount
  → fetch documentApi.getAll({ page, size, sort })     [server-side pagination]
  → fetch schoolApi.getAll()                           [populate school filter]

User thay đổi filter:
  → DocumentFilters → useDocumentStore.setFilter(...)
  → DocumentsPage đọc store → re-fetch với params mới

User chọn school:
  → fetch departmentApi.getAll() filtered by school    [populate dept filter]

User click document card:
  → navigate('/documents/:id')
```

**Filter state** (Zustand `useDocumentStore`):
- `searchQuery` — tìm theo title/description
- `selectedSchoolId` — lọc theo trường
- `selectedDepartmentId` — lọc theo khoa
- `selectedFileType` — PDF / WORD / TEXT / ALL
- `sortBy` — `createdAt,desc` | `price,asc` | `price,desc`

---

## Flow 2: Xem chi tiết tài liệu

```
DocumentDetailPage mount (params.id)
  → fetch documentApi.getById(id)
  → fetch bookmarkApi.getMy() → check isPurchased
  → fetch purchaseApi.getMy() → check isBookmarked

Hiển thị action buttons theo điều kiện:
  isOwner   → [Chỉnh sửa] [Xóa]
  isFree    → [Tải xuống miễn phí]
  isPurchased → [Tải xuống]
  !isPurchased && !isFree → [Mua tài liệu]
  isAuthenticated → [Bookmark toggle]

Download:
  → documentApi.getDownloadUrl(id) → presigned URL → window.open(url)

Mua tài liệu:
  → mở PurchaseModal
```

---

## Flow 3: Mua tài liệu (PurchaseModal)

```
Step 1 — Confirm:
  User click "Mua tài liệu"
  → Modal mở, hiển thị tên + giá
  → User click "Xác nhận thanh toán"
  → purchaseApi.create({ documentId })
  → Nhận PurchaseResponse { status: PENDING, qrUrl, paymentCode }
  → Chuyển sang Step 2

Step 2 — Payment:
  Hiển thị:
    - QR code ảnh (img src = qrUrl)
    - Payment code (+ CopyButton)
    - Hướng dẫn: chuyển khoản đúng nội dung
    - Badge "Chờ thanh toán"

  User click "Kiểm tra":
    → purchaseApi.getMy() → find purchase by id
    → status === COMPLETED → đổi badge, gọi onSuccess()
    → status === PENDING → thông báo chưa thanh toán

  onSuccess:
    → đóng modal, refresh data (isPurchased = true)
    → hiện nút "Tải xuống"

Nếu đã có purchase PENDING (từ PurchasesPage):
  → Modal mở thẳng ở Step 2 với existingPurchase
```

**SePay Webhook flow (backend):**
```
SePay → POST /webhooks/sepay
  → verify paymentCode trong description
  → tìm Purchase by paymentCode
  → update status = COMPLETED
  → publish Kafka event (nếu cần)
```

---

## Flow 4: Upload tài liệu

```
UploadDocumentPage:
  1. User kéo/thả hoặc click chọn file (Dropzone)
     → Chấp nhận: .pdf, .docx, .doc, .txt
     → Auto-fill title từ tên file

  2. Điền form:
     - Title (required)
     - Description
     - School → fetch schoolApi.getAll() → Select
     - Department → fetch schoolApi.getDepartments(schoolId) khi school thay đổi
     - Price (0 = miễn phí)

  3. Submit:
     → documentApi.create(file, metadata)  [multipart/form-data]
     → success → navigate('/private/my-documents')
```

---

## Flow 5: Quản lý tài liệu (My Documents)

```
MyDocumentsPage:
  → fetch documentApi.getMy()
  → Tabs: [Đang hoạt động | Đã xóa]
  → Table: FileTypeBadge | Title | Price | Actions

Actions:
  - Xem → navigate('/documents/:id')
  - Sửa → navigate('/private/my-documents/:id/edit')
  - Xóa → modals.openConfirmModal → documentApi.delete(id) → refresh

EditDocumentPage:
  → fetch documentApi.getById(id)  [pre-populate form]
  → fetch schools, departments
  → Submit: documentApi.update(id, data) → navigate back
```

---

## Flow 6: Bookmark

```
Bookmarks được toggle từ 2 nơi:
  1. DocumentDetailPage — ActionIcon bookmark trên sidebar
  2. DocumentCard — ActionIcon bookmark góc phải (nếu showBookmark=true)

Toggle logic:
  if (isBookmarked):
    → bookmarkApi.delete(documentId)
    → setIsBookmarked(false)
  else:
    → bookmarkApi.create(documentId)
    → setIsBookmarked(true)

BookmarksPage:
  → fetch bookmarkApi.getMy()
  → DocumentGrid hiển thị, chỉ cho phép unbookmark
  → Xóa bookmark → remove khỏi list local
```

---

## Component Props Reference

### `DocumentCard`
```ts
interface DocumentCardProps {
  document: DocumentSummaryResponse;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string, current: boolean) => void;
  showBookmark?: boolean;  // default: true
}
```

### `DocumentGrid`
```ts
interface DocumentGridProps {
  documents: DocumentSummaryResponse[];
  loading?: boolean;
  bookmarkedIds?: Set<string>;
  onBookmarkToggle?: (id: string, current: boolean) => void;
  showBookmark?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}
```

### `PurchaseModal`
```ts
interface PurchaseModalProps {
  opened: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  price: number;
  existingPurchase?: PurchaseResponse;  // nếu có → bỏ qua step confirm
  onSuccess?: () => void;
}
```

### `DocumentFilters`
```ts
interface DocumentFiltersProps {
  onFiltersChange?: () => void;  // callback khi filter thay đổi
}
// State được quản lý qua useDocumentStore (Zustand)
```

---

## State Management

### `useDocumentStore` (Zustand, không persist)
```ts
{
  searchQuery: string;
  selectedSchoolId: string | null;
  selectedDepartmentId: string | null;
  selectedFileType: FileType | 'ALL';
  sortBy: string;

  setSearchQuery(q: string): void;
  setSelectedSchool(id: string | null): void;      // resets department
  setSelectedDepartment(id: string | null): void;
  setSelectedFileType(t: FileType | 'ALL'): void;
  setSortBy(s: string): void;
  resetFilters(): void;
}
```

### `useAuthStore` (Zustand, persisted)
Được dùng trong doc feature để:
- `isAuthenticated` — hiển thị/ẩn bookmark, download, mua
- `user.id` — so sánh với `document.ownerId` để xác định `isOwner`

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| API lỗi khi load danh sách | `setDocuments([])`, hiển thị EmptyState |
| API lỗi khi load chi tiết | Hiển thị lỗi inline |
| Download thất bại | `notifications.show` error toast |
| Purchase tạo thất bại | `notifications.show` error toast |
| Bookmark toggle thất bại | Revert local state |
| Upload thất bại | Hiển thị lỗi form |
