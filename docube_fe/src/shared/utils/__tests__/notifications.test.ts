/**
 * Notifications Utility Tests
 * Kiểm tra các helper hiển thị Mantine notifications
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.mock bị hoist lên đầu file nên dùng vi.hoisted để khai báo mock fns trước
const { mockShow, mockUpdate, mockClean } = vi.hoisted(() => ({
  mockShow: vi.fn(),
  mockUpdate: vi.fn(),
  mockClean: vi.fn(),
}));

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: mockShow,
    update: mockUpdate,
    clean: mockClean,
  },
}));

// Mock icons và createElement để tránh phụ thuộc React render trong unit test
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, createElement: vi.fn(() => null) };
});

vi.mock('@tabler/icons-react', () => ({
  IconCheck: 'IconCheck',
  IconX: 'IconX',
  IconAlertTriangle: 'IconAlertTriangle',
  IconInfoCircle: 'IconInfoCircle',
}));

import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  updateToSuccess,
  updateToError,
  cleanAllNotifications,
} from '@/shared/utils/notifications';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('notifications helpers', () => {
  describe('showSuccess', () => {
    it('nên gọi notifications.show với color success và title mặc định', () => {
      showSuccess({ message: 'Lưu thành công' });

      expect(mockShow).toHaveBeenCalledOnce();
      const args = mockShow.mock.calls[0][0];
      expect(args.message).toBe('Lưu thành công');
      expect(args.color).toBe('success');
      expect(args.title).toBe('Thành công');
      expect(args.autoClose).toBe(5000);
    });

    it('nên dùng title tùy chỉnh khi được truyền vào', () => {
      showSuccess({ title: 'OK!', message: 'Done' });
      expect(mockShow.mock.calls[0][0].title).toBe('OK!');
    });
  });

  describe('showError', () => {
    it('nên gọi notifications.show với color danger và title mặc định', () => {
      showError({ message: 'Có lỗi xảy ra' });

      expect(mockShow).toHaveBeenCalledOnce();
      const args = mockShow.mock.calls[0][0];
      expect(args.message).toBe('Có lỗi xảy ra');
      expect(args.color).toBe('danger');
      expect(args.title).toBe('Lỗi');
    });

    it('nên cho phép ghi đè autoClose', () => {
      showError({ message: 'Lỗi', autoClose: false });
      expect(mockShow.mock.calls[0][0].autoClose).toBe(false);
    });
  });

  describe('showWarning', () => {
    it('nên gọi notifications.show với color warning', () => {
      showWarning({ message: 'Cảnh báo quan trọng' });

      const args = mockShow.mock.calls[0][0];
      expect(args.color).toBe('warning');
      expect(args.title).toBe('Cảnh báo');
      expect(args.message).toBe('Cảnh báo quan trọng');
    });
  });

  describe('showInfo', () => {
    it('nên gọi notifications.show với color info', () => {
      showInfo({ message: 'Thông tin hệ thống' });

      const args = mockShow.mock.calls[0][0];
      expect(args.color).toBe('info');
      expect(args.title).toBe('Thông tin');
    });
  });

  describe('showLoading', () => {
    it('nên gọi notifications.show với loading=true, autoClose=false, withCloseButton=false', () => {
      showLoading('load-1', 'Đang xử lý...');

      expect(mockShow).toHaveBeenCalledOnce();
      const args = mockShow.mock.calls[0][0];
      expect(args.id).toBe('load-1');
      expect(args.message).toBe('Đang xử lý...');
      expect(args.loading).toBe(true);
      expect(args.autoClose).toBe(false);
      expect(args.withCloseButton).toBe(false);
      expect(args.title).toBe('Đang xử lý...');
    });
  });

  describe('updateToSuccess', () => {
    it('nên gọi notifications.update với loading=false và color success', () => {
      updateToSuccess('load-1', 'Hoàn thành!');

      expect(mockUpdate).toHaveBeenCalledOnce();
      const args = mockUpdate.mock.calls[0][0];
      expect(args.id).toBe('load-1');
      expect(args.message).toBe('Hoàn thành!');
      expect(args.color).toBe('success');
      expect(args.loading).toBe(false);
      expect(args.autoClose).toBe(3000);
      expect(args.title).toBe('Thành công');
    });
  });

  describe('updateToError', () => {
    it('nên gọi notifications.update với loading=false và color danger', () => {
      updateToError('load-1', 'Thất bại!');

      expect(mockUpdate).toHaveBeenCalledOnce();
      const args = mockUpdate.mock.calls[0][0];
      expect(args.id).toBe('load-1');
      expect(args.message).toBe('Thất bại!');
      expect(args.color).toBe('danger');
      expect(args.loading).toBe(false);
      expect(args.autoClose).toBe(5000);
      expect(args.title).toBe('Lỗi');
    });
  });

  describe('cleanAllNotifications', () => {
    it('nên gọi notifications.clean()', () => {
      cleanAllNotifications();
      expect(mockClean).toHaveBeenCalledOnce();
    });
  });
});
