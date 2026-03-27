/**
 * App.tsx - Root component của ứng dụng
 * Kết hợp tất cả providers: Theme, Mantine extras, Router, i18n
 */
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, MantineProviders } from '@/app/providers';
import { router } from '@/app/router';

// Import i18n configuration (phải import trước khi render)
import '@/shared/i18n';

export default function App() {
  return (
    <ThemeProvider>
      <MantineProviders>
        <RouterProvider router={router} />
      </MantineProviders>
    </ThemeProvider>
  );
}