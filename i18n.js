import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import sq from './locales/sq.json';
import de from './locales/de.json';

const LANGUAGE_KEY = 'fermaconnect_language';

const getStoredLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang || 'sq'; 
  } catch {
    return 'sq';
  }
};

export const saveLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (err) {
    console.error('Failed to save language:', err);
  }
};

export const initI18n = async () => {
  const savedLanguage = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        sq: { translation: sq },
        de: { translation: de },
      },
      lng:      savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v3',
    });

  return i18n;
};

export default i18n;