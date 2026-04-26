import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import useAuth from "../../hooks/useAuth";

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark">
          {t("settings.title")}
        </Text>
        <Text className="text-muted text-sm mt-1">{user?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }}
        >
          <LanguageSwitcher />
        </View>

        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }}
        >
          <Text className="text-dark font-bold text-base mb-3">
            {t("common.account")}
          </Text>
          <View className="gap-y-2">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-muted">{t("common.name")}</Text>
              <Text className="text-dark font-bold">{user?.name}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-muted">{t("common.email")}</Text>
              <Text className="text-dark">{user?.email}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-muted">{t("common.role")}</Text>
              <Text className="text-dark capitalize">
                {t(`auth.${user?.role}`)}
              </Text>
            </View>
            {user?.municipality && (
              <View className="flex-row justify-between py-2">
                <Text className="text-muted">{t("common.municipality")}</Text>
                <Text className="text-dark">{user?.municipality}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="border border-red-200 rounded-2xl py-4 items-center"
          onPress={logout}
        >
          <Text className="text-red-500 font-bold">{t("common.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
