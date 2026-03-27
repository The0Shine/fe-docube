/**
 * SecuritySection - Tab Security trong Settings
 * 2FA setup/disable và Device Management
 */
import { useState, useEffect } from 'react';
import {
  Stack, Card, Title, Text, Group, Button, Badge, ActionIcon,
  TextInput, Checkbox, Center, Image, Alert, Loader, Divider, PinInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconShield, IconDevices, IconTrash, IconRefresh } from '@tabler/icons-react';
import { useAuthStore } from '@/stores';
import { profileApi, authApi } from '@/shared/services';
import type { Token, TotpSetupResponse } from '@/shared/types';

export function SecuritySection() {
  return (
    <Stack gap="lg">
      <TwoFACard />
      <DevicesCard />
    </Stack>
  );
}

// ─── 2FA CARD ─────────────────────────────────────────────────────────────────

function TwoFACard() {
  const setUser = useAuthStore((s) => s.setUser);
  const [totpData, setTotpData] = useState<TotpSetupResponse | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [disableOtp, setDisableOtp] = useState('');
  const [showDisable, setShowDisable] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const data = await profileApi.setup2FA();
      setTotpData(data);
    } catch {
      notifications.show({ message: 'Không thể khởi tạo 2FA.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const updated = await profileApi.verify2FASetup(otp);
      setUser(updated);
      setTotpData(null);
      setOtp('');
      notifications.show({ title: 'Bật 2FA thành công', message: 'Từ lần login sau, bạn sẽ cần nhập OTP TOTP.', color: 'green' });
    } catch {
      notifications.show({ message: 'OTP không đúng. Vui lòng thử lại.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (disableOtp.length !== 6) return;
    setLoading(true);
    try {
      const updated = await profileApi.disable2FA(disableOtp);
      setUser(updated);
      setShowDisable(false);
      setDisableOtp('');
      notifications.show({ message: 'Đã tắt xác thực 2 lớp.', color: 'orange' });
    } catch {
      notifications.show({ message: 'OTP không đúng.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder p="lg">
      <Group mb="md">
        <IconShield size={20} />
        <Title order={4}>Xác thực 2 lớp (2FA)</Title>
        <Badge color="gray" variant="light">
          Trạng thái: Chưa rõ
        </Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="md">
        Tăng cường bảo mật tài khoản bằng Google Authenticator.
      </Text>

      {!totpData && !showDisable && (
        <Group>
          <Button onClick={handleSetup} loading={loading} leftSection={<IconShield size={16} />}>
            Cài đặt / Bật 2FA
          </Button>
          <Button color="red" variant="light" onClick={() => setShowDisable(true)}>
            Tắt 2FA
          </Button>
        </Group>
      )}

      {/* Setup flow */}
      {totpData && (
        <Stack gap="md">
          <Alert color="blue">
            Quét mã QR bằng ứng dụng <strong>Google Authenticator</strong> hoặc nhập secret key thủ công.
          </Alert>
          <Center>
            <Image src={totpData.qrCodeUrl} w={180} h={180} radius="md" />
          </Center>
          <TextInput label="Secret Key" value={totpData.secret} readOnly radius="md" />
          <Divider label="Sau khi quét, nhập OTP để xác nhận" labelPosition="center" />
          <Center>
            <PinInput length={6} type="number" value={otp} onChange={setOtp} onComplete={handleVerifySetup} />
          </Center>
          {loading && <Center><Loader size="sm" /></Center>}
          <Group>
            <Button onClick={handleVerifySetup} loading={loading} disabled={otp.length !== 6}>
              Xác nhận & Bật 2FA
            </Button>
            <Button variant="subtle" onClick={() => { setTotpData(null); setOtp(''); }}>
              Hủy
            </Button>
          </Group>
        </Stack>
      )}

      {/* Disable flow */}
      {showDisable && (
        <Stack gap="md">
          <Text size="sm">Nhập OTP từ Google Authenticator để tắt 2FA:</Text>
          <Center>
            <PinInput length={6} type="number" value={disableOtp} onChange={setDisableOtp} onComplete={handleDisable} />
          </Center>
          <Group>
            <Button color="red" onClick={handleDisable} loading={loading} disabled={disableOtp.length !== 6}>
              Tắt 2FA
            </Button>
            <Button variant="subtle" onClick={() => { setShowDisable(false); setDisableOtp(''); }}>
              Hủy
            </Button>
          </Group>
        </Stack>
      )}
    </Card>
  );
}

// ─── DEVICES CARD ─────────────────────────────────────────────────────────────

function DevicesCard() {
  const [devices, setDevices] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const list = await authApi.getDevices();
      setDevices(list);
    } catch {
      notifications.show({ message: 'Không thể tải danh sách thiết bị.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const toggleDevice = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleLogout = async () => {
    if (selectedIds.length === 0) return;
    setLogoutLoading(true);
    try {
      await authApi.logout(selectedIds);
      notifications.show({ message: `Đã đăng xuất ${selectedIds.length} thiết bị.`, color: 'orange' });
      setSelectedIds([]);
      await fetchDevices();
    } catch {
      notifications.show({ message: 'Không thể đăng xuất thiết bị.', color: 'red' });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <Card withBorder p="lg">
      <Group justify="space-between" mb="md">
        <Group>
          <IconDevices size={20} />
          <Title order={4}>Thiết bị đang đăng nhập</Title>
        </Group>
        <ActionIcon variant="subtle" onClick={fetchDevices} loading={loading}>
          <IconRefresh size={16} />
        </ActionIcon>
      </Group>

      {loading ? (
        <Center py="lg"><Loader size="sm" /></Center>
      ) : devices.length === 0 ? (
        <Text c="dimmed" size="sm">Không có thiết bị nào được tìm thấy.</Text>
      ) : (
        <Stack gap="sm">
          {devices.map((device) => (
            <Card key={device.id} withBorder p="sm" radius="md">
              <Group justify="space-between">
                <Group>
                  <Checkbox
                    checked={selectedIds.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                  />
                  <Stack gap={2}>
                    <Text size="sm" fw={500} lineClamp={1} maw={300}>{device.ua}</Text>
                    <Text size="xs" c="dimmed">ID: {device.id.substring(0, 12)}...</Text>
                  </Stack>
                </Group>
              </Group>
            </Card>
          ))}

          {selectedIds.length > 0 && (
            <Button
              color="red"
              variant="light"
              leftSection={<IconTrash size={16} />}
              onClick={handleLogout}
              loading={logoutLoading}
              mt="sm"
            >
              Đăng xuất {selectedIds.length} thiết bị đã chọn
            </Button>
          )}
        </Stack>
      )}
    </Card>
  );
}
