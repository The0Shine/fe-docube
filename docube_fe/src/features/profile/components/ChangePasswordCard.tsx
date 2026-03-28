import { useState } from "react";
import { Button, Card, Group, PasswordInput, SimpleGrid, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLock } from "@tabler/icons-react";
import { profileApi } from "@/shared/services";

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordCard() {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PasswordFormValues>({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validate: {
      oldPassword: (v) => (v.length >= 6 ? null : "Ít nhất 6 ký tự"),
      newPassword: (v) =>
        v.length < 6
          ? "Ít nhất 6 ký tự"
          : !/[a-zA-Z]/.test(v) || !/[0-9]/.test(v)
          ? "Phải có cả chữ và số"
          : null,
      confirmPassword: (v, values) =>
        v !== values.newPassword ? "Mật khẩu xác nhận không khớp" : null,
    },
  });

  const handleSubmit = async (values: PasswordFormValues) => {
    setIsSaving(true);
    try {
      await profileApi.changePassword(values.oldPassword, values.newPassword);
      form.reset();
      notifications.show({ title: "Đổi mật khẩu thành công", message: "Hãy đăng nhập lại nếu cần.", color: "green" });
    } catch {
      notifications.show({ message: "Mật khẩu cũ không đúng hoặc có lỗi xảy ra.", color: "red" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card withBorder p="lg" radius="md">
      <Group mb="md" gap="xs">
        <IconLock size={18} color="#dc3545" />
        <Title order={5}>Đổi mật khẩu</Title>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          label="Mật khẩu hiện tại"
          placeholder="••••••••"
          radius="md"
          mb="sm"
          {...form.getInputProps("oldPassword")}
        />
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <PasswordInput
            label="Mật khẩu mới"
            placeholder="••••••••"
            radius="md"
            {...form.getInputProps("newPassword")}
          />
          <PasswordInput
            label="Xác nhận mật khẩu"
            placeholder="••••••••"
            radius="md"
            {...form.getInputProps("confirmPassword")}
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button type="submit" size="sm" color="primary" loading={isSaving}>
            Cập nhật mật khẩu
          </Button>
        </Group>
      </form>
    </Card>
  );
}
