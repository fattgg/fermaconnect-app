import './global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import useAuth from './hooks/useAuth';

// Auth screens
import OnboardingScreen from './app/(auth)/OnboardingScreen';
import LoginScreen      from './app/(auth)/LoginScreen';
import RegisterScreen   from './app/(auth)/RegisterScreen';

// Buyer screens
import HomeScreen from './app/(buyer)/HomeScreen';

// Farmer screens
import DashboardScreen from './app/(farmer)/DashboardScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Auth Stack ───────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login"      component={LoginScreen} />
      <Stack.Screen name="Register"   component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─── Buyer Tabs ───────────────────────────────────────────────
function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:     false,
        tabBarActiveTintColor:   '#52B788',
        tabBarInactiveTintColor: '#6C757D',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor:  '#E9ECEF',
          paddingBottom:   8,
          paddingTop:      8,
          height:          64,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Browse',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🛒</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Farmer Tabs ──────────────────────────────────────────────
function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:     false,
        tabBarActiveTintColor:   '#2D6A4F',
        tabBarInactiveTintColor: '#6C757D',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor:  '#E9ECEF',
          paddingBottom:   8,
          paddingTop:      8,
          height:          64,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🌱</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────
export default function App() {
  const { isLoading, isAuthenticated, isFarmer, loadFromStorage } = useAuth();

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
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && isFarmer  && <FarmerTabs />}
      {isAuthenticated && !isFarmer && <BuyerTabs />}
    </NavigationContainer>
  );
}