import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { ordersAPI } from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function OrderRequestScreen({ navigation, route }) {
  const { product } = route.params;
  const { user } = useAuth();
  const { t } = useTranslation();

  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [contactInfo, setContactInfo] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  const hasPhoto = product.photo_urls && product.photo_urls.length > 0;
  const total = (parseFloat(product.price) * parseInt(quantity || 0)).toFixed(
    2,
  );

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) < 1) {
      Alert.alert(t("common.error"), t("order.quantityMin"));
      return;
    }
    if (parseInt(quantity) > product.quantity) {
      Alert.alert(
        t("common.error"),
        t("order.quantityMax", {
          quantity: product.quantity,
          unit: product.unit,
        }),
      );
      return;
    }
    if (!contactInfo) {
      Alert.alert(t("common.error"), t("order.contactRequired"));
      return;
    }

    setLoading(true);
    try {
      await ordersAPI.create({
        product_id: product.id,
        quantity: parseInt(quantity),
        contact_info: contactInfo,
        note: note || undefined,
      });

      Alert.alert(t("order.orderSent"), t("order.orderSentDesc"), [
        {
          text: t("common.ok"),
          onPress: () =>
            navigation.navigate("BuyerTabs", { screen: "MyOrders" }),
        },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        t("order.orderFailed");
      Alert.alert(t("common.error"), message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-light">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 flex-row items-center gap-x-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-secondary text-base font-bold">
            ← {t("common.back")}
          </Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-dark">
          {t("order.requestTitle")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Product summary card */}
        <View
          className="bg-white rounded-2xl overflow-hidden mb-6"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row">
            {hasPhoto ? (
              <Image
                source={{ uri: product.photo_urls[0] }}
                className="w-24 h-24"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 bg-gray-100 items-center justify-center">
                <Text className="text-4xl">🌿</Text>
              </View>
            )}
            <View className="flex-1 p-3 justify-center">
              <Text className="text-dark font-bold text-base" numberOfLines={1}>
                {product.name}
              </Text>
              <Text className="text-muted text-sm capitalize mt-1">
                {t(`categories.${product.category}`)}
              </Text>
              <Text className="text-secondary font-bold text-base mt-1">
                €{parseFloat(product.price).toFixed(2)} /{" "}
                {t(`units.${product.unit}`)}
              </Text>
              <Text className="text-muted text-xs mt-1">
                {t("product.availableStock", {
                  quantity: product.quantity,
                  unit: t(`units.${product.unit}`),
                })}
              </Text>
            </View>
          </View>

          {/* Farmer info */}
          <View className="px-4 py-3 border-t border-gray-100 flex-row items-center gap-x-2">
            <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {product.farmer?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-muted text-sm">{product.farmer?.name}</Text>
            {product.farmer?.municipality && (
              <Text className="text-muted text-sm">
                · 📍 {product.farmer.municipality}
              </Text>
            )}
          </View>
        </View>

        {/* Quantity */}
        <View className="mb-4">
          <Text className="text-dark font-bold mb-2">
            {t("order.quantity", { unit: t(`units.${product.unit}`) })}{" "}
            <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row items-center gap-x-3">
            <TouchableOpacity
              className="w-12 h-12 bg-white border border-gray-200 rounded-xl items-center justify-center"
              onPress={() =>
                setQuantity((prev) =>
                  String(Math.max(1, parseInt(prev || 1) - 1)),
                )
              }
            >
              <Text className="text-dark text-xl font-bold">−</Text>
            </TouchableOpacity>
            <TextInput
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base text-center"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TouchableOpacity
              className="w-12 h-12 bg-white border border-gray-200 rounded-xl items-center justify-center"
              onPress={() =>
                setQuantity((prev) =>
                  String(Math.min(product.quantity, parseInt(prev || 0) + 1)),
                )
              }
            >
              <Text className="text-dark text-xl font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estimated total */}
        <View className="bg-secondary/10 rounded-xl px-4 py-3 mb-4 flex-row justify-between items-center">
          <Text className="text-muted text-sm">
            {t("order.estimatedTotal")}
          </Text>
          <Text className="text-secondary font-bold text-lg">€{total}</Text>
        </View>

        {/* Contact info */}
        <View className="mb-4">
          <Text className="text-dark font-bold mb-2">
            {t("order.contactInfo")} <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
            placeholder={t("order.contactPlaceholder")}
            placeholderTextColor="#6C757D"
            keyboardType="phone-pad"
            value={contactInfo}
            onChangeText={setContactInfo}
          />
          <Text className="text-muted text-xs mt-2">
            {t("order.contactHint")}
          </Text>
        </View>

        {/* Note */}
        <View className="mb-8">
          <Text className="text-dark font-bold mb-2">
            {t("order.noteToFarmer")}
            <Text className="text-muted font-normal">
              {" "}
              ({t("common.optional")})
            </Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
            placeholder={t("order.notePlaceholder")}
            placeholderTextColor="#6C757D"
            multiline
            numberOfLines={3}
            style={{ textAlignVertical: "top", minHeight: 80 }}
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          className="bg-secondary rounded-xl py-4 items-center"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              {t("order.sendRequest")}
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-muted text-xs text-center mt-4">
          {t("order.noPaymentNote")}
        </Text>
      </ScrollView>
    </View>
  );
}
