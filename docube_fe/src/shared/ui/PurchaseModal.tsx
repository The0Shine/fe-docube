import {
  Modal, Stack, Text, Group, Badge, Button, CopyButton,
  ActionIcon, Tooltip, Loader, Center, Image, Divider,
} from '@mantine/core';
import { IconCopy, IconCheck, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { purchaseApi } from '@/shared/services';
import type { PurchaseResponse } from '@/shared/types';

interface PurchaseModalProps {
  opened: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  price: number;
  existingPurchase?: PurchaseResponse | null;
  onSuccess?: () => void;
}

const STATUS_CONFIG = {
  PENDING:   { color: 'yellow', label: 'Chờ thanh toán' },
  COMPLETED: { color: 'green',  label: 'Hoàn thành' },
  FAILED:    { color: 'red',    label: 'Thất bại' },
};

export function PurchaseModal({
  opened, onClose, documentId, documentTitle, price,
  existingPurchase, onSuccess,
}: PurchaseModalProps) {
  const [purchase, setPurchase] = useState<PurchaseResponse | null>(existingPurchase ?? null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const initPurchase = async () => {
    setLoading(true);
    try {
      const result = await purchaseApi.create({ documentId });
      setPurchase(result);
    } catch {
      // error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!purchase) return;
    setChecking(true);
    try {
      const purchases = await purchaseApi.getMy();
      const updated = purchases.find((p) => p.id === purchase.id);
      if (updated) {
        setPurchase(updated);
        if (updated.status === 'COMPLETED') onSuccess?.();
      }
    } finally {
      setChecking(false);
    }
  };

  const handleClose = () => {
    setPurchase(existingPurchase ?? null);
    onClose();
  };

  const statusConfig = purchase ? STATUS_CONFIG[purchase.status] : null;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Mua tài liệu"
      centered
      size={420}
      radius="md"
    >
      <Stack gap="md">
        {/* Document info */}
        <Stack gap={4}>
          <Text size="sm" c="dimmed">Tài liệu</Text>
          <Text fw={600} lineClamp={2}>{documentTitle}</Text>
          <Text fw={700} size="xl" c="primary">
            {price.toLocaleString('vi-VN')}đ
          </Text>
        </Stack>

        <Divider />

        {!purchase ? (
          /* Initial state - confirm to create */
          <Stack gap="sm">
            <Text size="sm" c="dimmed">
              Sau khi xác nhận, hệ thống sẽ tạo mã QR thanh toán chuyển khoản cho bạn.
            </Text>
            <Button fullWidth size="md" onClick={initPurchase} loading={loading}>
              Xác nhận mua
            </Button>
          </Stack>
        ) : (
          /* Purchase created - show QR */
          <Stack gap="md">
            {/* Status */}
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Trạng thái</Text>
              <Badge color={statusConfig?.color} variant="light">
                {statusConfig?.label}
              </Badge>
            </Group>

            {/* QR Code */}
            {purchase.qrUrl && purchase.status === 'PENDING' && (
              <Center>
                <Image
                  src={purchase.qrUrl}
                  alt="QR Code thanh toán"
                  width={200}
                  height={200}
                  radius="md"
                  style={{ border: '1px solid var(--mantine-color-default-border)' }}
                />
              </Center>
            )}

            {purchase.status === 'COMPLETED' && (
              <Center>
                <Stack align="center" gap="xs">
                  <IconCheck size={48} color="var(--mantine-color-green-6)" />
                  <Text c="green" fw={600}>Thanh toán thành công!</Text>
                </Stack>
              </Center>
            )}

            {/* Payment code */}
            {purchase.paymentCode && purchase.status === 'PENDING' && (
              <Stack gap={4}>
                <Text size="sm" c="dimmed">Mã thanh toán (nội dung chuyển khoản)</Text>
                <Group gap="xs">
                  <Text fw={700} ff="monospace" size="md">{purchase.paymentCode}</Text>
                  <CopyButton value={purchase.paymentCode}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Đã sao chép' : 'Sao chép'} withArrow>
                        <ActionIcon
                          color={copied ? 'green' : 'gray'}
                          variant="subtle"
                          onClick={copy}
                          size="sm"
                        >
                          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
                <Text size="xs" c="dimmed">
                  Chuyển khoản đúng số tiền và nội dung để hệ thống tự xác nhận.
                </Text>
              </Stack>
            )}

            {/* Actions */}
            <Group justify="space-between" mt="xs">
              <Button variant="subtle" color="gray" onClick={handleClose}>
                Đóng
              </Button>
              {purchase.status === 'PENDING' && (
                <Button
                  variant="light"
                  leftSection={checking ? <Loader size={14} /> : <IconRefresh size={14} />}
                  onClick={checkStatus}
                  disabled={checking}
                >
                  Kiểm tra thanh toán
                </Button>
              )}
              {purchase.status === 'COMPLETED' && (
                <Button onClick={handleClose}>Đóng</Button>
              )}
            </Group>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
