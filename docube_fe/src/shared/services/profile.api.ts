/**
 * Profile API - Các API liên quan đến hồ sơ cá nhân người dùng
 * Base: /api/v1/profile
 * Tất cả endpoints yêu cầu Bearer token
 */
import axiosInstance from './axios';
import type { UserSummary, ChangePasswordRequest, OtpRequest, TotpSetupResponse, ApiResponse } from '@/shared/types';

export const profileApi = {
  /**
   * GET /profile
   * Lấy thông tin profile của user hiện tại
   */
  getProfile: async (): Promise<UserSummary> => {
    const response = await axiosInstance.get<ApiResponse<UserSummary>>('/profile');
    return response.data.data!;
  },

  /**
   * PUT /profile/avatar
   * Cập nhật avatar (multipart/form-data)
   */
  updateAvatar: async (file: File): Promise<UserSummary> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.put<ApiResponse<UserSummary>>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  },

  /**
   * POST /profile/password
   * Đổi mật khẩu
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<UserSummary> => {
    const body: ChangePasswordRequest = { oldPassword, newPassword };
    const response = await axiosInstance.post<ApiResponse<UserSummary>>('/profile/password', body);
    return response.data.data!;
  },

  /**
   * POST /profile/2fa/setup
   * Khởi tạo 2FA — trả về QR code URL và secret key
   */
  setup2FA: async (): Promise<TotpSetupResponse> => {
    const response = await axiosInstance.post<ApiResponse<TotpSetupResponse>>('/profile/2fa/setup');
    return response.data.data!;
  },

  /**
   * POST /profile/2fa/verify
   * Xác minh OTP để bật 2FA
   */
  verify2FASetup: async (otp: string): Promise<UserSummary> => {
    const body: OtpRequest = { otp };
    const response = await axiosInstance.post<ApiResponse<UserSummary>>('/profile/2fa/verify', body);
    return response.data.data!;
  },

  /**
   * POST /profile/2fa/disable
   * Tắt 2FA bằng OTP
   */
  disable2FA: async (otp: string): Promise<UserSummary> => {
    const body: OtpRequest = { otp };
    const response = await axiosInstance.post<ApiResponse<UserSummary>>('/profile/2fa/disable', body);
    return response.data.data!;
  },
};
