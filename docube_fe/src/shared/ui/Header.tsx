import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Group,
  Text,
  Button,
  Burger,
  Stack,
  Drawer,
  Flex,
  Avatar,
  Menu,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import {
  IconLogout, IconChevronDown, IconUser, IconUpload,
  IconFiles, IconBookmark, IconReceipt,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "./Header.module.css";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { useAuthStore } from "@/stores";
import { authApi } from "@/shared/services";

interface HeaderProps {
  onBurgerClick?: () => void;
  burgerOpened?: boolean;
  hideDrawer?: boolean;
}

export function Header({ onBurgerClick, burgerOpened, hideDrawer }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setLoginModalOpen, isAuthenticated, user, logout, clientId } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleBurgerClick = () => {
    if (onBurgerClick) onBurgerClick();
    if (!hideDrawer) setIsDrawerOpen((prev) => !prev);
  };

  const isBurgerOpened = burgerOpened ?? isDrawerOpen;

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    setIsDrawerOpen(false);
    try {
      if (clientId) await authApi.logout([clientId]);
    } catch { /* ignore */ }
    logout();
    navigate("/");
  };

  const avatarLabel = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "U";
  const displayName = user ? `${user.lastName ?? ""} ${user.firstName ?? ""}`.trim() : "";

  return (
    <>
      <Box className={classes.header} h={64} style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <Container size="xl" h="100%">
          <Flex h="100%" align="center" justify="space-between">

            {/* Left: Logo + Nav */}
            <Group gap="xl">
              <div className={classes.logo} onClick={() => navigate("/")}>
                <div className={classes.logoIcon}>D</div>
                <Text className={classes.logoText}>Docube</Text>
              </div>

              <Group gap="md" visibleFrom="sm">
                <Text className={classes.navLink} onClick={() => navigate("/university")}>
                  {t("nav.university")}
                </Text>
                <Text className={classes.navLink} onClick={() => navigate("/documents")}>
                  Tài liệu
                </Text>
              </Group>
            </Group>

            {/* Right: Auth + Language */}
            <Group>
              <Group gap="sm" visibleFrom="sm">
                {isAuthenticated ? (
                  <UserMenu
                    avatarLabel={avatarLabel}
                    avatarSrc={user?.avatar}
                    displayName={displayName}
                    email={user?.email ?? ""}
                    onProfile={() => navigate("/private/profile")}
                    onUpload={() => navigate("/private/upload")}
                    onMyDocuments={() => navigate("/private/my-documents")}
                    onBookmarks={() => navigate("/private/bookmarks")}
                    onPurchases={() => navigate("/private/purchases")}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Button className={classes.signInButton} size="sm" onClick={openLoginModal}>
                    {t("nav.signin")}
                  </Button>
                )}
                <LanguageSwitcher />
              </Group>

              {/* Mobile Burger */}
              <Burger
                opened={isBurgerOpened}
                onClick={handleBurgerClick}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>

          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      {!hideDrawer && (
        <Drawer
          opened={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={
            <div className={classes.logo}>
              <div className={classes.logoIcon}>D</div>
              <Text className={classes.logoText}>Docube</Text>
            </div>
          }
          position="right"
          size="280"
          className={classes.drawer}
          overlayProps={{ backgroundOpacity: 0.4, blur: 4 }}
        >
          <Stack gap="xs" mt="md">
            {isAuthenticated && user ? (
              <>
                {/* User profile section */}
                <div className={classes.drawerUserCard}>
                  <Avatar
                    src={user.avatar}
                    size={44}
                    radius="xl"
                    className={classes.drawerUserAvatar}
                  >
                    {avatarLabel}
                  </Avatar>
                  <div className={classes.drawerUserInfo}>
                    <Text className={classes.drawerUserName}>{displayName}</Text>
                    <Text className={classes.drawerUserEmail}>{user.email}</Text>
                  </div>
                </div>
                <Divider my="xs" />
              </>
            ) : null}

            {/* Nav links */}
            <Text className={classes.drawerNavLink} onClick={() => { navigate("/university"); setIsDrawerOpen(false); }}>
              {t("nav.university")}
            </Text>
            <Text className={classes.drawerNavLink} onClick={() => { navigate("/documents"); setIsDrawerOpen(false); }}>
              Tài liệu
            </Text>

            <Divider my="xs" />

            {isAuthenticated ? (
              <>
                {[
                  { icon: <IconUser size={16} />, label: "Trang cá nhân", to: "/private/profile" },
                  { icon: <IconUpload size={16} />, label: "Đăng tài liệu", to: "/private/upload" },
                  { icon: <IconFiles size={16} />, label: "Tài liệu của tôi", to: "/private/my-documents" },
                  { icon: <IconBookmark size={16} />, label: "Đã lưu", to: "/private/bookmarks" },
                  { icon: <IconReceipt size={16} />, label: "Lịch sử mua", to: "/private/purchases" },
                ].map(({ icon, label, to }) => (
                  <Text key={to} className={classes.drawerNavLink} onClick={() => { navigate(to); setIsDrawerOpen(false); }}>
                    <Group gap="xs">{icon}{label}</Group>
                  </Text>
                ))}
                <Text className={classes.drawerLogoutLink} onClick={handleLogout}>
                  <Group gap="xs"><IconLogout size={16} />Đăng xuất</Group>
                </Text>
              </>
            ) : (
              <Button className={classes.drawerSignInButton} fullWidth onClick={openLoginModal}>
                {t("nav.signin")}
              </Button>
            )}
          </Stack>
        </Drawer>
      )}
    </>
  );
}

