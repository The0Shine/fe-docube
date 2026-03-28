import { useEffect, useState } from "react";
import { ActionIcon, Button, Card, Center, Checkbox, Group, Loader, Stack, Text, Title, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDevices, IconRefresh, IconTrash } from "@tabler/icons-react";
import { authApi } from "@/shared/services";
import type { Token } from "@/shared/types";

export function DevicesCard() {
  const [devices, setDevices] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState(false);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const list = await authApi.getDevices();
      setDevices(list);
    } catch {
      notifications.show({ message: "Không thể tải danh sách thiết bị.", color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const toggleDevice = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleLogoutDevices = async () => {
    if (selectedIds.length === 0) return;
    setIsRemoving(true);
    try {
      await authApi.logout(selectedIds);
      notifications.show({ message: `Đã đăng xuất ${selectedIds.length} thiết bị.`, color: "orange" });
      setSelectedIds([]);
      await fetchDevices();
    } catch {
      notifications.show({ message: "Không thể đăng xuất thiết bị.", color: "red" });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card withBorder p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconDevices size={18} color="#dc3545" />
          <Title order={5}>Thiết bị đang đăng nhập</Title>
        </Group>
        <Tooltip label="Tải lại" withArrow>
          <ActionIcon variant="subtle" color="gray" onClick={fetchDevices} loading={isLoading}>
            <IconRefresh size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {isLoading ? (
        <Center py="xl"><Loader size="sm" color="primary" /></Center>
      ) : devices.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="md">
          Không có thiết bị nào được tìm thấy.
        </Text>
      ) : (
        <Stack gap="xs">
          {devices.map((device) => (
            <Card key={device.id} withBorder p="sm" radius="md">
              <Group gap="sm" wrap="nowrap">
                <Checkbox
                  checked={selectedIds.includes(device.id)}
                  onChange={() => toggleDevice(device.id)}
                />
                <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                  <Text size="sm" fw={500} lineClamp={1}>{device.ua || "Thiết bị không xác định"}</Text>
                  <Text size="xs" c="dimmed">ID: {device.id.substring(0, 16)}…</Text>
                </Stack>
              </Group>
            </Card>
          ))}

          {selectedIds.length > 0 && (
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={15} />}
              onClick={handleLogoutDevices}
              loading={isRemoving}
              mt="xs"
            >
              Đăng xuất {selectedIds.length} thiết bị đã chọn
            </Button>
          )}
        </Stack>
      )}
    </Card>
  );
}
