/**
 * LanguageSwitcher - Component chuyển đổi ngôn ngữ
 * Dropdown menu với các ngôn ngữ được hỗ trợ
 */
import { Menu, Text, UnstyledButton } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, changeLanguage, type LanguageCode } from '@/shared/i18n';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as LanguageCode;

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <UnstyledButton style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 4 }}>
            <span style={{ fontSize: 20 }}>
                {SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage)?.flag}
            </span>
            <IconChevronDown size={16} color="gray" />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('language.title')}</Menu.Label>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Menu.Item
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            rightSection={
              currentLanguage === lang.code ? <IconCheck size={14} /> : null
            }
          >
            <Text>
              {lang.flag} {lang.name}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
