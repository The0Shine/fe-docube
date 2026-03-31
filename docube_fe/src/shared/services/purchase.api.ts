/**
 * Purchase API - /api/v1/purchases
 */
import axiosInstance from './axios';
import type { ApiResponse, PurchaseResponse, CreatePurchaseRequest } from '@/shared/types';

export const purchaseApi = {
  /** GET /purchases */
  getMy: async (): Promise<PurchaseResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<PurchaseResponse[]>>('/purchases');
    return response.data.data!;
  },

  /** POST /purchases */
  create: async (data: CreatePurchaseRequest): Promise<PurchaseResponse> => {
    const response = await axiosInstance.post<ApiResponse<PurchaseResponse>>('/purchases', data);
    return response.data.data!;
  },
};
