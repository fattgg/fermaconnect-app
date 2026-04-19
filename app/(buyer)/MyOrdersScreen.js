import { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert, Image,
} from 'react-native';
import { ordersAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants';

function OrderCard({ order, onPress }) {
  const product = order.product;
  const hasPhoto = product?.photo_urls && product.photo_urls.length > 0;
  const statusColor = ORDER_STATUS_COLORS[order.status] || '#6C757D';
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
      onPress={onPress}
      activeOpacity={0.85}
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

        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-dark font-bold text-base" numberOfLines={1}>
              {product?.name}
            </Text>
            <Text className="text-muted text-xs mt-1">
              From {product?.farmer_name}
            </Text>
            <Text className="text-dark text-sm mt-1">
              {order.quantity} {product?.unit} ·{' '}
              <Text className="text-secondary font-bold">
                €{(parseFloat(product?.price) * order.quantity).toFixed(2)}
              </Text>
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: statusColor + '20' }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: statusColor }}
              >
                {statusLabel}
              </Text>
            </View>
            <Text className="text-muted text-xs">
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {order.note && (
        <View className="px-4 py-2 border-t border-gray-100">
          <Text className="text-muted text-xs" numberOfLines={1}>
            Note: {order.note}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function MyOrdersScreen({ navigation }) {
  const { user, logout } = useAuth();

  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchOrders);
    return unsubscribe;
  }, [navigation]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#52B788" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">

      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark">My Orders</Text>
        <Text className="text-muted text-sm mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </Text>
      </View>

      <View className="bg-white border-b border-gray-100 px-6 py-3 flex-row gap-x-4">
        {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
          <View key={key} className="flex-row items-center gap-x-1">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ORDER_STATUS_COLORS[key] }}
            />
            <Text className="text-muted text-xs">{label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => {}}
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
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-5xl mb-4">📦</Text>
            <Text className="text-dark font-bold text-lg mb-2">
              No orders yet
            </Text>
            <Text className="text-muted text-sm text-center mb-6">
              Browse products and place your first order
            </Text>
            <TouchableOpacity
              className="bg-secondary rounded-xl px-6 py-3"
              onPress={() => navigation.navigate('Home')}
            >
              <Text className="text-white font-bold">Browse products</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          orders.length > 0 ? (
            <View className="pb-4 pt-2">
              <TouchableOpacity
                className="border border-red-200 rounded-2xl py-4 items-center"
                onPress={logout}
              >
                <Text className="text-red-500 font-bold">Sign out</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}