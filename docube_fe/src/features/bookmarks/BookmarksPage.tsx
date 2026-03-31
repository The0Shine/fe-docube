import { Container, Title, Stack, Text } from '@mantine/core';
import { useEffect, useState, useCallback } from 'react';
import { bookmarkApi } from '@/shared/services';
import { DocumentGrid } from '@/shared/ui';
import { notifications } from '@mantine/notifications';
import type { DocumentSummaryResponse } from '@/shared/types';

export function BookmarksPage() {
  const [documents, setDocuments] = useState<DocumentSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const bms = await bookmarkApi.getMy();
      setDocuments(bms);
      setBookmarkedIds(new Set(bms.map((b) => b.id)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const handleBookmarkToggle = async (docId: string, current: boolean) => {
    if (!current) return; // on this page we only remove
    try {
      await bookmarkApi.delete(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(docId); return s; });
      notifications.show({ message: 'Đã bỏ lưu tài liệu.', color: 'gray' });
    } catch {
      notifications.show({ message: 'Không thể bỏ lưu. Vui lòng thử lại.', color: 'red' });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap={2}>
          <Title order={2} fw={700}>🔖 Tài liệu đã lưu</Title>
          <Text c="dimmed" size="sm">
            {loading ? '' : `${documents.length} tài liệu đã được lưu`}
          </Text>
        </Stack>

        <DocumentGrid
          documents={documents}
          loading={loading}
          emptyTitle="Chưa lưu tài liệu nào"
          emptyDescription="Nhấn icon bookmark trên tài liệu để lưu lại."
          bookmarkedIds={bookmarkedIds}
          onBookmarkToggle={handleBookmarkToggle}
          showBookmark
        />
      </Stack>
    </Container>
  );
}
