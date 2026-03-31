import { Paper, Stack, Group, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconBookmark, IconBookmarkFilled, IconSchool, IconFolder } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { FileTypeBadge } from './FileTypeBadge';
import { PriceDisplay } from './PriceDisplay';
import type { DocumentSummaryResponse } from '@/shared/types';

interface DocumentCardProps {
  document: DocumentSummaryResponse;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string, current: boolean) => void;
  showBookmark?: boolean;
}

export function DocumentCard({
  document,
  isBookmarked = false,
  onBookmarkToggle,
  showBookmark = false,
}: DocumentCardProps) {
  const navigate = useNavigate();

  const relativeTime = document.createdAt
    ? formatRelativeTime(document.createdAt)
    : null;

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{ cursor: 'pointer', transition: 'box-shadow 150ms ease, transform 150ms ease' }}
      styles={{ root: { height: '100%' } }}
      onClick={() => navigate(`/documents/${document.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--mantine-shadow-md)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      <Stack gap="sm" h="100%" justify="space-between">
        {/* Top: badge + bookmark */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <FileTypeBadge fileType={document.fileType} />
          {showBookmark && onBookmarkToggle && (
            <Tooltip label={isBookmarked ? 'Bỏ lưu' : 'Lưu tài liệu'} withArrow>
              <ActionIcon
                variant="subtle"
                color={isBookmarked ? 'primary' : 'gray'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle(document.id, isBookmarked);
                }}
              >
                {isBookmarked ? <IconBookmarkFilled size={16} /> : <IconBookmark size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        {/* Title */}
        <Text
          fw={600}
          size="sm"
          lh={1.4}
          c="blue.7"
          style={{
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {document.title}
        </Text>

        {/* School / Department */}
        <Stack gap={4}>
          {document.schoolName && (
            <Group gap={4} wrap="nowrap">
              <IconSchool size={13} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed" truncate>
                {document.schoolName}
              </Text>
            </Group>
          )}
          {document.departmentName && (
            <Group gap={4} wrap="nowrap">
              <IconFolder size={13} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed" truncate>
                {document.departmentName}
              </Text>
            </Group>
          )}
        </Stack>

        {/* Footer: price + date */}
        <Group justify="space-between" mt="auto" pt="xs" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          <PriceDisplay price={document.price} size="sm" />
          {relativeTime && (
            <Text size="xs" c="dimmed">{relativeTime}</Text>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes || 1} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}
