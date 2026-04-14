import { View, Text, TouchableOpacity } from 'react-native';
import useAuth from '../../hooks/useAuth';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-light items-center justify-center px-6">
      <Text className="text-2xl font-bold text-secondary mb-2">
        Buyer Home
      </Text>
      <Text className="text-muted text-base mb-8">
        Welcome, {user?.name}
      </Text>
      <TouchableOpacity
        className="bg-red-500 rounded-xl px-8 py-3"
        onPress={logout}
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}