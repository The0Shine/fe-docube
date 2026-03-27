/**
 * User API - Quản lý người dùng (Admin)
 * Base: /api/v1/users
 */
import axiosInstance from './axios';
import type {
  UserSummary,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
} from '@/shared/types';

export const userApi = {
  /**
   * GET /users/:userId
   * Lấy thông tin user theo ID
   */
  getUserById: async (userId: string): Promise<UserSummary> => {
    const response = await axiosInstance.get<ApiResponse<UserSummary>>(`/users/${userId}`);
    return response.data.data!;
  },

  /**
   * POST /users
   * Tạo user mới (Admin)
   */
  createUser: async (data: CreateUserRequest): Promise<UserSummary> => {
    const response = await axiosInstance.post<ApiResponse<UserSummary>>('/users', data);
    return response.data.data!;
  },

  /**
   * PUT /users/:userId
   * Cập nhật thông tin user (Admin)
   */
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<UserSummary> => {
    const response = await axiosInstance.put<ApiResponse<UserSummary>>(`/users/${userId}`, data);
    return response.data.data!;
  },

  /**
   * DELETE /users/:userId/ban
   * Ban user (Admin)
   */
  banUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/users/${userId}/ban`);
  },

  /**
   * PATCH /users/:userId/unban
   * Unban user (Admin)
   */
  unbanUser: async (userId: string): Promise<void> => {
    await axiosInstance.patch(`/users/${userId}/unban`);
  },

  /**
   * PATCH /users/:userId/update-role
   * Cập nhật roles của user (Admin)
   */
  updateUserRoles: async (userId: string, roles: string[]): Promise<void> => {
    await axiosInstance.patch(`/users/${userId}/update-role`, { roles });
  },
};
