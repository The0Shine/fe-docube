/**
 * Bookmark API - /api/v1/bookmarks
 */
import axiosInstance from './axios';
import type { ApiResponse, DocumentSummaryResponse } from '@/shared/types';

export const bookmarkApi = {
  /** GET /bookmarks */
  getMy: async (): Promise<DocumentSummaryResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<DocumentSummaryResponse[]>>('/bookmarks');
    return response.data.data!;
  },

  /** POST /bookmarks/:documentId */
  create: async (documentId: string): Promise<void> => {
    await axiosInstance.post(`/bookmarks/${documentId}`);
  },

  /** DELETE /bookmarks/:documentId */
  delete: async (documentId: string): Promise<void> => {
    await axiosInstance.delete(`/bookmarks/${documentId}`);
  },
};
