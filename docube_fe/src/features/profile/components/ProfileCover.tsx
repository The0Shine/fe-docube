import { Avatar, Badge, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import type { Role, UserSummary } from "@/shared/types";
import classes from "../ProfilePage.module.css";

interface ProfileCoverProps {
  user: UserSummary;
  roles: Role[];
  isUploading: boolean;
  onAvatarChange: (file: File) => void;
}

export function ProfileCover({ user, roles, isUploading, onAvatarChange }: ProfileCoverProps) {
  const avatarLabel = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const displayName = `${user.lastName ?? ""} ${user.firstName ?? ""}`.trim();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarChange(file);
    e.target.value = "";
  };

  return (
    <div>
      {/* Banner */}
      <div className={classes.coverBanner} />

      {/* Avatar + Meta */}
      <div className={classes.avatarSection}>
        <div className={classes.avatarWrapper}>
          <Avatar
            src={user.avatar || null}
            size={100}
            radius="50%"
            className={classes.avatarRing}
          >
            {avatarLabel}
          </Avatar>

          <Tooltip label="Đổi ảnh đại diện" withArrow>
            <label className={classes.avatarUploadBtn} style={{ opacity: isUploading ? 0.6 : 1 }}>
              <IconCamera size={14} color="white" />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </Tooltip>
        </div>

        <Stack gap={4} className={classes.profileMeta}>
          <Text className={classes.profileName}>{displayName || user.email}</Text>
          <Text className={classes.profileEmail}>{user.email}</Text>
          {roles.length > 0 && (
            <Group gap={6} mt={2}>
              {roles.map((role) => (
                <Badge key={role.id} color="primary" variant="light" size="sm">
                  {role.name}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
      </div>
    </div>
  );
}