// ─── User Menu Dropdown ──────────────────────────────────────────────────────

interface UserMenuProps {
  avatarLabel: string;
  avatarSrc?: string;
  displayName: string;
  email: string;
  onProfile: () => void;
  onUpload: () => void;
  onMyDocuments: () => void;
  onBookmarks: () => void;
  onPurchases: () => void;
  onLogout: () => void;
}

function UserMenu({ avatarLabel, avatarSrc, displayName, email, onProfile, onUpload, onMyDocuments, onBookmarks, onPurchases, onLogout }: UserMenuProps) {
  return (
    <Menu
      width={220}
      position="bottom-end"
      offset={8}
      shadow="lg"
      radius="md"
      transitionProps={{ transition: "pop-top-right", duration: 150 }}
    >
      <Menu.Target>
        <UnstyledButton className={classes.userMenuTrigger}>
          <Group gap={8} wrap="nowrap">
            <Avatar src={avatarSrc} size={34} radius="xl" className={classes.userAvatar}>
              {avatarLabel}
            </Avatar>
            <Text className={classes.userDisplayName} visibleFrom="md">
              {displayName || email}
            </Text>
            <IconChevronDown size={14} className={classes.userMenuChevron} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown className={classes.userMenuDropdown}>
        {/* Header info */}
        <div className={classes.menuUserInfo}>
          <Avatar src={avatarSrc} size={40} radius="xl" className={classes.menuUserAvatar}>
            {avatarLabel}
          </Avatar>
          <div>
            <Text className={classes.menuUserName}>{displayName}</Text>
            <Text className={classes.menuUserEmail}>{email}</Text>
          </div>
        </div>

        <Menu.Divider />

        <Menu.Item leftSection={<IconUser size={15} />} onClick={onProfile} className={classes.menuItem}>
          Trang cá nhân
        </Menu.Item>
        <Menu.Item leftSection={<IconUpload size={15} />} onClick={onUpload} className={classes.menuItem}>
          Đăng tài liệu
        </Menu.Item>
        <Menu.Item leftSection={<IconFiles size={15} />} onClick={onMyDocuments} className={classes.menuItem}>
          Tài liệu của tôi
        </Menu.Item>
        <Menu.Item leftSection={<IconBookmark size={15} />} onClick={onBookmarks} className={classes.menuItem}>
          Đã lưu
        </Menu.Item>
        <Menu.Item leftSection={<IconReceipt size={15} />} onClick={onPurchases} className={classes.menuItem}>
          Lịch sử mua
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconLogout size={15} />} onClick={onLogout} className={classes.menuItemLogout} color="red">
          Đăng xuất
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
