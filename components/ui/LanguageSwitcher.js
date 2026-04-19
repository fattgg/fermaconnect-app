import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import useLanguageStore from '../../store/languageStore';

export default function LanguageSwitcher() {
  const { t }                              = useTranslation();
  const { currentLanguage, languages, setLanguage } = useLanguageStore();

  return (
    <View>
      <Text className="text-dark font-bold text-base mb-3">
        {t('settings.language')}
      </Text>
      <View className="flex-row gap-x-3">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              className={`flex-1 py-3 rounded-xl items-center border ${
                isActive
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-200'
              }`}
              onPress={() => setLanguage(lang.code)}
            >
              <Text className={`font-bold text-sm ${
                isActive ? 'text-white' : 'text-dark'
              }`}>
                {lang.label}
              </Text>
              <Text className={`text-xs mt-1 ${
                isActive ? 'text-white/70' : 'text-muted'
              }`}>
                {lang.nativeLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}