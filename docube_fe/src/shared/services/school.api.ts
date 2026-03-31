/**
 * School API - /api/v1/schools
 */
import axiosInstance from './axios';
import type { ApiResponse, SchoolResponse, DepartmentResponse } from '@/shared/types';

export const schoolApi = {
  /** GET /schools */
  getAll: async (): Promise<SchoolResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<SchoolResponse[]>>('/schools');
    return response.data.data!;
  },

  /** GET /schools/:id */
  getById: async (id: string): Promise<SchoolResponse> => {
    const response = await axiosInstance.get<ApiResponse<SchoolResponse>>(`/schools/${id}`);
    return response.data.data!;
  },

  /** GET /schools/:id/departments */
  getDepartments: async (schoolId: string): Promise<DepartmentResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<DepartmentResponse[]>>(
      `/schools/${schoolId}/departments`
    );
    return response.data.data!;
  },
};
