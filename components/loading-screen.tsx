import { View, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <LinearGradient
        colors={['#f798af', '#e5749a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
      >
        <Text className="text-white text-4xl font-black tracking-[2px]">FX</Text>
      </LinearGradient>
      <ActivityIndicator size="large" color="#f798af" />
      <Text className="text-text-secondary text-sm mt-4">
        Se încarcă experiența ta fitness...
      </Text>
    </View>
  );
}
