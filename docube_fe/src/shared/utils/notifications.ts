/**
 * Notification Helpers - Tiện ích hiển thị notifications
 * Sử dụng @mantine/notifications
 */
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import { createElement } from 'react';

interface NotificationOptions {
  title?: string;
  message: string;
  autoClose?: number | boolean;
}

/**
 * Hiển thị notification thành công
 */
export const showSuccess = ({ title = 'Thành công', message, autoClose = 5000 }: NotificationOptions) => {
  notifications.show({
    title,
    message,
    color: 'success',
    icon: createElement(IconCheck, { size: 18 }),
    autoClose,
  });
};

/**
 * Hiển thị notification lỗi
 */
export const showError = ({ title = 'Lỗi', message, autoClose = 5000 }: NotificationOptions) => {
  notifications.show({
    title,
    message,
    color: 'danger',
    icon: createElement(IconX, { size: 18 }),
    autoClose,
  });
};

/**
 * Hiển thị notification cảnh báo
 */
export const showWarning = ({ title = 'Cảnh báo', message, autoClose = 5000 }: NotificationOptions) => {
  notifications.show({
    title,
    message,
    color: 'warning',
    icon: createElement(IconAlertTriangle, { size: 18 }),
    autoClose,
  });
};

/**
 * Hiển thị notification thông tin
 */
export const showInfo = ({ title = 'Thông tin', message, autoClose = 5000 }: NotificationOptions) => {
  notifications.show({
    title,
    message,
    color: 'info',
    icon: createElement(IconInfoCircle, { size: 18 }),
    autoClose,
  });
};

/**
 * Hiển thị notification loading với khả năng update
 */
export const showLoading = (id: string, message: string) => {
  notifications.show({
    id,
    title: 'Đang xử lý...',
    message,
    loading: true,
    autoClose: false,
    withCloseButton: false,
  });
};

/**
 * Update notification loading thành success
 */
export const updateToSuccess = (id: string, message: string) => {
  notifications.update({
    id,
    title: 'Thành công',
    message,
    color: 'success',
    icon: createElement(IconCheck, { size: 18 }),
    loading: false,
    autoClose: 3000,
  });
};

/**
 * Update notification loading thành error
 */
export const updateToError = (id: string, message: string) => {
  notifications.update({
    id,
    title: 'Lỗi',
    message,
    color: 'danger',
    icon: createElement(IconX, { size: 18 }),
    loading: false,
    autoClose: 5000,
  });
};

/**
 * Clean all notifications
 */
export const cleanAllNotifications = () => {
  notifications.clean();
};
