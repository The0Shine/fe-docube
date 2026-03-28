/**
 * AuthGuard Component Tests
 * Kiểm tra logic bảo vệ route: fetch profile, mở modal, render children
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// ── Mocks ───────────────────────────────────────────────────────────────────

// vi.mock bị hoist → dùng vi.hoisted để khai báo fns trước
const { mockSetUser, mockSetLoginModalOpen, mockSetRoles, mockGetProfile, mockGetMyRoles } = vi.hoisted(() => ({
  mockSetUser: vi.fn(),
  mockSetLoginModalOpen: vi.fn(),
  mockSetRoles: vi.fn(),
  mockGetProfile: vi.fn(),
  mockGetMyRoles: vi.fn(),
}));

// Auth store state có thể được ghi đè per-test
let mockAuthState = {
  isAuthenticated: false,
  accessToken: null as string | null,
  user: null as object | null,
  setUser: mockSetUser,
  setRoles: mockSetRoles,
  setLoginModalOpen: mockSetLoginModalOpen,
};

vi.mock('@/stores', () => ({
  useAuthStore: (selector?: (s: typeof mockAuthState) => unknown) =>
    selector ? selector(mockAuthState) : mockAuthState,
}));

vi.mock('@/shared/services', () => ({
  profileApi: { getProfile: mockGetProfile },
  authApi: { getMyRoles: mockGetMyRoles },
}));

// Mock Mantine components để tránh import CSS
vi.mock('@mantine/core', () => ({
  Center: ({ children }: { children: React.ReactNode }) => <div data-testid="center">{children}</div>,
  Loader: ({ size }: { size: string }) => <div data-testid="loader" data-size={size} />,
}));

import { AuthGuard } from '@/app/router/AuthGuard';

// ── Helpers ─────────────────────────────────────────────────────────────────

function renderGuard(children = <div data-testid="protected">Protected Content</div>) {
  return render(<AuthGuard>{children}</AuthGuard>);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthState = {
    isAuthenticated: false,
    accessToken: null,
    user: null,
    setUser: mockSetUser,
    setRoles: mockSetRoles,
    setLoginModalOpen: mockSetLoginModalOpen,
  };
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe('AuthGuard', () => {
  describe('khi chưa đăng nhập (không có token)', () => {
    it('nên mở login modal', () => {
      renderGuard();
      expect(mockSetLoginModalOpen).toHaveBeenCalledWith(true);
    });

    it('nên không render children', () => {
      renderGuard();
      expect(screen.queryByTestId('protected')).toBeNull();
    });
  });

  describe('khi đã đăng nhập và đã có user profile', () => {
    beforeEach(() => {
      mockAuthState = {
        ...mockAuthState,
        isAuthenticated: true,
        accessToken: 'valid-token',
        user: { id: 'user-1', email: 'user@example.com' },
      };
    });

    it('nên render children ngay lập tức', () => {
      renderGuard();
      expect(screen.getByTestId('protected')).toBeDefined();
    });

    it('nên đóng login modal', () => {
      renderGuard();
      expect(mockSetLoginModalOpen).toHaveBeenCalledWith(false);
    });

    it('nên không gọi getProfile (đã có user)', () => {
      renderGuard();
      expect(mockGetProfile).not.toHaveBeenCalled();
    });
  });

  describe('khi có token nhưng chưa có user (sau khi refresh trang)', () => {
    beforeEach(() => {
      mockAuthState = {
        ...mockAuthState,
        isAuthenticated: true,
        accessToken: 'valid-token',
        user: null,
      };
    });

    it('nên hiển thị Loader trong khi fetch profile', async () => {
      mockGetProfile.mockReturnValue(new Promise(() => {}));
      mockGetMyRoles.mockReturnValue(new Promise(() => {}));

      renderGuard();

      await waitFor(() => {
        expect(screen.getByTestId('loader')).toBeDefined();
      });
    });

    it('nên gọi getProfile + getMyRoles và lưu vào store khi thành công', async () => {
      const mockUser = { id: 'user-1', email: 'user@example.com' };
      const mockRoles = [{ id: 'r1', name: 'USER', description: '', permissions: [] }];
      mockGetProfile.mockResolvedValueOnce(mockUser);
      mockGetMyRoles.mockResolvedValueOnce(mockRoles);

      renderGuard();

      await waitFor(() => {
        expect(mockGetProfile).toHaveBeenCalledOnce();
        expect(mockGetMyRoles).toHaveBeenCalledOnce();
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
        expect(mockSetRoles).toHaveBeenCalledWith(mockRoles);
      });
    });

    it('nên không crash khi fetch thất bại (interceptor xử lý)', async () => {
      mockGetProfile.mockRejectedValueOnce(new Error('401 Unauthorized'));
      mockGetMyRoles.mockRejectedValueOnce(new Error('401 Unauthorized'));

      expect(() => renderGuard()).not.toThrow();

      await waitFor(() => {
        expect(mockGetProfile).toHaveBeenCalledOnce();
      });
    });
  });
});
