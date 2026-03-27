/**
 * i18n Configuration - Cấu hình đa ngôn ngữ
 * Sử dụng react-i18next với 2 ngôn ngữ: vi (Vietnamese) và en (English)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import vi from './locales/vi.json';
import en from './locales/en.json';

// Danh sách ngôn ngữ hỗ trợ
export const SUPPORTED_LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// Lấy ngôn ngữ từ localStorage hoặc mặc định là 'vi'
const getInitialLanguage = (): LanguageCode => {
  const savedLanguage = localStorage.getItem('language') as LanguageCode;
  if (savedLanguage && SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLanguage)) {
    return savedLanguage;
  }
  return 'vi';
};

// Cấu hình i18n
i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false, // React đã tự escape rồi
  },
  // Debug mode - bật trong development
  debug: import.meta.env.DEV,
});

/**
 * Hàm thay đổi ngôn ngữ và lưu vào localStorage
 */
export const changeLanguage = (languageCode: LanguageCode) => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('language', languageCode);
};

export default i18n;
