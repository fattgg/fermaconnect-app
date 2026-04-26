import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Switch,
} from "react-native";
import { productsAPI, farmersAPI } from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

function ListingCard({ product, onEdit, onDelete, onToggle }) {
  const { t } = useTranslation();
  const hasPhoto = product.photo_urls && product.photo_urls.length > 0;

  return (
    <View
      className="bg-white rounded-2xl mb-4 overflow-hidden"
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
            className="w-28 h-28"
            resizeMode="cover"
          />
        ) : (
          <View className="w-28 h-28 bg-gray-100 items-center justify-center">
            <Text className="text-4xl">🌿</Text>
          </View>
        )}

        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-dark font-bold text-base" numberOfLines={1}>
              {product.name}
            </Text>
            <Text className="text-muted text-xs capitalize mt-1">
              {t(`categories.${product.category}`)}
            </Text>
            <Text className="text-primary font-bold text-base mt-1">
              €{parseFloat(product.price).toFixed(2)} / {product.unit}
            </Text>
            <Text className="text-muted text-xs mt-1">
              {t("listings.stock", {
                quantity: product.quantity,
                unit: product.unit,
              })}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-muted text-xs">
              {product.available ? t("common.available") : t("listings.hidden")}
            </Text>
            <Switch
              value={product.available}
              onValueChange={() => onToggle(product)}
              trackColor={{ false: "#E9ECEF", true: "#52B788" }}
              thumbColor={product.available ? "#2D6A4F" : "#ADB5BD"}
            />
          </View>
        </View>
      </View>

      <View className="flex-row border-t border-gray-100">
        <TouchableOpacity
          className="flex-1 py-3 items-center"
          onPress={() => onEdit(product)}
        >
          <Text className="text-primary font-bold text-sm">
            ✏️ {t("common.edit")}
          </Text>
        </TouchableOpacity>
        <View className="w-px bg-gray-100" />
        <TouchableOpacity
          className="flex-1 py-3 items-center"
          onPress={() => onDelete(product)}
        >
          <Text className="text-red-500 font-bold text-sm">
            🗑️ {t("common.delete")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyListingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchProducts);
    return unsubscribe;
  }, [navigation]);

  const fetchProducts = async () => {
    try {
      const response = await farmersAPI.getProducts(user?.id);
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggle = async (product) => {
    try {
      await productsAPI.toggleAvailability(product.id);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, available: !p.available } : p,
        ),
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update availability");
    }
  };

  const handleDelete = (product) => {
    Alert.alert(
      t("common.delete"),
      `${t("common.confirm")} "${product.name}"?`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await productsAPI.remove(product.id);
              setProducts((prev) => prev.filter((p) => p.id !== product.id));
            } catch (error) {
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ],
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-dark">
            {t("listings.title")}
          </Text>
          <Text className="text-muted text-sm mt-1">
            {t("listings.subtitle", { count: products.length })}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-xl px-4 py-2"
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Text className="text-white font-bold">{t("listings.add")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            product={item}
            onEdit={(p) => navigation.navigate("EditProduct", { product: p })}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2D6A4F"
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-5xl mb-4">🌱</Text>
            <Text className="text-dark font-bold text-lg mb-2">
              {t("listings.noListings")}
            </Text>
            <Text className="text-muted text-sm text-center mb-6">
              {t("listings.noListingsDesc")}
            </Text>
            <TouchableOpacity
              className="bg-primary rounded-xl px-6 py-3"
              onPress={() => navigation.navigate("AddProduct")}
            >
              <Text className="text-white font-bold">
                {t("listings.addFirst")}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
