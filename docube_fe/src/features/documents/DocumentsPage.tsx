import { Container, Stack, Group, Text, Pagination, Paper } from '@mantine/core';
import { useEffect, useState, useCallback } from 'react';
import { documentApi, bookmarkApi } from '@/shared/services';
import { DocumentGrid, DocumentFilters } from '@/shared/ui';
import { useDocumentStore } from '@/stores';
import { useAuthStore } from '@/stores';
import { notifications } from '@mantine/notifications';
import { DocumentsHero } from './components/DocumentsHero';
import type { DocumentSummaryResponse, PageResponse } from '@/shared/types';

const PAGE_SIZE = 20;

export function DocumentsPage() {
  const { searchQuery, selectedFileType, sortBy } = useDocumentStore();
  const { isAuthenticated } = useAuthStore();

  const [page, setPage] = useState<PageResponse<DocumentSummaryResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const fetchDocuments = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const result = await documentApi.getAll({
        page: pageNum - 1,
        size: PAGE_SIZE,
        sort: sortBy,
      });
      setPage(result);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const bookmarks = await bookmarkApi.getMy();
      setBookmarkedIds(new Set(bookmarks.map((b) => b.id)));
    } catch { /* ignore */ }
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
    fetchDocuments(1);
  }, [fetchDocuments]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    fetchDocuments(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookmarkToggle = async (docId: string, current: boolean) => {
    if (!isAuthenticated) {
      useAuthStore.getState().setLoginModalOpen(true);
      return;
    }
    try {
      if (current) {
        await bookmarkApi.delete(docId);
        setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(docId); return s; });
      } else {
        await bookmarkApi.create(docId);
        setBookmarkedIds((prev) => new Set(prev).add(docId));
      }
    } catch {
      notifications.show({ message: 'Không thể cập nhật bookmark.', color: 'red' });
    }
  };

  // Client-side filter by search + file type
  const filtered = (page?.content ?? []).filter((doc) => {
    const matchSearch = !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.schoolName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !selectedFileType || doc.fileType === selectedFileType;
    return matchSearch && matchType;
  });

  return (
    <>
      <DocumentsHero />

      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Filters */}
          <Paper withBorder radius="md" p="md">
            <DocumentFilters />
          </Paper>

          {/* Results count */}
          {!loading && page && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Hiển thị {filtered.length} / {page.totalElements} tài liệu
              </Text>
            </Group>
          )}

          {/* Grid */}
          <DocumentGrid
            documents={filtered}
            loading={loading}
            emptyTitle="Không tìm thấy tài liệu"
            emptyDescription="Thử thay đổi từ khoá hoặc bộ lọc."
            bookmarkedIds={bookmarkedIds}
            onBookmarkToggle={handleBookmarkToggle}
            showBookmark={isAuthenticated}
          />

          {/* Pagination */}
          {page && page.totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination
                total={page.totalPages}
                value={currentPage}
                onChange={handlePageChange}
                radius="md"
              />
            </Group>
          )}
        </Stack>
      </Container>
    </>
  );
}
