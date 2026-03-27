/**
 * Theme Store - Quản lý theme của ứng dụng
 * Hỗ trợ Light/Dark mode và custom primary color
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MantineColorScheme } from '@mantine/core';

// Danh sách màu chính có sẵn (theo design system)
export const PRIMARY_COLORS = [
  'primary',   // 🔴 Đỏ Ruby - Brand color
  'secondary', // ⚫ Slate Gray - Neutral
  'success',   // 🟢 Emerald Green
  'warning',   // 🟡 Amber Orange
  'danger',    // 🔴 Coral Red - Error
  'info',      // 🔵 Ocean Blue
  'accent',    // 🟣 Royal Purple
] as const;

export type PrimaryColor = (typeof PRIMARY_COLORS)[number];

interface ThemeState {
  // State
  colorScheme: MantineColorScheme;
  primaryColor: PrimaryColor;

  // Actions
  setColorScheme: (colorScheme: MantineColorScheme) => void;
  toggleColorScheme: () => void;
  setPrimaryColor: (color: PrimaryColor) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state - mặc định light mode với màu primary (đỏ)
      colorScheme: 'light',
      primaryColor: 'primary',

      // Actions
      setColorScheme: (colorScheme) => set({ colorScheme }),

      toggleColorScheme: () => {
        const current = get().colorScheme;
        // Xử lý cả trường hợp 'auto'
        const next = current === 'dark' ? 'light' : 'dark';
        set({ colorScheme: next });
      },

      setPrimaryColor: (primaryColor) => set({ primaryColor }),
    }),
    {
      name: 'theme-storage', // Key trong localStorage
    }
  )
);
