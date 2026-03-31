import {
  Container, Title, Stack, Group, Button, Table, Badge,
  Text, ActionIcon, Tooltip, Tabs, Skeleton,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentApi } from '@/shared/services';
import { FileTypeBadge, PriceDisplay, EmptyState } from '@/shared/ui';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import type { DocumentResponse } from '@/shared/types';

export function MyDocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await documentApi.getMy();
      setDocuments(docs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = (doc: DocumentResponse) => {
    modals.openConfirmModal({
      title: 'Xoá tài liệu',
      children: (
        <Text size="sm">
          Bạn có chắc muốn xoá <b>{doc.title}</b>? Hành động không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xoá', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await documentApi.delete(doc.id);
        notifications.show({ message: 'Đã xoá tài liệu.', color: 'green' });
        fetchDocs();
      },
    });
  };

  const active = documents.filter((d) => d.status === 'ACTIVE');
  const deleted = documents.filter((d) => d.status === 'DELETED');

  const renderTable = (docs: DocumentResponse[]) => {
    if (loading) {
      return (
        <Stack gap="sm">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={44} radius="sm" />)}
        </Stack>
      );
    }
    if (!docs.length) {
      return (
        <EmptyState
          title="Chưa có tài liệu"
          description="Bắt đầu bằng cách đăng tài liệu đầu tiên của bạn."
          actionLabel="Đăng tài liệu"
          onAction={() => navigate('/private/upload')}
        />
      );
    }
    return (
      <Table.ScrollContainer minWidth={600}>
        <Table striped highlightOnHover withTableBorder withColumnBorders radius="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tên tài liệu</Table.Th>
              <Table.Th>Loại</Table.Th>
              <Table.Th>Giá</Table.Th>
              <Table.Th>Ngày đăng</Table.Th>
              <Table.Th style={{ width: 120 }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {docs.map((doc) => (
              <Table.Tr key={doc.id}>
                <Table.Td>
                  <Text size="sm" fw={500} lineClamp={1} maw={280}>{doc.title}</Text>
                </Table.Td>
                <Table.Td><FileTypeBadge fileType={doc.fileType} /></Table.Td>
                <Table.Td><PriceDisplay price={doc.price} /></Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="Xem" withArrow>
                      <ActionIcon variant="subtle" size="sm" onClick={() => navigate(`/documents/${doc.id}`)}>
                        <IconEye size={15} />
                      </ActionIcon>
                    </Tooltip>
                    {doc.status === 'ACTIVE' && (
                      <>
                        <Tooltip label="Chỉnh sửa" withArrow>
                          <ActionIcon variant="subtle" size="sm" onClick={() => navigate(`/private/my-documents/${doc.id}/edit`)}>
                            <IconEdit size={15} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Xoá" withArrow>
                          <ActionIcon variant="subtle" color="red" size="sm" onClick={() => handleDelete(doc)}>
                            <IconTrash size={15} />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Stack gap={2}>
          <Title order={2} fw={700}>📄 Tài liệu của tôi</Title>
          <Text c="dimmed" size="sm">Quản lý tài liệu bạn đã đăng</Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/private/upload')}>
          Đăng tài liệu
        </Button>
      </Group>

      <Tabs defaultValue="active">
        <Tabs.List mb="md">
          <Tabs.Tab value="active">
            Đang hoạt động
            <Badge size="xs" variant="light" ml="xs">{active.length}</Badge>
          </Tabs.Tab>
          <Tabs.Tab value="deleted">
            Đã xoá
            <Badge size="xs" variant="light" color="gray" ml="xs">{deleted.length}</Badge>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="active">{renderTable(active)}</Tabs.Panel>
        <Tabs.Panel value="deleted">{renderTable(deleted)}</Tabs.Panel>
      </Tabs>
    </Container>
  );
}
