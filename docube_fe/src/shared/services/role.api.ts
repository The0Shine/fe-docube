/**
 * Role API - Quản lý roles (Admin)
 * Base: /api/v1/roles
 */
import axiosInstance from './axios';
import type { Role, CreateUpdateRoleRequest, ApiResponse } from '@/shared/types';

export const roleApi = {
  /**
   * GET /roles/all
   * Lấy tất cả roles
   */
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<ApiResponse<Role[]>>('/roles/all');
    return response.data.data!;
  },

  /**
   * GET /roles/:roleId
   * Lấy role theo ID (cần permission role:view)
   */
  getRoleById: async (roleId: string): Promise<Role> => {
    const response = await axiosInstance.get<ApiResponse<Role>>(`/roles/${roleId}`);
    return response.data.data!;
  },

  /**
   * POST /roles
   * Tạo role mới (cần permission role:add)
   */
  createRole: async (data: CreateUpdateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.post<ApiResponse<Role>>('/roles', data);
    return response.data.data!;
  },

  /**
   * PUT /roles/:roleId
   * Cập nhật role (cần permission role:edit)
   */
  updateRole: async (roleId: string, data: CreateUpdateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.put<ApiResponse<Role>>(`/roles/${roleId}`, data);
    return response.data.data!;
  },

  /**
   * DELETE /roles/:roleId
   * Xóa role (cần permission role:delete)
   */
  deleteRole: async (roleId: string): Promise<void> => {
    await axiosInstance.delete(`/roles/${roleId}`);
  },
};
