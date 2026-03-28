import { useEffect, useState } from "react";
import { Center, Container, Loader, SimpleGrid, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/stores";
import { profileApi, authApi } from "@/shared/services";
import { ProfileCover } from "./components/ProfileCover";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ChangePasswordCard } from "./components/ChangePasswordCard";
import { TwoFACard } from "./components/TwoFACard";
import { DevicesCard } from "./components/DevicesCard";

export function ProfilePage() {
  const { user, roles, setUser, setRoles } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(!user);

  // Sync fresh profile + roles on mount
  useEffect(() => {
    if (user) return;
    Promise.all([profileApi.getProfile(), authApi.getMyRoles()])
      .then(([profile, fetchedRoles]) => {
        setUser(profile);
        setRoles(fetchedRoles);
      })
      .catch(() => notifications.show({ message: "Không thể tải thông tin tài khoản.", color: "red" }))
      .finally(() => setIsBootstrapping(false));
  }, []);

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const updated = await profileApi.updateAvatar(file);
      setUser(updated);
      notifications.show({ message: "Cập nhật ảnh đại diện thành công.", color: "green" });
    } catch {
      notifications.show({ message: "Không thể cập nhật ảnh đại diện.", color: "red" });
    } finally {
      setIsUploading(false);
    }
  };

  if (isBootstrapping) {
    return <Center h={400}><Loader color="primary" /></Center>;
  }

  if (!user) return null;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Cover + Avatar + Name */}
        <ProfileCover
          user={user}
          roles={roles}
          isUploading={isUploading}
          onAvatarChange={handleAvatarUpload}
        />

        {/* Info + Password side by side on md+ */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <PersonalInfoCard user={user} onSaved={setUser} />
          <ChangePasswordCard />
        </SimpleGrid>

        {/* 2FA full width */}
        <TwoFACard user={user} onUpdated={setUser} />

        {/* Devices full width */}
        <DevicesCard />
      </Stack>
    </Container>
  );
}
