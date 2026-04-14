import { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, ActivityIndicator,
  Dimensions, Alert,
} from 'react-native';
import { productsAPI } from '../../services/api';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#52B788" />
      </View>
    );
  }

  if (!product) return null;

  const hasPhotos = product.photo_urls && product.photo_urls.length > 0;

  return (
    <View className="flex-1 bg-light">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Photo carousel */}
        {hasPhotos ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setPhotoIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {product.photo_urls.map((url, i) => (
                <Image
                  key={i}
                  source={{ uri: url }}
                  style={{ width, height: 280 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Dot indicators */}
            {product.photo_urls.length > 1 && (
              <View className="flex-row justify-center gap-x-2 mt-3">
                {product.photo_urls.map((_, i) => (
                  <View
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === photoIndex ? 'bg-secondary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View
            className="w-full bg-gray-100 items-center justify-center"
            style={{ height: 280 }}
          >
            <Text className="text-7xl">🌿</Text>
          </View>
        )}

        {/* Back button */}
        <TouchableOpacity
          className="absolute top-12 left-4 w-10 h-10 bg-white rounded-full items-center justify-center"
          style={{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-dark text-lg">←</Text>
        </TouchableOpacity>

        {/* Content */}
        <View className="px-6 pt-6 pb-10">

          {/* Name + availability */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-dark font-bold text-2xl flex-1 mr-3">
              {product.name}
            </Text>
            <View className={`px-3 py-1 rounded-full ${
              product.available ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Text className={`text-xs font-bold ${
                product.available ? 'text-green-600' : 'text-red-500'
              }`}>
                {product.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          {/* Category */}
          <Text className="text-muted text-sm capitalize mb-4">
            {product.category}
          </Text>

          {/* Price */}
          <View className="bg-secondary/10 rounded-2xl p-4 mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-muted text-sm mb-1">Price per {product.unit}</Text>
              <Text className="text-secondary font-bold text-3xl">
                €{parseFloat(product.price).toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-muted text-sm mb-1">In stock</Text>
              <Text className="text-dark font-bold text-xl">
                {product.quantity} {product.unit}
              </Text>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View className="mb-6">
              <Text className="text-dark font-bold text-base mb-2">
                About this product
              </Text>
              <Text className="text-muted text-base leading-6">
                {product.description}
              </Text>
            </View>
          )}

          {/* Farmer card */}
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-6 flex-row items-center"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
            onPress={() => navigation.navigate('FarmerProfile', {
              farmerId: product.farmer.id
            })}
          >
            <View className="w-14 h-14 rounded-full bg-primary items-center justify-center mr-4">
              <Text className="text-white text-xl font-bold">
                {product.farmer.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-x-2">
                <Text className="text-dark font-bold text-base">
                  {product.farmer.name}
                </Text>
              </View>
              <Text className="text-muted text-sm mt-1">
                📍 {product.farmer.municipality || 'Kosovo'}
              </Text>
              {product.farmer.phone && (
                <Text className="text-muted text-sm">
                  📞 {product.farmer.phone}
                </Text>
              )}
            </View>
            <Text className="text-muted text-lg">→</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Order button — fixed at bottom */}
      <View
        className="bg-white px-6 py-4"
        style={{ borderTopWidth: 1, borderTopColor: '#E9ECEF' }}
      >
        {product.available ? (
          <TouchableOpacity
            className="bg-secondary rounded-xl py-4 items-center"
            onPress={() => navigation.navigate('OrderRequest', { product })}
          >
            <Text className="text-white font-bold text-base">
              Request Order
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-200 rounded-xl py-4 items-center">
            <Text className="text-muted font-bold text-base">
              Currently Unavailable
            </Text>
          </View>
        )}
      </View>

    </View>
  );
}