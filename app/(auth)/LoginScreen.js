import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { authAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';

export default function LoginScreen({ navigation, route }) {
  const role = route.params?.role || 'buyer';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const { setAuth } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      if (user.role !== role) {
        Alert.alert(
          'Wrong account type',
          `This account is a ${user.role}. Please go back and select the correct role.`
        );
        setLoading(false);
        return;
      }

      await setAuth(token, user);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  const isFarmer = role === 'farmer';
  const color    = isFarmer ? 'bg-primary' : 'bg-secondary';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center py-12">

          <View className="mb-8">
            <Text className="text-3xl font-bold text-dark">
              Welcome back
            </Text>
            <Text className="text-muted text-base mt-2">
              Sign in as a {role}
            </Text>
          </View>

          <View className="gap-y-4">
            <View>
              <Text className="text-dark font-bold mb-2">Email</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder="your@email.com"
                placeholderTextColor="#6C757D"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">Password</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder="••••••••"
                placeholderTextColor="#6C757D"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            className={`${color} rounded-xl py-4 items-center mt-8`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className="text-white font-bold text-base">Sign In</Text>
            }
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register', { role })}
            >
              <Text className="text-primary font-bold">Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center mt-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-muted">← Back to home</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}