import { Stack, Text, Title, Button } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title = 'Không có dữ liệu',
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Stack align="center" gap="md" py={64}>
      <Text c="dimmed" style={{ opacity: 0.4 }}>
        {icon ?? <IconInbox size={56} stroke={1} />}
      </Text>
      <Stack align="center" gap={4}>
        <Title order={4} c="dimmed">{title}</Title>
        {description && (
          <Text size="sm" c="dimmed" ta="center" maw={360}>
            {description}
          </Text>
        )}
      </Stack>
      {actionLabel && onAction && (
        <Button variant="light" onClick={onAction} mt="xs">
          {actionLabel}
        </Button>
      )}
    </Stack>
  );
}
