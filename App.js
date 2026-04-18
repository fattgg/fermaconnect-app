import './global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer }          from '@react-navigation/native';
import { createNativeStackNavigator }   from '@react-navigation/native-stack';
import { createBottomTabNavigator }     from '@react-navigation/bottom-tabs';

import useAuth from './hooks/useAuth';

// Auth screens
import OnboardingScreen from './app/(auth)/OnboardingScreen';
import LoginScreen      from './app/(auth)/LoginScreen';
import RegisterScreen   from './app/(auth)/RegisterScreen';

// Buyer screens
import HomeScreen          from './app/(buyer)/HomeScreen';
import ProductDetailScreen from './app/(buyer)/ProductDetailScreen';
import FarmerProfileScreen from './app/(buyer)/FarmerProfileScreen';
import OrderRequestScreen  from './app/(buyer)/OrderRequestScreen';
import MyOrdersScreen      from './app/(buyer)/MyOrdersScreen';

// Farmer screens
import DashboardScreen    from './app/(farmer)/DashboardScreen';
import MyListingsScreen   from './app/(farmer)/MyListingsScreen';
import AddProductScreen   from './app/(farmer)/AddProductScreen';

const Stack       = createNativeStackNavigator();
const BuyerStack  = createNativeStackNavigator();
const FarmerStack = createNativeStackNavigator();
const Tab         = createBottomTabNavigator();

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
        headerShown:             false,
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
      <Tab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📦</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Buyer Navigator ──────────────────────────────────────────
function BuyerNavigator() {
  return (
    <BuyerStack.Navigator screenOptions={{ headerShown: false }}>
      <BuyerStack.Screen name="BuyerTabs"     component={BuyerTabs} />
      <BuyerStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <BuyerStack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
      <BuyerStack.Screen name="OrderRequest"  component={OrderRequestScreen} />
    </BuyerStack.Navigator>
  );
}

// ─── Farmer Tabs ──────────────────────────────────────────────
function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:             false,
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
      <Tab.Screen
        name="Listings"
        component={MyListingsScreen}
        options={{
          tabBarLabel: 'Listings',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📋</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Farmer Navigator ─────────────────────────────────────────
function FarmerNavigator() {
  return (
    <FarmerStack.Navigator screenOptions={{ headerShown: false }}>
      <FarmerStack.Screen name="FarmerTabs"  component={FarmerTabs} />
      <FarmerStack.Screen name="AddProduct"  component={AddProductScreen} />
      <FarmerStack.Screen name="EditProduct" component={AddProductScreen} />
      <FarmerStack.Screen name="FarmerOrders" component={MyOrdersScreen} />
    </FarmerStack.Navigator>
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
      {!isAuthenticated             && <AuthStack />}
      {isAuthenticated && isFarmer  && <FarmerNavigator />}
      {isAuthenticated && !isFarmer && <BuyerNavigator />}
    </NavigationContainer>
  );
}