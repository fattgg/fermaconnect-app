import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ordersAPI } from "../../services/api";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../constants";

function IncomingOrderCard({ order, onUpdateStatus }) {
  const { t } = useTranslation();

  const product = order.product;
  const buyer = order.buyer;
  const hasPhoto = product?.photo_urls && product.photo_urls.length > 0;
  const statusColor = ORDER_STATUS_COLORS[order.status] || "#6C757D";
  const statusLabel = t(`common.${order.status}`);
  const isPending = order.status === "pending";
  const isAccepted = order.status === "accepted";

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
            <Text className="text-dark text-sm mt-1">
              {order.quantity} {product?.unit} · €
              {(parseFloat(product?.price) * order.quantity).toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: statusColor + "20" }}
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

      <View className="px-4 py-3 border-t border-gray-100">
        <Text className="text-muted text-xs font-bold uppercase mb-2">
          {t("incomingOrders.buyerSection")}
        </Text>
        <View className="flex-row items-center gap-x-3">
          <View className="w-8 h-8 rounded-full bg-secondary/20 items-center justify-center">
            <Text className="text-secondary font-bold text-sm">
              {buyer?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="text-dark font-bold text-sm">{buyer?.name}</Text>
            <Text className="text-secondary text-sm">
              📞 {order.contact_info}
            </Text>
          </View>
        </View>

        {order.note && (
          <View className="mt-2 bg-gray-50 rounded-xl px-3 py-2">
            <Text className="text-muted text-xs font-bold mb-1">
              {t("incomingOrders.noteSection")}
            </Text>
            <Text className="text-dark text-sm">{order.note}</Text>
          </View>
        )}
      </View>

      {isPending && (
        <View className="flex-row border-t border-gray-100">
          <TouchableOpacity
            className="flex-1 py-3 items-center bg-red-50"
            onPress={() => onUpdateStatus(order, "rejected")}
          >
            <Text className="text-red-500 font-bold text-sm">
              {t("incomingOrders.reject")}
            </Text>
          </TouchableOpacity>
          <View className="w-px bg-gray-100" />
          <TouchableOpacity
            className="flex-1 py-3 items-center bg-green-50"
            onPress={() => onUpdateStatus(order, "accepted")}
          >
            <Text className="text-primary font-bold text-sm">
              {t("incomingOrders.accept")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isAccepted && (
        <View className="border-t border-gray-100">
          <TouchableOpacity
            className="py-3 items-center bg-primary/10"
            onPress={() => onUpdateStatus(order, "completed")}
          >
            <Text className="text-primary font-bold text-sm">
              {t("incomingOrders.markCompleted")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function IncomingOrdersScreen({ navigation }) {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchOrders);
    return unsubscribe;
  }, [navigation]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = (order, status) => {
    const messages = {
      accepted: t("incomingOrders.acceptConfirm", {
        product: order.product?.name,
      }),
      rejected: t("incomingOrders.rejectConfirm", {
        product: order.product?.name,
      }),
      completed: t("incomingOrders.completeConfirm"),
    };

    Alert.alert(t("incomingOrders.updateOrder"), messages[status], [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.confirm"),
        style: status === "rejected" ? "destructive" : "default",
        onPress: async () => {
          try {
            await ordersAPI.updateStatus(order.id, status);
            setOrders((prev) =>
              prev.map((o) => (o.id === order.id ? { ...o, status } : o)),
            );
          } catch (error) {
            Alert.alert(t("common.error"), t("incomingOrders.updateFailed"));
          }
        },
      },
    ]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const otherOrders = orders.filter((o) => o.status !== "pending");
  const sortedOrders = [...pendingOrders, ...otherOrders];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light">
      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark">
          {t("incomingOrders.title")}
        </Text>
        <View className="flex-row gap-x-4 mt-2">
          <Text className="text-muted text-sm">
            {pendingOrders.length} {t("common.pending").toLowerCase()}
          </Text>
          <Text className="text-muted text-sm">
            {orders.length} {t("common.all").toLowerCase()}
          </Text>
        </View>
      </View>

      <FlatList
        data={sortedOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IncomingOrderCard order={item} onUpdateStatus={handleUpdateStatus} />
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
            <Text className="text-5xl mb-4">📬</Text>
            <Text className="text-dark font-bold text-lg mb-2">
              {t("incomingOrders.noOrders")}
            </Text>
            <Text className="text-muted text-sm text-center">
              {t("incomingOrders.noOrdersDesc")}
            </Text>
          </View>
        }
      />
    </View>
  );
}
