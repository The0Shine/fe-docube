/**
 * Auth API Tests
 * Mock axios instance và kiểm tra tất cả API calls
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock toàn bộ axios module trước khi import authApi
vi.mock('@/shared/services/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock auth store để tránh localStorage errors trong test
vi.mock('@/stores', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      accessToken: 'mock-token',
      clearAuth: vi.fn(),
    })),
    setState: vi.fn(),
  },
}));

import { authApi } from '@/shared/services/auth.api';
import axiosInstance from '@/shared/services/axios';

const mockPost = axiosInstance.post as Mock;
const mockGet = axiosInstance.get as Mock;

const wrapData = <T>(data: T) => ({ data: { data, message: 'OK', status: 200 } });

const mockLoginResp = {
  accessToken: 'access-token',
  accessTokenType: 'Bearer',
  refreshToken: 'refresh-token',
  clientId: 'client-id',
  userId: 'user-id',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authApi', () => {
  describe('login', () => {
    it('nên POST /auth/login với email và password', async () => {
      mockPost.mockResolvedValueOnce(wrapData(mockLoginResp));

      const result = await authApi.login({ email: 'test@example.com', password: 'Password1' });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password1',
      });
      expect(result.accessToken).toBe('access-token');
      expect(result.accessTokenType).toBe('Bearer');
    });
  });

  describe('register', () => {
    it('nên POST /auth/register với thông tin đầy đủ', async () => {
      mockPost.mockResolvedValueOnce({ data: { message: 'OK', status: 200 } });

      await authApi.register({
        email: 'new@example.com',
        firstName: 'Văn',
        lastName: 'Nguyễn',
        password: 'Password1',
      });

      expect(mockPost).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
        email: 'new@example.com',
        firstName: 'Văn',
      }));
    });
  });

  describe('verifyEmail', () => {
    it('nên POST /auth/verify-email với OTP', async () => {
      mockPost.mockResolvedValueOnce({ data: { message: 'OK', status: 200 } });

      await authApi.verifyEmail('123456');

      expect(mockPost).toHaveBeenCalledWith('/auth/verify-email', { otp: '123456' });
    });
  });

  describe('sendVerificationEmail', () => {
    it('nên POST /auth/send-verification-email không có body', async () => {
      mockPost.mockResolvedValueOnce({ data: { message: 'OK', status: 200 } });

      await authApi.sendVerificationEmail();

      expect(mockPost).toHaveBeenCalledWith('/auth/send-verification-email');
    });
  });

  describe('forgotPassword', () => {
    it('nên POST /auth/forgot-password với email', async () => {
      mockPost.mockResolvedValueOnce(wrapData(mockLoginResp));

      const result = await authApi.forgotPassword('user@example.com');

      expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', { email: 'user@example.com' });
      expect(result).toEqual(mockLoginResp);
    });
  });

  describe('resetPassword', () => {
    it('nên POST /auth/reset-password với otp và newPassword', async () => {
      mockPost.mockResolvedValueOnce({ data: { message: 'OK', status: 200 } });

      await authApi.resetPassword('654321', 'NewPassword1');

      expect(mockPost).toHaveBeenCalledWith('/auth/reset-password', {
        otp: '654321',
        newPassword: 'NewPassword1',
      });
    });
  });

  describe('authenticate2FA', () => {
    it('nên POST /auth/2fa với OTP và trả về LoginResponse', async () => {
      mockPost.mockResolvedValueOnce(wrapData(mockLoginResp));

      const result = await authApi.authenticate2FA('987654');

      expect(mockPost).toHaveBeenCalledWith('/auth/2fa', { otp: '987654' });
      expect(result.accessToken).toBe('access-token');
    });
  });

  describe('refreshToken', () => {
    it('nên POST /auth/refresh với refresh token', async () => {
      mockPost.mockResolvedValueOnce(wrapData(mockLoginResp));

      const result = await authApi.refreshToken('my-refresh-token');

      expect(mockPost).toHaveBeenCalledWith('/auth/refresh', { token: 'my-refresh-token' });
      expect(result.refreshToken).toBe('refresh-token');
    });
  });

  describe('logout', () => {
    it('nên POST /auth/logout với danh sách device IDs', async () => {
      mockPost.mockResolvedValueOnce({ data: { message: 'OK', status: 200 } });

      await authApi.logout(['device-1', 'device-2']);

      expect(mockPost).toHaveBeenCalledWith('/auth/logout', {
        deviceIds: ['device-1', 'device-2'],
      });
    });
  });

  describe('getDevices', () => {
    it('nên GET /auth/devices và trả về danh sách Token', async () => {
      const mockDevices = [
        { id: 'token-1', userId: 'user-1', token: 'tok1', ua: 'Chrome' },
        { id: 'token-2', userId: 'user-1', token: 'tok2', ua: 'Firefox' },
      ];
      mockGet.mockResolvedValueOnce(wrapData(mockDevices));

      const result = await authApi.getDevices();

      expect(mockGet).toHaveBeenCalledWith('/auth/devices');
      expect(result).toHaveLength(2);
      expect(result[0].ua).toBe('Chrome');
    });
  });

  describe('getMyRoles', () => {
    it('nên GET /auth/roles và trả về danh sách Role', async () => {
      const mockRoles = [
        { id: 'role-1', name: 'ADMIN', description: 'Admin', permissions: [] },
      ];
      mockGet.mockResolvedValueOnce(wrapData(mockRoles));

      const result = await authApi.getMyRoles();

      expect(mockGet).toHaveBeenCalledWith('/auth/roles');
      expect(result[0].name).toBe('ADMIN');
    });
  });

  describe('loginGoogle', () => {
    it('nên POST /auth/google với Google token', async () => {
      mockPost.mockResolvedValueOnce(wrapData(mockLoginResp));

      const result = await authApi.loginGoogle({ token: 'google-id-token' });

      expect(mockPost).toHaveBeenCalledWith('/auth/google', { token: 'google-id-token' });
      expect(result.accessToken).toBe('access-token');
    });
  });
});
