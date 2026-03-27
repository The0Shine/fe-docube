/**
 * Mantine Theme Provider - Custom Mantine configuration
 * Professional Design System với màu chính là Đỏ
 * Hỗ trợ Light/Dark mode với bộ màu phụ trợ hoàn chỉnh
 */
import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
} from '@mantine/core';
import { useThemeStore } from '@/stores';

// Import Mantine styles
import '@mantine/core/styles.css';
// Import Design System CSS variables
import '@/styles/design-system.css';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/* ============================================
   🎨 COLOR PALETTE - PROFESSIONAL DESIGN SYSTEM
   ============================================ */

/**
 * PRIMARY - Đỏ Ruby (Brand Color)
 * Màu chính đại diện cho thương hiệu
 * Dùng cho: CTA buttons, links, highlights, brand elements
 */
const primary: MantineColorsTuple = [
  '#fff5f5',   // 0 - lightest (backgrounds)
  '#ffe3e3',   // 1 - hover backgrounds
  '#ffc9c9',   // 2 - borders light
  '#ffa8a8',   // 3 - disabled states
  '#ff8787',   // 4 - hover states
  '#dc3545',   // 5 - PRIMARY (main brand color)
  '#c92a2a',   // 6 - hover/active
  '#a51d1d',   // 7 - pressed states
  '#8b1515',   // 8 - dark variant
  '#6d1010',   // 9 - darkest
];

/**
 * SECONDARY - Slate Gray (Neutral)
 * Màu phụ trung tính
 * Dùng cho: Secondary buttons, text, borders, backgrounds
 */
const secondary: MantineColorsTuple = [
  '#f8f9fa',   // 0 - page backgrounds
  '#f1f3f5',   // 1 - card backgrounds
  '#e9ecef',   // 2 - borders, dividers
  '#dee2e6',   // 3 - disabled backgrounds
  '#ced4da',   // 4 - placeholder text
  '#6c757d',   // 5 - SECONDARY (main)
  '#5a6268',   // 6 - secondary text
  '#495057',   // 7 - body text
  '#343a40',   // 8 - headings
  '#212529',   // 9 - darkest text
];

/**
 * SUCCESS - Emerald Green
 * Màu thành công
 * Dùng cho: Success messages, confirmations, positive actions
 */
const success: MantineColorsTuple = [
  '#ebfbee',   // 0
  '#d3f9d8',   // 1
  '#b2f2bb',   // 2
  '#8ce99a',   // 3
  '#69db7c',   // 4
  '#28a745',   // 5 - SUCCESS (main)
  '#218838',   // 6
  '#1e7e34',   // 7
  '#1a6d2d',   // 8
  '#155724',   // 9
];

/**
 * WARNING - Amber Orange
 * Màu cảnh báo
 * Dùng cho: Warnings, cautions, pending states
 */
const warning: MantineColorsTuple = [
  '#fff9e6',   // 0
  '#fff3cd',   // 1
  '#ffe69c',   // 2
  '#ffd96a',   // 3
  '#ffcd39',   // 4
  '#ffc107',   // 5 - WARNING (main)
  '#e0a800',   // 6
  '#c69500',   // 7
  '#a07800',   // 8
  '#856404',   // 9
];

/**
 * ERROR/DANGER - Coral Red
 * Màu lỗi/nguy hiểm (khác với primary để phân biệt)
 * Dùng cho: Error messages, destructive actions, alerts
 */
const danger: MantineColorsTuple = [
  '#fff5f5',   // 0
  '#ffe0e0',   // 1
  '#ffc7c7',   // 2
  '#ffa3a3',   // 3
  '#ff7b7b',   // 4
  '#f03e3e',   // 5 - DANGER (main) - brighter than primary
  '#e03131',   // 6
  '#c92a2a',   // 7
  '#b02525',   // 8
  '#922020',   // 9
];

/**
 * INFO - Ocean Blue
 * Màu thông tin
 * Dùng cho: Info messages, tips, neutral notifications
 */
const info: MantineColorsTuple = [
  '#e7f5ff',   // 0
  '#d0ebff',   // 1
  '#a5d8ff',   // 2
  '#74c0fc',   // 3
  '#4dabf7',   // 4
  '#17a2b8',   // 5 - INFO (main)
  '#1590a8',   // 6
  '#127d91',   // 7
  '#0f6a7a',   // 8
  '#0c5460',   // 9
];

