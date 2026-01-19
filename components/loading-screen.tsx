import { View, ActivityIndicator, Text } from "react-native";

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="h-12 w-12 rounded-2xl bg-primary/15 border border-primary/30 items-center justify-center">
        <Text className="text-primary font-black text-lg">FX</Text>
      </View>
      <ActivityIndicator size="large" color="#f798af" />
      <Text className="text-text-secondary text-sm mt-4">
        Se încarcă experiența ta fitness...
      </Text>
    </View>
  );
}
