import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

export default function ProductCard({ product, onPress }) {
  const { t } = useTranslation();

  const hasPhoto = product.photo_urls && product.photo_urls.length > 0;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {hasPhoto ? (
        <Image
          source={{ uri: product.photo_urls[0] }}
          className="w-full h-44"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-44 bg-gray-100 items-center justify-center">
          <Text className="text-5xl">🌿</Text>
        </View>
      )}

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-dark font-bold text-base flex-1 mr-2">
            {product.name}
          </Text>
          {!product.available && (
            <View className="bg-red-100 px-2 py-1 rounded-full">
              <Text className="text-red-500 text-xs font-bold">
                {t("common.unavailable")}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-muted text-sm capitalize mb-3">
          {t(`categories.${product.category}`)}
        </Text>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-baseline gap-x-1">
            <Text className="text-primary font-bold text-lg">
              €{parseFloat(product.price).toFixed(2)}
            </Text>
            <Text className="text-muted text-sm">/ {product.unit}</Text>
          </View>

          {product.farmer && (
            <View className="flex-row items-center gap-x-1">
              <View className="w-6 h-6 rounded-full bg-primary/20 items-center justify-center">
                <Text className="text-primary text-xs font-bold">
                  {product.farmer.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-muted text-sm">{product.farmer.name}</Text>
            </View>
          )}
        </View>

        <View className="mt-2">
          <Text className="text-muted text-xs">
            {t("product.availableStock", {
              quantity: product.quantity,
              unit: product.unit,
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
