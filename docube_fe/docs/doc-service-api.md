# Doc-Service API Reference

Base URL (qua API Gateway): `/api/v1`

Tất cả request authenticated đều cần header: `Authorization: Bearer <access_token>`

---

## Documents

### GET `/documents`
Lấy danh sách tài liệu (public, có phân trang).

**Query params:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `page` | int | 0 | Trang (0-indexed) |
| `size` | int | 20 | Số item/trang |
| `sort` | string | `createdAt,desc` | Sắp xếp (e.g. `price,asc`) |

**Response:** `PageResponse<DocumentSummaryResponse>`
```json
{
  "data": {
    "content": [ { "id": "...", "title": "...", "fileType": "PDF", "price": 5000, ... } ],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20,
    "first": true,
    "last": false
  }
}
```

---

### GET `/documents/:id`
Lấy chi tiết một tài liệu (public).

**Response:** `DocumentResponse`
```json
{
  "data": {
    "id": "uuid",
    "title": "Giáo trình Toán cao cấp",
    "description": "...",
    "fileType": "PDF",
    "originalFileName": "toan-cao-cap.pdf",
    "fileSize": 2048576,
    "docHash": "sha256:abcdef...",
    "hashAlgo": "SHA-256",
    "blockchainDocId": "0x...",
    "status": "ACTIVE",
    "price": 5000,
    "ownerId": "uuid",
    "schoolId": "uuid",
    "schoolName": "Đại học Bách Khoa Hà Nội",
    "departmentId": "uuid",
    "departmentName": "Khoa Toán",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### GET `/documents/my`
Lấy tài liệu của user đang đăng nhập. **Cần auth.**

**Response:** `DocumentResponse[]`

---

### POST `/documents`
Upload tài liệu mới. **Cần auth.** Content-Type: `multipart/form-data`

**Form fields:**
| Field | Type | Mô tả |
|-------|------|-------|
| `file` | File | File tài liệu (PDF/DOCX/TXT) |
| `metadata` | JSON Blob | `CreateDocumentRequest` |

**`CreateDocumentRequest`:**
```json
{
  "title": "Giáo trình Toán",
  "description": "Tài liệu học tập",
  "price": 5000,
  "schoolId": "uuid-or-null",
  "departmentId": "uuid-or-null"
}
```

**Response:** `DocumentResponse`

---

### PUT `/documents/:id`
Cập nhật thông tin tài liệu. **Cần auth + là owner.**

**Body:** `UpdateDocumentRequest` (same fields as CreateDocumentRequest)

**Response:** `DocumentResponse`

---

### DELETE `/documents/:id`
Xóa mềm tài liệu (status → `DELETED`). **Cần auth + là owner.**

**Response:** 204 No Content

---

### GET `/documents/:id/download`
Lấy presigned URL để download file. **Cần auth + đã mua hoặc là owner.**

**Response:**
```json
{ "data": { "downloadUrl": "https://minio.../..." } }
```

---

## Bookmarks

### GET `/bookmarks`
Lấy danh sách tài liệu đã bookmark. **Cần auth.**

**Response:** `DocumentSummaryResponse[]`

---

### POST `/bookmarks`
Thêm bookmark. **Cần auth.**

**Body:**
```json
{ "documentId": "uuid" }
```

**Response:** 201 Created

---

### DELETE `/bookmarks/:documentId`
Xóa bookmark. **Cần auth.**

**Response:** 204 No Content

---

## Purchases

### GET `/purchases/my`
Lấy lịch sử mua của user. **Cần auth.**

**Response:** `PurchaseResponse[]`
```json
[{
  "id": "uuid",
  "userId": "uuid",
  "documentId": "uuid",
  "documentTitle": "Giáo trình Toán",
  "amount": 5000,
  "status": "COMPLETED",
  "transactionId": "DOC-20240115-ABCD",
  "paymentCode": "DOC20240115ABCD",
  "qrUrl": "https://img.vietqr.io/...",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:05:00Z"
}]
```

**Purchase statuses:**
- `PENDING` — đã tạo giao dịch, chờ thanh toán
- `COMPLETED` — đã thanh toán thành công
- `FAILED` — giao dịch thất bại/hết hạn

---

### POST `/purchases`
Tạo giao dịch mua tài liệu. **Cần auth.**

**Body:**
```json
{ "documentId": "uuid" }
```

**Response:** `PurchaseResponse` (status = `PENDING`, kèm QR URL và payment code)

**Luồng thanh toán:** SePay webhook → backend cập nhật status → FE poll để kiểm tra

---

## Schools

### GET `/schools`
Lấy danh sách trường (public).

**Response:** `SchoolResponse[]`
```json
[{
  "id": "uuid",
  "name": "Đại học Bách Khoa Hà Nội",
  "description": "...",
  "address": "1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
  "createdAt": "...",
  "updatedAt": "..."
}]
```

---

### GET `/schools/:id`
Lấy chi tiết một trường (public).

---

### GET `/schools/:id/departments`
Lấy danh sách khoa của một trường (public).

**Response:** `DepartmentResponse[]`
```json
[{
  "id": "uuid",
  "name": "Khoa Toán - Tin",
  "description": "...",
  "schoolId": "uuid",
  "schoolName": "Đại học Bách Khoa Hà Nội",
  "createdAt": "...",
  "updatedAt": "..."
}]
```

---

## Departments

### GET `/departments`
Lấy tất cả khoa (public).

### GET `/departments/:id`
Lấy chi tiết một khoa (public).

---

## Common Response Wrapper

Tất cả response được wrap trong:
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "message": "Document not found",
  "data": null
}
```

HTTP status codes: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
