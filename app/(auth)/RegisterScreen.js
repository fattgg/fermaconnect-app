import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import { authAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { MUNICIPALITIES } from '../../constants';

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'buyer';

  const [name,         setName]         = useState('');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [phone,        setPhone]        = useState('');
  const [municipality, setMunicipality] = useState('');
  const [showMunic,    setShowMunic]    = useState(false);
  const [loading,      setLoading]      = useState(false);

  const { setAuth } = useAuth();

  const isFarmer = role === 'farmer';
  const color    = isFarmer ? 'bg-primary' : 'bg-secondary';
  const colorBorder = isFarmer ? 'border-primary' : 'border-secondary';
  const colorText   = isFarmer ? 'text-primary'   : 'text-secondary';

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Name, email and password are required');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        role,
        phone:        phone        || undefined,
        municipality: municipality || undefined,
      });

      const { token, user } = response.data;
      await setAuth(token, user);
    } catch (error) {
      const message = error.response?.data?.message
        || error.response?.data?.errors?.[0]
        || 'Registration failed. Please try again.';
      Alert.alert('Registration failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-light"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-12">

          <View className="mb-8">
            <Text className="text-3xl font-bold text-dark">
              Create account
            </Text>
            <Text className="text-muted text-base mt-2">
              Register as a {role}
            </Text>
          </View>

          <View className="gap-y-4">

            <View>
              <Text className="text-dark font-bold mb-2">
                Full name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder="Agron Berisha"
                placeholderTextColor="#6C757D"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                Email <Text className="text-red-500">*</Text>
              </Text>
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
              <Text className="text-dark font-bold mb-2">
                Password <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder="Min. 6 characters"
                placeholderTextColor="#6C757D"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                Phone
                <Text className="text-muted font-normal"> (optional)</Text>
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark text-base"
                placeholder="+383 xx xxx xxx"
                placeholderTextColor="#6C757D"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View>
              <Text className="text-dark font-bold mb-2">
                Municipality
                <Text className="text-muted font-normal"> (optional)</Text>
              </Text>
              <TouchableOpacity
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                onPress={() => setShowMunic(!showMunic)}
              >
                <Text className={municipality ? 'text-dark text-base' : 'text-muted text-base'}>
                  {municipality || 'Select municipality'}
                </Text>
                <Text className="text-muted">{showMunic ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showMunic && (
                <View className="bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-hidden">
                  <ScrollView nestedScrollEnabled>
                    {MUNICIPALITIES.map((m) => (
                      <TouchableOpacity
                        key={m}
                        className={`px-4 py-3 border-b border-gray-100 ${municipality === m ? colorBorder : ''}`}
                        onPress={() => {
                          setMunicipality(m);
                          setShowMunic(false);
                        }}
                      >
                        <Text className={municipality === m ? `${colorText} font-bold` : 'text-dark'}>
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

          </View>

          <TouchableOpacity
            className={`${color} rounded-xl py-4 items-center mt-8`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className="text-white font-bold text-base">
                  Create Account
                </Text>
            }
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-muted">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login', { role })}
            >
              <Text className={`${colorText} font-bold`}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center mt-4"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-muted">← Back</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}