import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { productsAPI } from "../../services/api";
import { CATEGORIES } from "../../constants";
import ProductCard from "../../components/shared/ProductCard";
import { useTranslation } from "react-i18next";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async (
      pageNum = 1,
      searchVal = search,
      categoryVal = category,
      append = false,
    ) => {
      try {
        const response = await productsAPI.getAll({
          page: pageNum,
          limit: 10,
          search: searchVal || undefined,
          category: categoryVal || undefined,
        });

        const { products: newProducts, meta } = response.data;

        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts,
        );
        setHasNext(meta.has_next);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError(t("home.connectionErrorDesc"));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [search, category],
  );

  useEffect(() => {
    setLoading(true);
    fetchProducts(1, search, category, false);
  }, [search, category]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, search, category, false);
  };

  const handleLoadMore = () => {
    if (!hasNext || loadingMore) return;
    setLoadingMore(true);
    fetchProducts(page + 1, search, category, true);
  };

  const handleCategoryPress = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark mb-1">
          {t("home.title")}
        </Text>
        <Text className="text-muted text-sm mb-4">{t("home.subtitle")}</Text>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Text className="text-muted mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-dark text-base"
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor="#6C757D"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text className="text-muted text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              className={`px-4 py-2 rounded-full border ${
                category === cat.value
                  ? "bg-secondary border-secondary"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => handleCategoryPress(cat.value)}
            >
              <Text
                className={`text-sm font-bold ${
                  category === cat.value ? "text-white" : "text-muted"
                }`}
              >
                {t(`categories.${cat.label}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#52B788" />
          <Text className="text-muted text-sm mt-4">
            {t("home.loadingProducts")}
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-5xl mb-4">🌿</Text>
          <Text className="text-dark font-bold text-lg mb-2 text-center">
            {t("home.connectionError")}
          </Text>
          <Text className="text-muted text-sm text-center mb-6">{error}</Text>
          <TouchableOpacity
            className="bg-secondary rounded-xl px-6 py-3"
            onPress={() => {
              setError(null);
              setLoading(true);
              fetchProducts(1, search, category, false);
            }}
          >
            <Text className="text-white font-bold">{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: item.id })
              }
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#52B788"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#52B788"
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-5xl mb-4">🌿</Text>
              <Text className="text-dark font-bold text-lg mb-2">
                {t("home.noProducts")}
              </Text>
              <Text className="text-muted text-sm text-center">
                {t("home.noProductsDesc")}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
