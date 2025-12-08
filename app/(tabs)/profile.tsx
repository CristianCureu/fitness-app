import { Button } from "@/components/ui/button";
import { useAuthStore, useUserRole } from "@/lib/stores/auth-store";
import { ClientProfile, TrainerProfile } from "@/lib/types/api";
import type { User } from "@supabase/supabase-js";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Field {
  label: string;
  text: string | number;
}

type ClientFields = Field & {
  name: keyof User | keyof ClientProfile;
};

type TrainerFields = Field & {
  name: keyof User | keyof TrainerProfile;
};

export default function ProfileScreen() {
  const appUser = useAuthStore((state) => state.appUser);
  const supabaseUser = useAuthStore((state) => state.supabaseUser);
  const signOut = useAuthStore((state) => state.signOut);
  const userRole = useUserRole();

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

  const clientInfoFields: ClientFields[] = [
    {
      name: "email",
      label: "Email",
      text: supabaseUser?.email || "Not specified",
    },
    {
      name: "firstName",
      label: "First Name",
      text: appUser?.clientProfile?.firstName || "Not specified",
    },
    {
      name: "lastName",
      label: "Last Name",
      text: appUser?.clientProfile?.lastName || "Not specified",
    },
    {
      name: "height",
      label: "Height",
      text: appUser?.clientProfile?.height || "Not specified",
    },
    {
      name: "weight",
      label: "Weight",
      text: appUser?.clientProfile?.weight || "Not specified",
    },
  ];

  const trainerInfoFields: TrainerFields[] = [
    {
      name: "email",
      label: "Email",
      text: supabaseUser?.email || "Not specified",
    },
    {
      name: "firstName",
      label: "First Name",
      text: appUser?.clientProfile?.firstName || "Not specified",
    },
    {
      name: "lastName",
      label: "Last Name",
      text: appUser?.clientProfile?.lastName || "Not specified",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 pt-20 mb-4">
        <View>
          <Text className="text-3xl font-bold text-white mb-1">Profile</Text>
          <Text className="text-white/80 text-sm">{appUser?.role || "User"}</Text>
        </View>
        <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
          <Text className="text-white text-2xl font-bold">
            {supabaseUser?.email?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
      </View>

      {/* Account Info */}
      <View className="px-6">
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wider">
          Account Information
        </Text>

        <View className="bg-surface rounded-2xl border border-border overflow-hidden mb-6">
          {userRole === "CLIENT"
            ? clientInfoFields.map((f) => (
                <View key={f.name} className="p-4 border-b border-border">
                  <Text className="text-text-muted text-xs mb-2">{f.label}</Text>
                  <Text className="text-text-primary text-base font-medium">
                    {f.text}
                  </Text>
                </View>
              ))
            : trainerInfoFields.map((f) => (
                <View key={f.name} className="p-4 border-b border-border">
                  <Text className="text-text-muted text-xs mb-2">{f.label}</Text>
                  <Text className="text-text-primary text-base font-medium">
                    {f.text}
                  </Text>
                </View>
              ))}

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
              <Text className="text-text-muted text-xs">Manage your notifications</Text>
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
              <Text className="text-text-muted text-xs">Get help and support</Text>
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
