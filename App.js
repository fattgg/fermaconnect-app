import './global.css';
import { useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useAuth from './hooks/useAuth';

export default function App() {
  const { isLoading, isAuthenticated, user, loadFromStorage } = useAuth();

  useEffect(() => {
    loadFromStorage();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-light px-6">
      <Text className="text-2xl font-bold text-primary mb-4">
        FermaConnect
      </Text>
      <Text className="text-muted text-base">
        Auth state: {isAuthenticated ? 'Logged in' : 'Not logged in'}
      </Text>
      {user && (
        <Text className="text-dark text-base mt-2">
          Role: {user.role}
        </Text>
      )}
    </View>
  );
}