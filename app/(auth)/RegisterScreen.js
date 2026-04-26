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
import { MUNICIPALITIES } from "../../constants";

export default function RegisterScreen({ navigation, route }) {
  const { t } = useTranslation();
  const role = route.params?.role || "buyer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [showMunic, setShowMunic] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth();

  const isFarmer = role === "farmer";
  const color = isFarmer ? "bg-primary" : "bg-secondary";
  const colorBorder = isFarmer ? "border-primary" : "border-secondary";
  const colorText = isFarmer ? "text-primary" : "text-secondary";

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert(t("common.error"), t("auth.nameRequired"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("common.error"), t("auth.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        role,
        phone: phone || undefined,
        municipality: municipality || undefined,
      });
      const { token, user } = response.data;
      await setAuth(token, user);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        t("auth.registerFailed");
      Alert.alert(t("auth.registerFailed"), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-12">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-dark">
              {t("auth.registerTitle")}
            </Text>
            <Text className="text-muted text-base mt-2">
              {t("auth.registerSubtitle", { role: t(`auth.${role}`) })}
            </Text>
          </View>

          <View className="gap-y-4">
            <View>
              <Text className="text-dark font-bold mb-2">
                {t("auth.fullName")} <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder={t("auth.namePlaceholder")}
                placeholderTextColor="#6C757D"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                {t("auth.email")} <Text className="text-red-500">*</Text>
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
                {t("auth.password")} <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder={t("auth.passwordMin")}
                placeholderTextColor="#6C757D"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                {t("auth.phone")}
                <Text className="text-muted font-normal">
                  {" "}
                  ({t("common.optional")})
                </Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder={t("auth.phonePlaceholder")}
                placeholderTextColor="#6C757D"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                {t("auth.municipality")}
                <Text className="text-muted font-normal">
                  {" "}
                  ({t("common.optional")})
                </Text>
              </Text>
              <TouchableOpacity
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                onPress={() => setShowMunic(!showMunic)}
              >
                <Text
                  className={
                    municipality
                      ? "text-dark text-base"
                      : "text-muted text-base"
                  }
                >
                  {municipality || t("auth.selectMunicipality")}
                </Text>
                <Text className="text-muted">{showMunic ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {showMunic && (
                <View className="bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-hidden">
                  <ScrollView nestedScrollEnabled>
                    {MUNICIPALITIES.map((m) => (
                      <TouchableOpacity
                        key={m}
                        className={`px-4 py-3 border-b border-gray-100 ${
                          municipality === m ? colorBorder : ""
                        }`}
                        onPress={() => {
                          setMunicipality(m);
                          setShowMunic(false);
                        }}
                      >
                        <Text
                          className={
                            municipality === m
                              ? `${colorText} font-bold`
                              : "text-dark"
                          }
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            className={`${color} rounded-xl py-4 items-center mt-8`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                {t("auth.register")}
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted">{t("auth.hasAccount")} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login", { role })}
            >
              <Text className={`${colorText} font-bold`}>
                {t("auth.login")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center mt-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-muted">{t("common.back")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
