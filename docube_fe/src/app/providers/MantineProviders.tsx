/**
 * MantineProviders - Wrapper cho tất cả Mantine providers
 * Bao gồm: ModalsProvider, Notifications, NProgress, Spotlight
 */
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';

// Import styles cho các packages
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/tiptap/styles.css';

interface MantineProvidersProps {
  children: React.ReactNode;
}

/**
 * MantineProviders bọc tất cả providers cần thiết của Mantine
 * Phải được đặt BÊN TRONG MantineProvider (ThemeProvider)
 */
export function MantineProviders({ children }: MantineProvidersProps) {
  return (
    <ModalsProvider>
      {/* Navigation Progress Bar - hiển thị khi chuyển trang */}
      <NavigationProgress />
      
      {/* Notifications - Toast notifications */}
      <Notifications position="top-right" zIndex={1000} />
      
      {/* Children - App content */}
      {children}
    </ModalsProvider>
  );
}
