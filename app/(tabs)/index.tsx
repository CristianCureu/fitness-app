import { useAppUser } from "@/lib/stores/auth-store";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const appUser = useAppUser();

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-secondary text-sm mb-2">Welcome back,</Text>
        <Text className="text-text-primary text-3xl font-bold">
          {appUser?.clientProfile?.firstName || "User"}
        </Text>
      </View>

      {/* Recent Activity */}
      <View className="px-6 mb-6">
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Recent Activity
        </Text>
        <View className="bg-surface border border-border rounded-2xl p-6 items-center">
          <Text className="text-text-muted text-sm">No recent activity</Text>
          <Text className="text-text-muted text-xs mt-1">Start your first workout!</Text>
        </View>
      </View>
    </ScrollView>
  );
}
