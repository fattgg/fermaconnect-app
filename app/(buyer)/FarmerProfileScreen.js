import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { farmersAPI } from '../../services/api';
import ProductCard from '../../components/shared/ProductCard';

export default function FarmerProfileScreen({ navigation, route }) {
  const { farmerId } = route.params;

  const [farmer,   setFarmer]   = useState(null);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetchFarmer();
  }, []);

  const fetchFarmer = async () => {
    try {
      const [profileRes, productsRes] = await Promise.all([
        farmersAPI.getProfile(farmerId),
        farmersAPI.getProducts(farmerId),
      ]);
      setFarmer(profileRes.data);
      setProducts(productsRes.data.products);
    } catch (error) {
      Alert.alert('Error', 'Failed to load farmer profile');
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
            <Text className="text-white text-base">← Back</Text>
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
                      ✓ Verified
                    </Text>
                  </View>
                )}
              </View>
              {farmer.municipality && (
                <Text className="text-white/80 text-sm mt-1">
                  📍 {farmer.municipality}
                </Text>
              )}
              <Text className="text-white/60 text-xs mt-1">
                Member since {new Date(farmer.created_at).getFullYear()}
              </Text>
            </View>
          </View>

        </View>

        <View className="flex-row bg-white border-b border-gray-100">
          <View className="flex-1 items-center py-4 border-r border-gray-100">
            <Text className="text-primary font-bold text-xl">
              {farmer.stats.total_products}
            </Text>
            <Text className="text-muted text-xs mt-1">Total products</Text>
          </View>
          <View className="flex-1 items-center py-4 border-r border-gray-100">
            <Text className="text-secondary font-bold text-xl">
              {farmer.stats.available_products}
            </Text>
            <Text className="text-muted text-xs mt-1">Available now</Text>
          </View>
          <View className="flex-1 items-center py-4">
            <Text className="text-accent font-bold text-xl">
              {farmer.stats.min_price
                ? `€${parseFloat(farmer.stats.min_price).toFixed(2)}`
                : '—'
              }
            </Text>
            <Text className="text-muted text-xs mt-1">Starting from</Text>
          </View>
        </View>

        <View className="px-6 pt-6 pb-10">
          <Text className="text-dark font-bold text-lg mb-4">
            Products ({products.length})
          </Text>

          {products.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-4xl mb-3">🌱</Text>
              <Text className="text-muted text-base text-center">
                This farmer has no products yet
              </Text>
            </View>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, farmer: { name: farmer.name } }}
                onPress={() => navigation.navigate('ProductDetail', {
                  productId: product.id,
                })}
              />
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}