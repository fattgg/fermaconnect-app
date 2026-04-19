import { View, Text, ActivityIndicator } from 'react-native';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <View className="flex-1 items-center justify-center bg-light px-6">
      <ActivityIndicator size="large" color="#2D6A4F" />
      <Text className="text-muted text-sm mt-4 text-center">
        {message}
      </Text>
    </View>
  );
}