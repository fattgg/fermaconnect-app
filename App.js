import './global.css';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-light">
      <Text className="text-2xl font-bold text-primary">
        FermaConnect
      </Text>
      <Text className="text-muted mt-2">
        Setup working!
      </Text>
    </View>
  );
}