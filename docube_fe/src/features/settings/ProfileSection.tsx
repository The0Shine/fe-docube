/**
 * ProfileSection - Tab Profile trong Settings
 * Cho phép user xem, chỉnh sửa thông tin cá nhân, avatar, đổi mật khẩu
 */
import { useState, useRef } from 'react';
import {
  Stack, Card, Title, Text, Group, Button, PasswordInput,
  Avatar, FileButton, Badge, Divider, SimpleGrid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCamera, IconDeviceFloppy } from '@tabler/icons-react';
import { useAuthStore } from '@/stores';
import { profileApi } from '@/shared/services';

export function ProfileSection() {
  const { user, setUser } = useAuthStore();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const resetFileRef = useRef<() => void>(null);

  const passwordForm = useForm({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validate: {
      oldPassword: (v) => (v.length >= 6 ? null : 'Nhập mật khẩu hiện tại'),
      newPassword: (v) => {
        if (v.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(v)) return 'Phải có ít nhất 1 chữ cái và 1 số';
        return null;
      },
      confirmPassword: (v, vals) => (v === vals.newPassword ? null : 'Mật khẩu không khớp'),
    },
  });

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return;
    setAvatarLoading(true);
    try {
      const updated = await profileApi.updateAvatar(file);
      setUser(updated);
      notifications.show({ message: 'Cập nhật avatar thành công!', color: 'green' });
    } catch {
      notifications.show({ message: 'Không thể cập nhật avatar.', color: 'red' });
    } finally {
      setAvatarLoading(false);
      resetFileRef.current?.();
    }
  };

  const handlePasswordChange = async (values: typeof passwordForm.values) => {
    setPasswordLoading(true);
    try {
      const updated = await profileApi.changePassword(values.oldPassword, values.newPassword);
      setUser(updated);
      passwordForm.reset();
      notifications.show({ message: 'Đổi mật khẩu thành công!', color: 'green' });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      notifications.show({
        message: err?.response?.data?.message || 'Mật khẩu hiện tại không đúng.',
        color: 'red',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return <Text c="dimmed">Chưa đăng nhập.</Text>;

  const fullName = `${user.lastName} ${user.firstName}`;

  return (
    <Stack gap="lg">
      {/* ── Avatar & Info ── */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">Thông tin cá nhân</Title>
        <Group align="flex-start" gap="xl">
          <Stack align="center" gap="xs">
            <Avatar src={user.avatar || undefined} size={80} radius={80} color="blue">
              {user.firstName?.[0]}
            </Avatar>
            <FileButton resetRef={resetFileRef} onChange={handleAvatarChange} accept="image/*">
              {(props) => (
                <Button
                  {...props}
                  size="xs"
                  variant="light"
                  leftSection={<IconCamera size={14} />}
                  loading={avatarLoading}
                >
                  Đổi ảnh
                </Button>
              )}
            </FileButton>
          </Stack>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="xs">
              <Text fw={600} size="lg">{fullName}</Text>
            </Group>
            <Text size="sm" c="dimmed">{user.email}</Text>
            {user.phoneNumber && <Text size="sm">{user.phoneNumber}</Text>}
            {user.address && <Text size="sm" c="dimmed">{user.address}</Text>}
            <Group gap="xs" mt="xs">
              <Badge variant="light" color="blue" size="sm">
                {user.id.substring(0, 8)}...
              </Badge>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* ── Change Password ── */}
      <Card withBorder p="lg">
        <Title order={4} mb="md">Đổi mật khẩu</Title>
        <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
          <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="md">
            <PasswordInput
              label="Mật khẩu hiện tại"
              placeholder="••••••••"
              {...passwordForm.getInputProps('oldPassword')}
              radius="md"
            />
            <Divider />
            <PasswordInput
              label="Mật khẩu mới"
              placeholder="••••••••"
              {...passwordForm.getInputProps('newPassword')}
              radius="md"
            />
            <PasswordInput
              label="Xác nhận mật khẩu mới"
              placeholder="••••••••"
              {...passwordForm.getInputProps('confirmPassword')}
              radius="md"
            />
            <Button
              type="submit"
              leftSection={<IconDeviceFloppy size={16} />}
              loading={passwordLoading}
              mt="xs"
              style={{ alignSelf: 'flex-start' }}
            >
              Lưu mật khẩu mới
            </Button>
          </SimpleGrid>
        </form>
      </Card>
    </Stack>
  );
}
