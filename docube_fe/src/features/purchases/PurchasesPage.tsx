import {
  Container, Title, Stack, Text, Table, Badge, Group,
  Button, Tabs, Skeleton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { purchaseApi } from '@/shared/services';
import { EmptyState, PurchaseModal } from '@/shared/ui';
import { useDisclosure } from '@mantine/hooks';
import type { PurchaseResponse, PurchaseStatus } from '@/shared/types';

const STATUS_CONFIG: Record<PurchaseStatus, { color: string; label: string }> = {
  PENDING:   { color: 'yellow', label: 'Chờ thanh toán' },
  COMPLETED: { color: 'green',  label: 'Hoàn thành' },
  FAILED:    { color: 'red',    label: 'Thất bại' },
};

export function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PurchaseResponse | null>(null);
  const [purchaseOpened, purchaseHandlers] = useDisclosure(false);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await purchaseApi.getMy();
      setPurchases(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPurchases(); }, []);

  const openPurchaseModal = (p: PurchaseResponse) => {
    setSelected(p);
    purchaseHandlers.open();
  };

  const renderTable = (items: PurchaseResponse[]) => {
    if (loading) {
      return (
        <Stack gap="sm">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={44} radius="sm" />)}
        </Stack>
      );
    }
    if (!items.length) {
      return (
        <EmptyState
          title="Chưa có giao dịch"
          description="Lịch sử mua tài liệu sẽ xuất hiện ở đây."
        />
      );
    }
    return (
      <Table.ScrollContainer minWidth={600}>
        <Table striped highlightOnHover withTableBorder withColumnBorders radius="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tài liệu</Table.Th>
              <Table.Th>Số tiền</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th style={{ width: 120 }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((p) => {
              const cfg = STATUS_CONFIG[p.status];
              return (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text size="sm" lineClamp={1} maw={280}>{p.documentTitle}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600}>{p.amount.toLocaleString('vi-VN')}đ</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={cfg.color} variant="light">{cfg.label}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {p.status === 'PENDING' && (
                      <Button size="xs" variant="light" onClick={() => openPurchaseModal(p)}>
                        Thanh toán
                      </Button>
                    )}
                    {p.status === 'COMPLETED' && (
                      <Text size="xs" c="green">✓ Hoàn thành</Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  };

  const all = purchases;
  const pending = purchases.filter((p) => p.status === 'PENDING');
  const completed = purchases.filter((p) => p.status === 'COMPLETED');

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap={2}>
          <Title order={2} fw={700}>🛒 Lịch sử mua tài liệu</Title>
          <Text c="dimmed" size="sm">Quản lý các giao dịch mua tài liệu của bạn</Text>
        </Stack>

        <Tabs defaultValue="all">
          <Tabs.List mb="md">
            <Tabs.Tab value="all">
              Tất cả
              <Badge size="xs" variant="light" ml="xs">{all.length}</Badge>
            </Tabs.Tab>
            <Tabs.Tab value="pending">
              Chờ thanh toán
              <Badge size="xs" variant="light" color="yellow" ml="xs">{pending.length}</Badge>
            </Tabs.Tab>
            <Tabs.Tab value="completed">
              Hoàn thành
              <Badge size="xs" variant="light" color="green" ml="xs">{completed.length}</Badge>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="all">{renderTable(all)}</Tabs.Panel>
          <Tabs.Panel value="pending">{renderTable(pending)}</Tabs.Panel>
          <Tabs.Panel value="completed">{renderTable(completed)}</Tabs.Panel>
        </Tabs>
      </Stack>

      {selected && (
        <PurchaseModal
          opened={purchaseOpened}
          onClose={() => { purchaseHandlers.close(); setSelected(null); }}
          documentId={selected.documentId}
          documentTitle={selected.documentTitle}
          price={selected.amount}
          existingPurchase={selected}
          onSuccess={() => {
            purchaseHandlers.close();
            fetchPurchases();
          }}
        />
      )}
    </Container>
  );
}
