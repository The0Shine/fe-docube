import { useState } from "react";
import { Button, Card, Group, SimpleGrid, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconDeviceFloppy, IconUser } from "@tabler/icons-react";
import type { UserSummary } from "@/shared/types";

interface PersonalInfoCardProps {
  user: UserSummary;
  onSaved: (updated: UserSummary) => void;
}

interface PersonalInfoFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export function PersonalInfoCard({ user, onSaved }: PersonalInfoCardProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PersonalInfoFormValues>({
    initialValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phoneNumber: user.phoneNumber ?? "",
      address: user.address ?? "",
    },
    validate: {
      firstName: (v) => (v.trim() ? null : "Vui lòng nhập tên"),
      lastName: (v) => (v.trim() ? null : "Vui lòng nhập họ"),
    },
  });

  const handleSubmit = async (values: PersonalInfoFormValues) => {
    setIsSaving(true);
    try {
      // TODO: gọi profileApi.updateProfile(values) khi backend có endpoint
      const optimistic: UserSummary = { ...user, ...values };
      onSaved(optimistic);
      notifications.show({ message: "Cập nhật thông tin thành công.", color: "green" });
    } catch {
      notifications.show({ message: "Không thể cập nhật thông tin.", color: "red" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card withBorder p="lg" radius="md">
      <Group mb="md" gap="xs">
        <IconUser size={18} color="#dc3545" />
        <Title order={5}>Thông tin cá nhân</Title>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <TextInput
            label="Họ"
            placeholder="Nguyễn"
            radius="md"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Tên"
            placeholder="Văn A"
            radius="md"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Số điện thoại"
            placeholder="0901 234 567"
            radius="md"
            {...form.getInputProps("phoneNumber")}
          />
          <TextInput
            label="Địa chỉ"
            placeholder="TP. Hồ Chí Minh"
            radius="md"
            {...form.getInputProps("address")}
          />
        </SimpleGrid>

        <Group mt="md">
          <Text size="xs" c="dimmed">ID: {user.id}</Text>
          <Button
            type="submit"
            size="sm"
            color="primary"
            leftSection={<IconDeviceFloppy size={15} />}
            loading={isSaving}
            ml="auto"
          >
            Lưu thay đổi
          </Button>
        </Group>
      </form>
    </Card>
  );
}
