import {
  Container, Grid, Stack, Group, Text, Title, Badge, Button,
  Paper, Breadcrumbs, Anchor, Divider, Skeleton, ActionIcon,
  Tooltip, CopyButton,
} from '@mantine/core';
import {
  IconDownload, IconBookmark, IconBookmarkFilled, IconEdit,
  IconTrash, IconShoppingCart, IconCopy, IconCheck, IconExternalLink,
} from '@tabler/icons-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { documentApi, bookmarkApi, purchaseApi } from '@/shared/services';
import { FileTypeBadge, PriceDisplay, PurchaseModal } from '@/shared/ui';
import { useAuthStore } from '@/stores';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import type { DocumentResponse, PurchaseResponse } from '@/shared/types';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [doc, setDoc] = useState<DocumentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [purchase, setPurchase] = useState<PurchaseResponse | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [purchaseOpened, purchaseHandlers] = useDisclosure(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    documentApi.getById(id)
      .then(setDoc)
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false));

    if (isAuthenticated) {
      bookmarkApi.getMy()
        .then((bms) => setIsBookmarked(bms.some((b) => b.id === id)))
        .catch(() => {});
      purchaseApi.getMy()
        .then((purchases) => {
          const p = purchases.find((p) => p.documentId === id);
          if (p) setPurchase(p);
        })
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  const isOwner = doc && user && doc.ownerId === user.id;
  const isFree = doc?.price === 0;
  const isPurchased = purchase?.status === 'COMPLETED';
  const canDownload = isOwner || isFree || isPurchased;

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) { useAuthStore.getState().setLoginModalOpen(true); return; }
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await bookmarkApi.delete(id!);
        setIsBookmarked(false);
        notifications.show({ message: 'Đã bỏ lưu tài liệu.', color: 'gray' });
      } else {
        await bookmarkApi.create(id!);
        setIsBookmarked(true);
        notifications.show({ message: 'Đã lưu tài liệu!', color: 'green' });
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) { useAuthStore.getState().setLoginModalOpen(true); return; }
    setDownloadLoading(true);
    try {
      const url = await documentApi.getDownloadUrl(id!);
      window.open(url, '_blank', 'noopener');
    } catch {
      notifications.show({ message: 'Không thể tải xuống. Vui lòng thử lại.', color: 'red' });
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Xoá tài liệu',
      children: <Text size="sm">Bạn có chắc muốn xoá tài liệu này? Hành động không thể hoàn tác.</Text>,
      labels: { confirm: 'Xoá', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await documentApi.delete(id!);
        notifications.show({ message: 'Đã xoá tài liệu.', color: 'green' });
        navigate('/private/my-documents');
      },
    });
  };

  const handleBuy = () => {
    if (!isAuthenticated) { useAuthStore.getState().setLoginModalOpen(true); return; }
    purchaseHandlers.open();
  };

  const fileSizeLabel = doc
    ? doc.fileSize >= 1_048_576
      ? `${(doc.fileSize / 1_048_576).toFixed(1)} MB`
      : `${Math.round(doc.fileSize / 1024)} KB`
    : '';

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="md">
          <Skeleton height={24} width={300} />
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="md">
                <Skeleton height={40} />
                <Skeleton height={20} width="60%" />
                <Skeleton height={120} />
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Skeleton height={200} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (!doc) return null;

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Breadcrumbs>
          <Anchor component={Link} to="/" size="sm">Trang chủ</Anchor>
          <Anchor component={Link} to="/documents" size="sm">Tài liệu</Anchor>
          <Text size="sm" c="dimmed" lineClamp={1} maw={300}>{doc.title}</Text>
        </Breadcrumbs>

        <Grid gutter="xl">
          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="lg">
              {/* Title & badge */}
              <Group gap="sm" align="flex-start">
                <FileTypeBadge fileType={doc.fileType} size="md" />
                {doc.status === 'DELETED' && (
                  <Badge color="red" variant="light">Đã xoá</Badge>
                )}
              </Group>

              <Title order={1} size="h2" fw={700} lh={1.3}>
                {doc.title}
              </Title>

              {/* Meta */}
              <Group gap="md" wrap="wrap">
                {doc.schoolName && (
                  <Text size="sm" c="dimmed">🏫 {doc.schoolName}</Text>
                )}
                {doc.departmentName && (
                  <Text size="sm" c="dimmed">📁 {doc.departmentName}</Text>
                )}
                {doc.createdAt && (
                  <Text size="sm" c="dimmed">
                    🕐 {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                )}
              </Group>

              <Divider />

              {/* Description */}
              {doc.description && (
                <Stack gap="xs">
                  <Text fw={600} size="sm" tt="uppercase" c="dimmed">Mô tả</Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{doc.description}</Text>
                </Stack>
              )}

              <Divider />

              {/* File details */}
              <Stack gap="xs">
                <Text fw={600} size="sm" tt="uppercase" c="dimmed">Chi tiết file</Text>
                <Grid gutter="xs">
                  {[
                    { label: 'Tên file', value: doc.originalFileName },
                    { label: 'Kích thước', value: fileSizeLabel },
                    { label: 'Loại file', value: doc.fileType },
                    { label: 'Thuật toán hash', value: doc.hashAlgo },
                  ].map(({ label, value }) => (
                    <Grid.Col span={6} key={label}>
                      <Text size="xs" c="dimmed">{label}</Text>
                      <Text size="sm" fw={500}>{value}</Text>
                    </Grid.Col>
                  ))}
                </Grid>

                {/* Hash */}
                <Group gap="xs" mt="xs">
                  <Text size="xs" c="dimmed">SHA256</Text>
                  <Text size="xs" ff="monospace" c="dimmed" lineClamp={1} style={{ maxWidth: 300 }}>
                    {doc.docHash}
                  </Text>
                  <CopyButton value={doc.docHash}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Đã sao chép' : 'Sao chép hash'} withArrow>
                        <ActionIcon size="xs" variant="subtle" color={copied ? 'green' : 'gray'} onClick={copy}>
                          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>

                {/* Blockchain */}
                {doc.blockchainDocId && (
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">Blockchain ID</Text>
                    <Text size="xs" ff="monospace" c="dimmed" lineClamp={1} style={{ maxWidth: 260 }}>
                      {doc.blockchainDocId}
                    </Text>
                    <ActionIcon size="xs" variant="subtle" color="blue">
                      <IconExternalLink size={12} />
                    </ActionIcon>
                  </Group>
                )}
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md" style={{ position: 'sticky', top: 80 }}>
              {/* Price + Actions */}
              <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed" tt="uppercase">Giá</Text>
                    <PriceDisplay price={doc.price} size="xl" fw={800} />
                  </Stack>

                  <Divider />

                  {/* Action buttons */}
                  <Stack gap="sm">
                    {canDownload ? (
                      <Button
                        fullWidth
                        leftSection={<IconDownload size={16} />}
                        onClick={handleDownload}
                        loading={downloadLoading}
                      >
                        Tải xuống
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        leftSection={<IconShoppingCart size={16} />}
                        onClick={handleBuy}
                        color="primary"
                      >
                        {purchase?.status === 'PENDING' ? 'Tiếp tục thanh toán' : 'Mua ngay'}
                      </Button>
                    )}

                    <Button
                      fullWidth
                      variant="light"
                      color={isBookmarked ? 'primary' : 'gray'}
                      leftSection={isBookmarked ? <IconBookmarkFilled size={16} /> : <IconBookmark size={16} />}
                      onClick={handleBookmarkToggle}
                      loading={bookmarkLoading}
                    >
                      {isBookmarked ? 'Đã lưu' : 'Lưu tài liệu'}
                    </Button>

                    {isOwner && (
                      <>
                        <Button
                          fullWidth
                          variant="outline"
                          leftSection={<IconEdit size={16} />}
                          onClick={() => navigate(`/private/my-documents/${id}/edit`)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          fullWidth
                          variant="subtle"
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          onClick={handleDelete}
                        >
                          Xoá tài liệu
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Paper>

              {/* File summary */}
              <Paper withBorder radius="md" p="md">
                <Stack gap="xs">
                  <Text fw={600} size="sm">Thông tin file</Text>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Tên</Text>
                    <Text size="xs" lineClamp={1} maw={160}>{doc.originalFileName}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Kích thước</Text>
                    <Text size="xs">{fileSizeLabel}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">Định dạng</Text>
                    <FileTypeBadge fileType={doc.fileType} size="xs" />
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Purchase Modal */}
      {doc && (
        <PurchaseModal
          opened={purchaseOpened}
          onClose={purchaseHandlers.close}
          documentId={doc.id}
          documentTitle={doc.title}
          price={doc.price}
          existingPurchase={purchase?.status === 'PENDING' ? purchase : null}
          onSuccess={() => {
            purchaseHandlers.close();
            notifications.show({ title: 'Thanh toán thành công!', message: 'Bạn có thể tải xuống ngay.', color: 'green' });
            setPurchase((p) => p ? { ...p, status: 'COMPLETED' } : p);
          }}
        />
      )}
    </Container>
  );
}
