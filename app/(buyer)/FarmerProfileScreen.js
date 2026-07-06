import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { farmersAPI, reviewsAPI } from "../../services/api";
import { useTranslation } from "react-i18next";
import ProductCard from "../../components/shared/ProductCard";
import StarRating from "../../components/shared/StarRating";

export default function FarmerProfileScreen({ navigation, route }) {
  const { farmerId } = route.params;
  const { t } = useTranslation();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmer();
  }, []);

  const fetchFarmer = async () => {
    try {
      const [profileRes, productsRes, reviewsRes] = await Promise.all([
        farmersAPI.getProfile(farmerId),
        farmersAPI.getProducts(farmerId),
        reviewsAPI.getByFarmer(farmerId),
      ]);
      setFarmer(profileRes.data);
      setProducts(productsRes.data.products);
      setReviewStats(reviewsRes.data.stats);
      setReviews(reviewsRes.data.reviews);
    } catch (error) {
      Alert.alert("Error", "Failed to load farmer profile");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }
  if (!farmer) return null;

  return (
    <View className="flex-1 bg-light">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-primary px-6 pt-14 pb-8">
          <TouchableOpacity
            className="mb-6"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white text-base">← {t("common.back")}</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-x-4">
            <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-white text-3xl font-bold">
                {farmer.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-x-2 flex-wrap">
                <Text className="text-white text-xl font-bold">
                  {farmer.name}
                </Text>
                {farmer.is_verified && (
                  <View className="bg-white/20 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">
                      {`✓ ${t("common.verified")}`}
                    </Text>
                  </View>
                )}
              </View>

              {reviewStats && reviewStats.total > 0 && (
                <View className="flex-row items-center gap-x-2 mt-1">
                  <StarRating
                    rating={Math.round(reviewStats.average)}
                    readonly
                    size={16}
                  />
                  <Text className="text-white/90 text-sm">
                    {reviewStats.average} (
                    {t("farmer.reviewCount", { count: reviewStats.total })})
                  </Text>
                </View>
              )}

              {farmer.municipality && (
                <Text className="text-white/80 text-sm mt-1">
                  📍 {farmer.municipality}
                </Text>
              )}
              <Text className="text-white/60 text-xs mt-1">
                {t("farmer.memberSince", {
                  year: new Date(farmer.created_at).getFullYear(),
                })}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row bg-white border-b border-gray-100">
          <View className="flex-1 items-center py-4 border-r border-gray-100">
            <Text className="text-primary font-bold text-xl">
              {farmer.stats.total_products}
            </Text>
            <Text className="text-muted text-xs mt-1">
              {t("farmer.totalProducts")}
            </Text>
          </View>
          <View className="flex-1 items-center py-4 border-r border-gray-100">
            <Text className="text-secondary font-bold text-xl">
              {farmer.stats.available_products}
            </Text>
            <Text className="text-muted text-xs mt-1">
              {t("farmer.availableNow")}
            </Text>
          </View>
          <View className="flex-1 items-center py-4">
            <Text className="text-accent font-bold text-xl">
              {farmer.stats.min_price
                ? `€${parseFloat(farmer.stats.min_price).toFixed(2)}`
                : "—"}
            </Text>
            <Text className="text-muted text-xs mt-1">
              {t("farmer.startingFrom")}
            </Text>
          </View>
        </View>

        <View className="px-6 pt-6 pb-2">
          <Text className="text-dark font-bold text-lg mb-4">
            {`${t("farmer.products")} (${products.length})`}
          </Text>
          {products.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-4xl mb-3">🌱</Text>
              <Text className="text-muted text-base text-center">
                {t("farmer.noProducts")}
              </Text>
            </View>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, farmer: { name: farmer.name } }}
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    productId: product.id,
                  })
                }
              />
            ))
          )}
        </View>

        {reviews.length > 0 && (
          <View className="px-6 pb-10">
            <Text className="text-dark font-bold text-lg mb-4">
              {`${t("farmer.reviews")} (${reviewStats.total})`}
            </Text>
            {reviews.map((review) => (
              <View key={review.id} className="bg-white rounded-2xl p-4 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-dark font-bold text-sm">
                    {review.buyer.name}
                  </Text>
                  <Text className="text-muted text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <StarRating rating={review.rating} readonly size={16} />
                {review.comment && (
                  <Text className="text-dark text-sm mt-2">
                    {review.comment}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
