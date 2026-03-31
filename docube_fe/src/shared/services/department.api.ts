/**
 * Department API - /api/v1/departments
 */
import axiosInstance from './axios';
import type { ApiResponse, DepartmentResponse } from '@/shared/types';

export const departmentApi = {
  /** GET /departments */
  getAll: async (): Promise<DepartmentResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<DepartmentResponse[]>>('/departments');
    return response.data.data!;
  },

  /** GET /departments/:id */
  getById: async (id: string): Promise<DepartmentResponse> => {
    const response = await axiosInstance.get<ApiResponse<DepartmentResponse>>(
      `/departments/${id}`
    );
    return response.data.data!;
  },
};
