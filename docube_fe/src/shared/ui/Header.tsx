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
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./Header.module.css";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { useAuthStore } from "@/stores";

interface HeaderProps {
  onBurgerClick?: () => void;
  burgerOpened?: boolean;
  hideDrawer?: boolean;
}

export function Header({ onBurgerClick, burgerOpened, hideDrawer }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setLoginModalOpen } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleBurgerClick = () => {
    if (onBurgerClick) {
      onBurgerClick();
    }

    if (!hideDrawer) {
      setIsDrawerOpen((prev) => !prev);
    }
  };

  const isBurgerOpened = burgerOpened ?? isDrawerOpen;

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setIsDrawerOpen(false); // Close drawer if open
  };

  return (
    <>
      <Box
        className={classes.header}
        h={64}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
        }}
      >
        <Container size="xl" h="100%">
          <Flex h="100%" align="center" justify="space-between">
            <Group gap="xl">
                {/* Logo */}
                <div className={classes.logo} onClick={() => navigate("/")}>
                <div className={classes.logoIcon}>D</div>
                <Text className={classes.logoText}>Docube</Text>
                </div>

                {/* Navigation Links */}
                <Group gap="md" visibleFrom="sm">
                <Text className={classes.navLink} onClick={() => navigate("/university")}>
                    {t("nav.university")}
                </Text>
                <Text className={classes.navLink}>
                    Tài liệu
                </Text>
                </Group>
            </Group>

            <Group>
                {/* Sign In Button */}
                <Group gap="sm" visibleFrom="sm">
                <Button
                    className={classes.signInButton}
                    size="sm"
                    onClick={openLoginModal}
                >
                    {t("nav.signin")}
                </Button>
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
          <Stack gap="xs" mt="lg">
            <Text className={classes.drawerNavLink}>
              {t("nav.university")}
            </Text>
            <Text className={classes.drawerNavLink}>
              Tài liệu
            </Text>
            <Button
              className={classes.drawerSignInButton}
              fullWidth
              onClick={openLoginModal}
            >
              {t("nav.signin")}
            </Button>
          </Stack>
        </Drawer>
      )}

      {/* LoginModal đã được quản lý tập trung ở AppLevel hoặc AuthGuard */}
    </>
  );
}
