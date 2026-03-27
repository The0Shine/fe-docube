/**
 * Auth Store Tests
 * Kiểm tra trạng thái và actions của auth store
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginResponse, UserSummary, Role } from '@/shared/types';

// Helper: reset store về initial state trước mỗi test
function resetStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    clientId: null,
    isAuthenticated: false,
    is2FARequired: false,
    roles: [],
  });
}

const mockLoginResponse: LoginResponse = {
  accessToken: 'access-token-123',
  accessTokenType: 'Bearer',
  refreshToken: 'refresh-token-456',
  clientId: 'client-id-789',
  userId: 'user-id-abc',
};

const mock2FALoginResponse: LoginResponse = {
  accessToken: 'temp-token-2fa',
  accessTokenType: '2FA',
  refreshToken: undefined,
  clientId: 'client-id-789',
  userId: 'user-id-abc',
};

const mockUser: UserSummary = {
  id: 'user-id-abc',
  email: 'test@example.com',
  firstName: 'Văn',
  lastName: 'Nguyễn',
  phoneNumber: '+84123456789',
  address: 'Hà Nội',
  avatar: 'https://example.com/avatar.png',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('setLoginResponse', () => {
    it('nên lưu tokens khi login thường (Bearer)', () => {
      useAuthStore.getState().setLoginResponse(mockLoginResponse);

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('access-token-123');
      expect(state.refreshToken).toBe('refresh-token-456');
      expect(state.clientId).toBe('client-id-789');
      expect(state.isAuthenticated).toBe(true);
      expect(state.is2FARequired).toBe(false);
    });

    it('nên đặt is2FARequired=true và isAuthenticated=false khi login 2FA', () => {
      useAuthStore.getState().setLoginResponse(mock2FALoginResponse);

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('temp-token-2fa');
      expect(state.isAuthenticated).toBe(false);
      expect(state.is2FARequired).toBe(true);
      expect(state.refreshToken).toBeNull();
    });

    it('nên lưu token và đặt isAuthenticated=true cho FORGOT_PASSWORD (temp bearer token)', () => {
      // Temp token dùng để gọi /auth/reset-password — cần isAuthenticated=true
      const forgotResp: LoginResponse = {
        accessToken: 'forgot-token',
        accessTokenType: 'FORGOT_PASSWORD',
      };
      useAuthStore.getState().setLoginResponse(forgotResp);

      expect(useAuthStore.getState().accessToken).toBe('forgot-token');
      expect(useAuthStore.getState().isAuthenticated).toBe(true); // temp bearer
      expect(useAuthStore.getState().is2FARequired).toBe(false);
    });
  });

  describe('setUser', () => {
    it('nên lưu thông tin user vào store', () => {
      useAuthStore.getState().setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.user?.email).toBe('test@example.com');
      expect(state.user?.firstName).toBe('Văn');
    });
  });

  describe('setAccessToken', () => {
    it('nên cập nhật access token mới', () => {
      useAuthStore.getState().setLoginResponse(mockLoginResponse);
      useAuthStore.getState().setAccessToken('new-access-token');

      expect(useAuthStore.getState().accessToken).toBe('new-access-token');
    });
  });

  describe('clear2FARequired', () => {
    it('nên xóa cờ is2FARequired', () => {
      useAuthStore.getState().setLoginResponse(mock2FALoginResponse);
      expect(useAuthStore.getState().is2FARequired).toBe(true);

      useAuthStore.getState().clear2FARequired();

      expect(useAuthStore.getState().is2FARequired).toBe(false);
    });
  });

  describe('logout', () => {
    it('nên xóa toàn bộ auth state', () => {
      // Setup: đăng nhập trước
      useAuthStore.getState().setLoginResponse(mockLoginResponse);
      useAuthStore.getState().setUser(mockUser);

      // Act: logout
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.clientId).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.is2FARequired).toBe(false);
      expect(state.roles).toHaveLength(0);
    });
  });

  describe('clearAuth', () => {
    it('nên hoạt động giống logout', () => {
      useAuthStore.getState().setLoginResponse(mockLoginResponse);
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
    });
  });

  describe('setRoles', () => {
    it('nên lưu danh sách roles', () => {
      const mockRoles: Role[] = [
        { id: 'role-1', name: 'ADMIN', description: 'Admin role', permissions: [] },
        { id: 'role-2', name: 'USER', description: 'User role', permissions: [] },
      ];

      useAuthStore.getState().setRoles(mockRoles);

      expect(useAuthStore.getState().roles).toHaveLength(2);
      expect(useAuthStore.getState().roles[0].name).toBe('ADMIN');
    });
  });

  describe('initial state', () => {
    it('nên có state ban đầu hợp lệ', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.is2FARequired).toBe(false);
      expect(state.roles).toEqual([]);
    });
  });
});
