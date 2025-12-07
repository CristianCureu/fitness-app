import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const appUser = useAuthStore((state) => state.appUser);
  const supabaseUser = useAuthStore((state) => state.supabaseUser);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#f798af", "#e5749a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-8 px-6 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between px-6 pt-16 pb-6 mb-4">
          <View>
            <Text className="text-3xl font-bold text-white mb-1">Profile</Text>
            <Text className="text-white/80 text-sm">
              {appUser?.role || "User"}
            </Text>
          </View>
          <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {supabaseUser?.email?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View className="px-6 -mt-6 mb-6">
        <View className="bg-surface rounded-2xl p-4 border border-border">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-primary text-2xl font-bold">0</Text>
              <Text className="text-text-muted text-xs mt-1">Workouts</Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center">
              <Text className="text-primary text-2xl font-bold">0</Text>
              <Text className="text-text-muted text-xs mt-1">Sessions</Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center">
              <Text className="text-primary text-2xl font-bold">0</Text>
              <Text className="text-text-muted text-xs mt-1">Days</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View className="px-6">
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Account Information
        </Text>

        <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-6">
          <View className="p-4 border-b border-border">
            <Text className="text-text-muted text-xs mb-2">Email Address</Text>
            <Text className="text-text-primary text-base font-medium">
              {supabaseUser?.email || "Not available"}
            </Text>
          </View>

          <View className="p-4 border-b border-border">
            <Text className="text-text-muted text-xs mb-2">Account Type</Text>
            <View className="flex-row items-center">
              <View className="bg-primary/20 px-3 py-1 rounded-full">
                <Text className="text-primary text-sm font-semibold">
                  {appUser?.role || "User"}
                </Text>
              </View>
            </View>
          </View>

          <View className="p-4">
            <Text className="text-text-muted text-xs mb-2">User ID</Text>
            <Text className="text-text-secondary text-xs font-mono">
              {appUser?.id || "Not available"}
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Settings
        </Text>

        <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-6">
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-border">
            <View>
              <Text className="text-text-primary text-base font-medium mb-1">
                Notifications
              </Text>
              <Text className="text-text-muted text-xs">
                Manage your notifications
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-border">
            <View>
              <Text className="text-text-primary text-base font-medium mb-1">
                Privacy & Security
              </Text>
              <Text className="text-text-muted text-xs">
                Control your privacy settings
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-text-primary text-base font-medium mb-1">
                Help & Support
              </Text>
              <Text className="text-text-muted text-xs">
                Get help and support
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <Button
          label="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          fullWidth
          className="mb-10"
        />
      </View>
    </ScrollView>
  );
}
