import { create } from 'zustand';
import i18n from '../i18n';
import { saveLanguage } from '../i18n';

const LANGUAGES = [
  { code: 'sq', label: 'Shqip',   nativeLabel: 'Albanian' },
  { code: 'en', label: 'English', nativeLabel: 'English'  },
  { code: 'de', label: 'Deutsch', nativeLabel: 'German'   },
];

const useLanguageStore = create((set) => ({
  currentLanguage: i18n.language || 'sq',
  languages:       LANGUAGES,

  setLanguage: async (langCode) => {
    await i18n.changeLanguage(langCode);
    await saveLanguage(langCode);
    set({ currentLanguage: langCode });
  },
}));

export default useLanguageStore;