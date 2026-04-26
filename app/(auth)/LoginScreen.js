import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { authAPI } from "../../services/api";
import useAuth from "../../hooks/useAuth";

export default function LoginScreen({ navigation, route }) {
  const { t } = useTranslation();
  const role = route.params?.role || "buyer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("common.error"), t("auth.fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      if (user.role !== role) {
        Alert.alert(
          t("auth.wrongAccountType"),
          t("auth.wrongAccountMsg", { role: user.role }),
        );
        setLoading(false);
        return;
      }

      await setAuth(token, user);
    } catch (error) {
      const message = error.response?.data?.message || t("auth.loginFailed");
      Alert.alert(t("auth.loginFailed"), message);
    } finally {
      setLoading(false);
    }
  };

  const isFarmer = role === "farmer";
  const color = isFarmer ? "bg-primary" : "bg-secondary";
  const colorText = isFarmer ? "text-primary" : "text-secondary";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center py-12">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-dark">
              {t("auth.loginTitle")}
            </Text>
            <Text className="text-muted text-base mt-2">
              {t("auth.loginSubtitle", { role: t(`auth.${role}`) })}
            </Text>
          </View>

          <View className="gap-y-4">
            <View>
              <Text className="text-dark font-bold mb-2">
                {t("auth.email")}
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder={t("auth.emailPlaceholder")}
                placeholderTextColor="#6C757D"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                {t("auth.password")}
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder="••••••••"
                placeholderTextColor="#6C757D"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            className={`${color} rounded-xl py-4 items-center mt-8`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                {t("auth.login")}
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted">{t("auth.noAccount")} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register", { role })}
            >
              <Text className={`${colorText} font-bold`}>
                {t("auth.register")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center mt-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-muted">{t("auth.backToHome")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
