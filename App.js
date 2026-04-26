import "./global.css";
import { useState, useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import i18n from "./i18n";

import useAuth from "./hooks/useAuth";

// Auth screens
import OnboardingScreen from "./app/(auth)/OnboardingScreen";
import LoginScreen from "./app/(auth)/LoginScreen";
import RegisterScreen from "./app/(auth)/RegisterScreen";

// Buyer screens
import HomeScreen from "./app/(buyer)/HomeScreen";
import ProductDetailScreen from "./app/(buyer)/ProductDetailScreen";
import FarmerProfileScreen from "./app/(buyer)/FarmerProfileScreen";
import OrderRequestScreen from "./app/(buyer)/OrderRequestScreen";
import MyOrdersScreen from "./app/(buyer)/MyOrdersScreen";

// Farmer screens
import DashboardScreen from "./app/(farmer)/DashboardScreen";
import MyListingsScreen from "./app/(farmer)/MyListingsScreen";
import AddProductScreen from "./app/(farmer)/AddProductScreen";
import EditProductScreen from "./app/(farmer)/EditProductScreen";
import IncomingOrdersScreen from "./app/(farmer)/IncomingOrdersScreen";

import { initI18n } from "./i18n";
import SettingsScreen from "./components/ui/SettingsScreen";
import useLanguageStore from "./store/languageStore";

const Stack = createNativeStackNavigator();
const BuyerStack = createNativeStackNavigator();
const FarmerStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: [],
  config: {},
};

// ─── Auth Stack ───────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ─── Buyer Tabs ───────────────────────────────────────────────
function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#52B788",
        tabBarInactiveTintColor: "#6C757D",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E9ECEF",
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: i18n.t("home.browseTab"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🛒</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          tabBarLabel: i18n.t("myOrders.title"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: i18n.t("settings.title"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>⚙️</Text>
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
      <BuyerStack.Screen name="BuyerTabs" component={BuyerTabs} />
      <BuyerStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <BuyerStack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
      <BuyerStack.Screen name="OrderRequest" component={OrderRequestScreen} />
    </BuyerStack.Navigator>
  );
}

// ─── Farmer Tabs ──────────────────────────────────────────────
function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2D6A4F",
        tabBarInactiveTintColor: "#6C757D",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E9ECEF",
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: i18n.t("dashboard.title"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🌱</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Listings"
        component={MyListingsScreen}
        options={{
          tabBarLabel: i18n.t("listings.title"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="FarmerOrders"
        component={IncomingOrdersScreen}
        options={{
          tabBarLabel: i18n.t("incomingOrders.tabLabel"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: i18n.t("settings.title"),
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>⚙️</Text>
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
      <FarmerStack.Screen name="FarmerTabs" component={FarmerTabs} />
      <FarmerStack.Screen name="AddProduct" component={AddProductScreen} />
      <FarmerStack.Screen name="EditProduct" component={EditProductScreen} />
    </FarmerStack.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────
export default function App() {
  const { isLoading, isAuthenticated, isFarmer, loadFromStorage } = useAuth();
  const { currentLanguage } = useLanguageStore();
  useEffect(() => {
    const initialize = async () => {
      await initI18n();
      fetch("https://fermaconnect-api.onrender.com/health").catch(() => {});
      await loadFromStorage();
    };
    initialize();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <NavigationContainer key={currentLanguage}>
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && isFarmer && <FarmerNavigator />}
      {isAuthenticated && !isFarmer && <BuyerNavigator />}
    </NavigationContainer>
  );
}
