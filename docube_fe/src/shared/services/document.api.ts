/**
 * Document API - /api/v1/documents
 */
import axiosInstance from './axios';
import type {
  ApiResponse,
  DocumentResponse,
  DocumentSummaryResponse,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  PageResponse,
} from '@/shared/types';

export const documentApi = {
  /** GET /documents?page=&size=&sort= */
  getAll: async (params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<DocumentSummaryResponse>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<DocumentSummaryResponse>>>(
      '/documents',
      { params: { page: 0, size: 20, sort: 'createdAt,desc', ...params } }
    );
    return response.data.data!;
  },

  /** GET /documents/:id */
  getById: async (id: string): Promise<DocumentResponse> => {
    const response = await axiosInstance.get<ApiResponse<DocumentResponse>>(`/documents/${id}`);
    return response.data.data!;
  },

  /** GET /documents/my */
  getMy: async (): Promise<DocumentResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<DocumentResponse[]>>('/documents/my');
    return response.data.data!;
  },

  /** POST /documents (multipart) */
  create: async (file: File, metadata: CreateDocumentRequest): Promise<DocumentResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    const response = await axiosInstance.post<ApiResponse<DocumentResponse>>(
      '/documents',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data!;
  },

  /** PUT /documents/:id */
  update: async (id: string, data: UpdateDocumentRequest): Promise<DocumentResponse> => {
    const response = await axiosInstance.put<ApiResponse<DocumentResponse>>(
      `/documents/${id}`,
      data
    );
    return response.data.data!;
  },

  /** DELETE /documents/:id */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/documents/${id}`);
  },

  /** GET /documents/:id/download → { downloadUrl } */
  getDownloadUrl: async (id: string): Promise<string> => {
    const response = await axiosInstance.get<ApiResponse<Record<string, string>>>(
      `/documents/${id}/download`
    );
    return response.data.data!['downloadUrl'];
  },
};
