import { SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { DocumentCard } from './DocumentCard';
import { EmptyState } from './EmptyState';
import { IconFiles } from '@tabler/icons-react';
import type { DocumentSummaryResponse } from '@/shared/types';

interface DocumentGridProps {
  documents: DocumentSummaryResponse[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  bookmarkedIds?: Set<string>;
  onBookmarkToggle?: (id: string, current: boolean) => void;
  showBookmark?: boolean;
}

export function DocumentGrid({
  documents,
  loading = false,
  emptyTitle = 'Chưa có tài liệu',
  emptyDescription,
  bookmarkedIds,
  onBookmarkToggle,
  showBookmark = false,
}: DocumentGridProps) {
  if (loading) {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
        {Array.from({ length: 8 }).map((_, i) => (
          <Stack key={i} gap="xs">
            <Skeleton height={20} width={60} radius="sm" />
            <Skeleton height={40} radius="sm" />
            <Skeleton height={14} width="70%" radius="sm" />
            <Skeleton height={14} width="50%" radius="sm" />
          </Stack>
        ))}
      </SimpleGrid>
    );
  }

  if (!documents.length) {
    return (
      <EmptyState
        icon={<IconFiles size={56} stroke={1} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          isBookmarked={bookmarkedIds?.has(doc.id)}
          onBookmarkToggle={onBookmarkToggle}
          showBookmark={showBookmark}
        />
      ))}
    </SimpleGrid>
  );
}
