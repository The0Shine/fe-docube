/**
 * Auth Store - Quản lý trạng thái xác thực
 * Sử dụng Zustand với persist middleware để lưu tokens vào localStorage
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSummary, LoginResponse, Role } from '@/shared/types';

interface AuthState {
  // ── Auth state ──────────────────────────────────────────────────────────
  user: UserSummary | null;
  accessToken: string | null;
  refreshToken: string | null;
  clientId: string | null;
  isAuthenticated: boolean;
  /**
   * true khi login trả về accessTokenType = "2FA"
   * → FE phải hiển thị form nhập OTP 2FA
   */
  is2FARequired: boolean;
  /** Danh sách roles của user (lazy-loaded) */
  roles: Role[];

  // ── Modal state ──────────────────────────────────────────────────────────
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;

  // ── Actions ──────────────────────────────────────────────────────────────
  /**
   * Lưu kết quả từ /auth/login hoặc /auth/google
   * Tự động phát hiện 2FA flow dựa vào accessTokenType
   */
  setLoginResponse: (response: LoginResponse) => void;

  /** Cập nhật thông tin profile (sau khi gọi GET /profile) */
  setUser: (user: UserSummary) => void;

  /** Cập nhật access token mới (sau khi refresh) */
  setAccessToken: (accessToken: string) => void;

  /** Cập nhật danh sách roles */
  setRoles: (roles: Role[]) => void;

  /** Clear 2FA required flag (sau khi xác thực 2FA thành công) */
  clear2FARequired: () => void;

  /** Đăng xuất hoàn toàn — xóa hết state */
  logout: () => void;

  /** Alias: clear auth state (dùng khi session hết hạn, không refresh được) */
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ── Initial state ──────────────────────────────────────────────────
      user: null,
      accessToken: null,
      refreshToken: null,
      clientId: null,
      isAuthenticated: false,
      is2FARequired: false,
      roles: [],
      isLoginModalOpen: false,

      // ── Actions ────────────────────────────────────────────────────────
      setLoginModalOpen: (open: boolean) => set({ isLoginModalOpen: open }),
      setLoginResponse: (response: LoginResponse) => {
        const is2FA = response.accessTokenType === 'TWO_FA_VERIFY';
        const isEmailVerify = response.accessTokenType === 'EMAIL_VERIFY';

        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken ?? null,
          clientId: response.clientId ?? null,
          // Nếu là 2FA flow hoặc Email Verify -> chưa authenticated
          isAuthenticated: !is2FA && !isEmailVerify,
          is2FARequired: is2FA,
        });
      },

      setUser: (user: UserSummary) => set({ user }),

      setAccessToken: (accessToken: string) => set({ accessToken }),

      setRoles: (roles: Role[]) => set({ roles }),

      clear2FARequired: () => set({ is2FARequired: false }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          clientId: null,
          isAuthenticated: false,
          is2FARequired: false,
          roles: [],
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          clientId: null,
          isAuthenticated: false,
          is2FARequired: false,
          roles: [],
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        clientId: state.clientId,
        isAuthenticated: state.isAuthenticated,
        roles: state.roles,
      }),
    }
  )
);

// Backward-compat helper: đọc token (legacy code có thể dùng .token)
export const getAuthToken = () => useAuthStore.getState().accessToken;
