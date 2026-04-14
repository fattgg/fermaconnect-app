import './global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from './hooks/useAuth';

import OnboardingScreen from './app/(auth)/OnboardingScreen';
import LoginScreen      from './app/(auth)/LoginScreen';
import RegisterScreen   from './app/(auth)/RegisterScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login"      component={LoginScreen} />
      <Stack.Screen name="Register"   component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const { isLoading, loadFromStorage } = useAuth();

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
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}