import { View, Text, TouchableOpacity } from 'react-native';
import useAuth from '../../hooks/useAuth';

export default function MyOrdersScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-light">

      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-dark">My Orders</Text>
        <Text className="text-muted text-sm mt-1">
          Signed in as {user?.name}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl mb-4">📦</Text>
        <Text className="text-dark font-bold text-lg mb-2">
          Orders coming soon!
        </Text>
        <Text className="text-muted text-center">
          We're working hard to bring you the best experience. Stay tuned for updates!
        </Text>
      </View>

      <View className="px-6 pb-10">
        <TouchableOpacity
          className="border border-red-200 rounded-2xl py-4 items-center"
          onPress={logout}
        >
          <Text className="text-red-500 font-bold">Sign out</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}