/**
 * Modal Helpers - Tiện ích hiển thị modals
 * Sử dụng @mantine/modals
 */
import { modals } from '@mantine/modals';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  danger?: boolean;
}

/**
 * Hiển thị confirm dialog
 * @example
 * showConfirm({
 *   title: 'Xác nhận xóa',
 *   message: 'Bạn có chắc muốn xóa item này?',
 *   onConfirm: () => deleteItem(id),
 *   danger: true
 * })
 */
export const showConfirm = ({
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmOptions) => {
  modals.openConfirmModal({
    title,
    children: message,
    labels: { confirm: confirmLabel, cancel: cancelLabel },
    confirmProps: { color: danger ? 'danger' : 'primary' },
    onConfirm,
    onCancel,
  });
};

/**
 * Hiển thị delete confirm dialog (preset cho xóa)
 */
export const showDeleteConfirm = (itemName: string, onConfirm: () => void) => {
  showConfirm({
    title: 'Xác nhận xóa',
    message: `Bạn có chắc chắn muốn xóa "${itemName}"? Hành động này không thể hoàn tác.`,
    confirmLabel: 'Xóa',
    cancelLabel: 'Hủy',
    onConfirm,
    danger: true,
  });
};

/**
 * Đóng tất cả modals
 */
export const closeAllModals = () => {
  modals.closeAll();
};

/**
 * Đóng modal theo id
 */
export const closeModal = (id: string) => {
  modals.close(id);
};
