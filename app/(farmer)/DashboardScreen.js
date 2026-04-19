import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { ordersAPI, productsAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const MUNICIPALITY_COORDS = {
  'Pristina':  { lat: 42.6629, lon: 21.1655 },
  'Prizren':   { lat: 42.2139, lon: 20.7397 },
  'Peja':      { lat: 42.6600, lon: 20.2883 },
  'Gjakova':   { lat: 42.3803, lon: 20.4308 },
  'Gjilan':    { lat: 42.4638, lon: 21.4694 },
  'Mitrovica': { lat: 42.8914, lon: 20.8660 },
  'Ferizaj':   { lat: 42.3702, lon: 21.1553 },
};

const DEFAULT_COORDS = { lat: 42.6629, lon: 21.1655 }; 

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();

  const [stats,      setStats]      = useState(null);
  const [weather,    setWeather]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    await Promise.all([fetchStats(), fetchWeather()]);
    setLoading(false);
    setRefreshing(false);
  };

  const fetchStats = async () => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      productsAPI.getAll({ limit: 50 }),
      ordersAPI.getAll(),
    ]);

    const allProducts = productsRes.data.products;
    const myProducts  = allProducts.filter(p => p.farmer?.id === user?.id);
    const myOrders    = ordersRes.data.orders;

    setStats({
      totalProducts:     myProducts.length,
      availableProducts: myProducts.filter(p => p.available).length,
      pendingOrders:     myOrders.filter(o => o.status === 'pending').length,
      totalOrders:       myOrders.length,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
};

  const fetchWeather = async () => {
    try {
      const coords = MUNICIPALITY_COORDS[user?.municipality] || DEFAULT_COORDS;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`;

      const response = await fetch(url);
      const data     = await response.json();

      setWeather({
        temp:      Math.round(data.current.temperature_2m),
        windspeed: Math.round(data.current.windspeed_10m),
        code:      data.current.weathercode,
      });
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  const getWeatherEmoji = (code) => {
    if (code === 0)                return '☀️';
    if (code <= 2)                 return '🌤️';
    if (code <= 3)                 return '☁️';
    if (code <= 49)                return '🌫️';
    if (code <= 59)                return '🌦️';
    if (code <= 69)                return '🌧️';
    if (code <= 79)                return '🌨️';
    if (code <= 84)                return '🌧️';
    if (code <= 99)                return '⛈️';
    return '🌡️';
  };

  const getWeatherLabel = (code) => {
    if (code === 0)  return 'Clear sky';
    if (code <= 2)   return 'Partly cloudy';
    if (code <= 3)   return 'Overcast';
    if (code <= 49)  return 'Foggy';
    if (code <= 59)  return 'Drizzle';
    if (code <= 69)  return 'Rainy';
    if (code <= 79)  return 'Snow';
    if (code <= 84)  return 'Rain showers';
    if (code <= 99)  return 'Thunderstorm';
    return 'Unknown';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-light"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#2D6A4F"
        />
      }
    >
      <View className="bg-primary px-6 pt-14 pb-6">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white/70 text-sm">Good morning,</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {user?.name?.split(' ')[0]}
            </Text>
            {user?.municipality && (
              <Text className="text-white/70 text-sm mt-1">
                📍 {user.municipality}
              </Text>
            )}
          </View>

          {weather && (
            <View className="bg-white/20 rounded-2xl px-4 py-3 items-center">
              <Text style={{ fontSize: 28 }}>
                {getWeatherEmoji(weather.code)}
              </Text>
              <Text className="text-white font-bold text-lg">
                {weather.temp}°C
              </Text>
              <Text className="text-white/70 text-xs">
                {getWeatherLabel(weather.code)}
              </Text>
              <Text className="text-white/70 text-xs">
                💨 {weather.windspeed} km/h
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="px-6 pt-6 pb-10">

        <Text className="text-dark font-bold text-lg mb-4">
          Overview
        </Text>
        <View className="flex-row gap-x-3 mb-3">
          <View className="flex-1 bg-white rounded-2xl p-4"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
          >
            <Text className="text-primary font-bold text-2xl">
              {stats?.totalProducts ?? 0}
            </Text>
            <Text className="text-muted text-sm mt-1">Total listings</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
          >
            <Text className="text-secondary font-bold text-2xl">
              {stats?.availableProducts ?? 0}
            </Text>
            <Text className="text-muted text-sm mt-1">Available now</Text>
          </View>
        </View>
        <View className="flex-row gap-x-3 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
          >
            <Text className="text-accent font-bold text-2xl">
              {stats?.pendingOrders ?? 0}
            </Text>
            <Text className="text-muted text-sm mt-1">Pending orders</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
          >
            <Text className="text-dark font-bold text-2xl">
              {stats?.totalOrders ?? 0}
            </Text>
            <Text className="text-muted text-sm mt-1">Total orders</Text>
          </View>
        </View>

        <Text className="text-dark font-bold text-lg mb-4">
          Quick actions
        </Text>
        <View className="gap-y-3 mb-6">
          <TouchableOpacity
            className="bg-primary rounded-2xl p-4 flex-row items-center"
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={{ fontSize: 24 }}>➕</Text>
            <View className="ml-4">
              <Text className="text-white font-bold text-base">
                Add new product
              </Text>
              <Text className="text-white/70 text-sm">
                List a product for buyers
              </Text>
            </View>
            <Text className="text-white ml-auto text-lg">→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-2xl p-4 flex-row items-center"
            style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 }}
            onPress={() => navigation.navigate('FarmerOrders')}
          >
            <Text style={{ fontSize: 24 }}>📦</Text>
            <View className="ml-4">
              <Text className="text-dark font-bold text-base">
                View orders
              </Text>
              <Text className="text-muted text-sm">
                {stats?.pendingOrders ?? 0} pending
              </Text>
            </View>
            <Text className="text-muted ml-auto text-lg">→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="border border-red-200 rounded-2xl py-4 items-center"
          onPress={logout}
        >
          <Text className="text-red-500 font-bold">Sign out</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}