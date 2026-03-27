/**
 * ThemeSwitcher - Component chuyển đổi Light/Dark theme
 * Sử dụng ActionIcon với tooltip
 */
import { ActionIcon, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/stores';

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const toggleColorScheme = useThemeStore((state) => state.toggleColorScheme);

  const isDark = colorScheme === 'dark';

  return (
    <Tooltip label={t('theme.switchTheme')} position="left">
      <ActionIcon
        variant="default"
        size="lg"
        onClick={toggleColorScheme}
        aria-label={t('theme.switchTheme')}
      >
        {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}
