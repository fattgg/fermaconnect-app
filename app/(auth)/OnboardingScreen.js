import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View className="flex-1 bg-light px-6 justify-between py-16">

      <View className="items-center mt-10">
        <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-6">
          <Text className="text-white text-4xl font-bold">F</Text>
        </View>
        <Text className="text-3xl font-bold text-primary text-center">
          FermaConnect
        </Text>
        <Text className="text-muted text-base text-center mt-3 leading-6">
          Connecting Kosovo farmers{'\n'}directly with buyers
        </Text>
      </View>

      <View className="gap-y-4">
        <Text className="text-dark text-lg font-bold text-center mb-2">
          I am a...
        </Text>

        <TouchableOpacity
          className="bg-primary rounded-2xl p-5 flex-row items-center"
          onPress={() => navigation.navigate('Login', { role: 'farmer' })}
        >
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
            <Text className="text-2xl">🌱</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">Farmer</Text>
            <Text className="text-white/80 text-sm mt-1">
              List your products and receive orders
            </Text>
          </View>
          <Text className="text-white text-xl">→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary rounded-2xl p-5 flex-row items-center"
          onPress={() => navigation.navigate('Login', { role: 'buyer' })}
        >
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
            <Text className="text-2xl">🛒</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">Buyer</Text>
            <Text className="text-white/80 text-sm mt-1">
              Browse fresh local products
            </Text>
          </View>
          <Text className="text-white text-xl">→</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-muted text-sm text-center">
        Fresh from Kosovo farms, direct to you
      </Text>

    </View>
  );
}