/**
 * ACCENT - Royal Purple
 * Màu nhấn/điểm nhấn
 * Dùng cho: Highlights, badges, special elements
 */
const accent: MantineColorsTuple = [
  '#f8f0fc',   // 0
  '#f3d9fa',   // 1
  '#eebefa',   // 2
  '#e599f7',   // 3
  '#da77f2',   // 4
  '#9c36b5',   // 5 - ACCENT (main)
  '#862e9c',   // 6
  '#702682',   // 7
  '#5a1f69',   // 8
  '#44174f',   // 9
];

/**
 * SURFACE - Background colors
 * Màu nền cho light/dark mode
 */
const surface: MantineColorsTuple = [
  '#ffffff',   // 0 - white (light mode bg)
  '#f8f9fa',   // 1 - light gray bg
  '#f1f3f5',   // 2 - card bg light
  '#e9ecef',   // 3 - hover bg light
  '#dee2e6',   // 4 - border light
  '#25262b',   // 5 - dark mode bg
  '#1a1b1e',   // 6 - darker bg
  '#141517',   // 7 - card bg dark
  '#101113',   // 8 - darkest bg
  '#0a0a0b',   // 9 - pure dark
];

/* ============================================
   🎨 THEME CONFIGURATION
   ============================================ */

const createAppTheme = (primaryColor: string) =>
  createTheme({
    // Primary color
    primaryColor,
    primaryShade: { light: 5, dark: 4 },

    // Custom color palette
    colors: {
      primary,
      secondary,
      success,
      warning,
      danger,
      info,
      accent,
      surface,
      // Aliases cho Mantine built-in
      red: danger,
      green: success,
      yellow: warning,
      blue: info,
      grape: accent,
      gray: secondary,
    },

    // Virtual colors - tự động switch theo theme
    // Sử dụng: color="primaryColors" -> tự lấy đúng shade theo light/dark
    
    // Typography
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyMonospace: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
    headings: {
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '600',
    },

    // Spacing & Radius
    defaultRadius: 'md',
    radius: {
      xs: '0.25rem',
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },

    // Shadows
    shadows: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    },

    // Breakpoints (Tailwind-like)
    breakpoints: {
      xs: '30em',   // 480px
      sm: '40em',   // 640px
      md: '48em',   // 768px
      lg: '64em',   // 1024px
      xl: '80em',   // 1280px
    },

    // Other theme tokens
    cursorType: 'pointer',
    focusRing: 'auto',
    
    // Component defaults
    components: {
      Button: {
        defaultProps: {
          radius: 'md',
        },
        styles: {
          root: {
            fontWeight: 500,
          },
        },
      },
      TextInput: {
        defaultProps: {
          radius: 'md',
        },
      },
      PasswordInput: {
        defaultProps: {
          radius: 'md',
        },
      },
      Select: {
        defaultProps: {
          radius: 'md',
        },
      },
      Card: {
        defaultProps: {
          radius: 'md',
          withBorder: true,
        },
      },
      Paper: {
        defaultProps: {
          radius: 'md',
        },
      },
      Badge: {
        defaultProps: {
          radius: 'sm',
        },
      },
      Alert: {
        defaultProps: {
          radius: 'md',
        },
      },
      Notification: {
        defaultProps: {
          radius: 'md',
        },
      },
      Modal: {
        defaultProps: {
          radius: 'lg',
        },
      },
      Tooltip: {
        defaultProps: {
          radius: 'sm',
        },
      },
      ActionIcon: {
        defaultProps: {
          radius: 'md',
        },
      },
      NavLink: {
        defaultProps: {
          radius: 'md',
        },
      },
    },
  });

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Lấy theme settings từ Zustand store
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const primaryColor = useThemeStore((state) => state.primaryColor);

  // Tạo theme với primary color hiện tại
  const theme = createAppTheme(primaryColor);

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="light"
      forceColorScheme={colorScheme === 'auto' ? undefined : colorScheme}
    >
      {children}
    </MantineProvider>
  );
}
