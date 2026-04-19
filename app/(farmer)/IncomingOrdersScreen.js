import { View, Text } from 'react-native';

export default function IncomingOrdersScreen() {
  return (
    <View className="flex-1 bg-light items-center justify-center px-6">
      <Text className="text-5xl mb-4">📬</Text>
      <Text className="text-dark font-bold text-lg mb-2">
        Incoming Orders
      </Text>
      <Text className="text-muted text-sm text-center">
        Coming soon! This is where you'll see all the orders from your customers. You'll be able to manage them, update their status, and communicate with your buyers. Stay tuned!
      </Text>
    </View>
  );
}