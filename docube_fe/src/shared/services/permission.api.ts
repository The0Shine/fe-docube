/**
 * Permission API - Quản lý permissions (Admin)
 * Base: /api/v1/permissions
 */
import axiosInstance from './axios';
import type { Permission, CreateUpdatePermissionRequest, ApiResponse } from '@/shared/types';

export const permissionApi = {
  /**
   * GET /permissions/all
   * Lấy tất cả permissions
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get<ApiResponse<Permission[]>>('/permissions/all');
    return response.data.data!;
  },

  /**
   * GET /permissions/:permissionId
   * Lấy permission theo ID (cần permission permission:view)
   */
  getPermissionById: async (permissionId: string): Promise<Permission> => {
    const response = await axiosInstance.get<ApiResponse<Permission>>(`/permissions/${permissionId}`);
    return response.data.data!;
  },

  /**
   * POST /permissions
   * Tạo permission mới (cần permission permission:add)
   */
  createPermission: async (data: CreateUpdatePermissionRequest): Promise<Permission> => {
    const response = await axiosInstance.post<ApiResponse<Permission>>('/permissions', data);
    return response.data.data!;
  },

  /**
   * PUT /permissions/:permissionId
   * Cập nhật permission (cần permission permission:edit)
   */
  updatePermission: async (permissionId: string, data: CreateUpdatePermissionRequest): Promise<Permission> => {
    const response = await axiosInstance.put<ApiResponse<Permission>>(`/permissions/${permissionId}`, data);
    return response.data.data!;
  },

  /**
   * DELETE /permissions/:permissionId
   * Xóa permission (cần permission permission:delete)
   */
  deletePermission: async (permissionId: string): Promise<void> => {
    await axiosInstance.delete(`/permissions/${permissionId}`);
  },
};
