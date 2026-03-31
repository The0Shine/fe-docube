/**
 * Doc Types - TypeScript types mapping với Doc-Service backend DTOs
 */

// =============================================================================
// ENUMS
// =============================================================================

export type FileType = 'PDF' | 'WORD' | 'TEXT';
export type DocumentStatus = 'ACTIVE' | 'DELETED';
export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

// =============================================================================
// DOMAIN MODELS (Response DTOs)
// =============================================================================

export interface DocumentSummaryResponse {
  id: string;
  title: string;
  description: string;
  fileType: FileType;
  originalFileName: string;
  fileSize: number;
  price: number;
  ownerId: string;
  schoolName: string | null;
  departmentName: string | null;
  createdAt: string | null;
}

export interface DocumentResponse {
  id: string;
  title: string;
  description: string;
  fileType: FileType;
  originalFileName: string;
  fileSize: number;
  docHash: string;
  hashAlgo: string;
  blockchainDocId: string | null;
  status: DocumentStatus;
  price: number;
  ownerId: string;
  schoolId: string | null;
  schoolName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SchoolResponse {
  id: string;
  name: string;
  description: string;
  address: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DepartmentResponse {
  id: string;
  name: string;
  description: string;
  schoolId: string;
  schoolName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PurchaseResponse {
  id: string;
  userId: string;
  documentId: string;
  documentTitle: string;
  amount: number;
  status: PurchaseStatus;
  transactionId: string | null;
  paymentCode: string | null;
  qrUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// =============================================================================
// REQUEST DTOs
// =============================================================================

export interface CreateDocumentRequest {
  title: string;
  description?: string;
  price?: number;
  schoolId?: string | null;
  departmentId?: string | null;
}

export interface UpdateDocumentRequest {
  title: string;
  description?: string;
  price?: number;
  schoolId?: string | null;
  departmentId?: string | null;
}

export interface CreatePurchaseRequest {
  documentId: string;
}

// =============================================================================
// PAGINATION
// =============================================================================

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
