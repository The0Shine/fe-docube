import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Header } from "@/shared/ui";
import { LoginModal } from "@/features/auth";
import { useAuthStore } from "@/stores";

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell header={{ height: 60 }} padding="md">
      {/* Header */}
      <AppShell.Header>
        <Header onBurgerClick={toggle} burgerOpened={opened} hideDrawer />
      </AppShell.Header>

      {/* Main content */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      {/* Global Login Modal */}
      <LoginModal 
        opened={useAuthStore(state => state.isLoginModalOpen)} 
        onClose={() => useAuthStore.getState().setLoginModalOpen(false)} 
      />
    </AppShell>
  );
}
