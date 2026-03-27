/**
 * Profile API Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/shared/services/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock('@/stores', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ accessToken: 'token', clearAuth: vi.fn() })),
    setState: vi.fn(),
  },
}));

import { profileApi } from '@/shared/services/profile.api';
import axiosInstance from '@/shared/services/axios';

const mockPost = axiosInstance.post as Mock;
const mockGet = axiosInstance.get as Mock;
const mockPut = axiosInstance.put as Mock;

const mockUser = {
  id: 'user-id', email: 'a@b.com', firstName: 'A', lastName: 'B',
  phoneNumber: '', address: '', avatar: '',
};
const wrapData = <T>(data: T) => ({ data: { data, message: 'OK', status: 200 } });

beforeEach(() => { vi.clearAllMocks(); });

describe('profileApi', () => {
  it('getProfile() nên GET /profile', async () => {
    mockGet.mockResolvedValueOnce(wrapData(mockUser));
    const result = await profileApi.getProfile();
    expect(mockGet).toHaveBeenCalledWith('/profile');
    expect(result.email).toBe('a@b.com');
  });

  it('changePassword() nên POST /profile/password với oldPassword và newPassword', async () => {
    mockPost.mockResolvedValueOnce(wrapData(mockUser));
    const result = await profileApi.changePassword('OldPass1', 'NewPass2');
    expect(mockPost).toHaveBeenCalledWith('/profile/password', {
      oldPassword: 'OldPass1',
      newPassword: 'NewPass2',
    });
    expect(result.id).toBe('user-id');
  });

  it('setup2FA() nên POST /profile/2fa/setup', async () => {
    const totpData = { secret: 'SECRET123', qrCodeUrl: 'https://qr.example.com' };
    mockPost.mockResolvedValueOnce(wrapData(totpData));
    const result = await profileApi.setup2FA();
    expect(mockPost).toHaveBeenCalledWith('/profile/2fa/setup');
    expect(result.secret).toBe('SECRET123');
  });

  it('verify2FASetup() nên POST /profile/2fa/verify với OTP', async () => {
    mockPost.mockResolvedValueOnce(wrapData(mockUser));
    await profileApi.verify2FASetup('111222');
    expect(mockPost).toHaveBeenCalledWith('/profile/2fa/verify', { otp: '111222' });
  });

  it('disable2FA() nên POST /profile/2fa/disable với OTP', async () => {
    mockPost.mockResolvedValueOnce(wrapData(mockUser));
    await profileApi.disable2FA('333444');
    expect(mockPost).toHaveBeenCalledWith('/profile/2fa/disable', { otp: '333444' });
  });

  it('updateAvatar() nên PUT /profile/avatar với FormData', async () => {
    mockPut.mockResolvedValueOnce(wrapData(mockUser));
    const file = new File(['img'], 'avatar.jpg', { type: 'image/jpeg' });
    await profileApi.updateAvatar(file);
    expect(mockPut).toHaveBeenCalledWith(
      '/profile/avatar',
      expect.any(FormData),
      expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
    );
  });
});
