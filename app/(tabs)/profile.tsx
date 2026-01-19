import type { ComponentProps, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { useTodayView } from "@/lib/hooks/queries/use-today";
import { useMealIdeas } from "@/lib/hooks/queries/use-nutrition";
import { useMealIdeasAi, useWeeklyFeedbackAi } from "@/lib/hooks/queries/use-ai";
import { useAuthStore, useUserRole } from "@/lib/stores/auth-store";
import type { ClientProfile, TrainerProfile, UserRole } from "@/lib/types/api";
import type { User } from "@supabase/supabase-js";
import { useUpdateMyProfile } from "@/lib/hooks/queries/use-clients";
import { useRouter } from "expo-router";
import { CongratsOverlay } from "@/components/ui/congrats-overlay";
import { registerForPushNotificationsAsync } from "@/lib/notifications/push";

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

const STATUS_LABELS: Record<NonNullable<ClientProfile["status"]>, string> = {
  ACTIVE: "Activ",
  INACTIVE: "Inactiv",
  COMPLETED: "Finalizat",
};

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
}) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name={icon} size={16} color="#A3ADC8" />
        <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function ClientProfileScreen() {
  const router = useRouter();
  const appUser = useAuthStore((state) => state.appUser);
  const supabaseUser = useAuthStore((state) => state.supabaseUser);
  const signOut = useAuthStore((state) => state.signOut);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const todayQuery = useTodayView();
  const mealIdeasQuery = useMealIdeas();
  const mealIdeasAi = useMealIdeasAi();
  const weeklyFeedbackQuery = useWeeklyFeedbackAi();
  const updateMyProfile = useUpdateMyProfile();

  const clientProfile = appUser?.clientProfile;

  const [generatedMeals, setGeneratedMeals] = useState<string[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState("");

  const triggerCongrats = (message: string) => {
    setCongratsMessage(message);
    setShowCongrats(true);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
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

  const pinnedTips = useMemo(() => {
    const tips: string[] = [];
    if (todayQuery.data?.nutritionSettings?.objective) {
      tips.push(todayQuery.data.nutritionSettings.objective);
    }
    if (todayQuery.data?.nutritionTip?.text) {
      tips.push(todayQuery.data.nutritionTip.text);
    }
    if (todayQuery.data?.nutritionSettings?.weeklyGoal1) {
      tips.push(todayQuery.data.nutritionSettings.weeklyGoal1);
    }
    return tips.slice(0, 3);
  }, [todayQuery.data]);

  const handleGenerateMeals = () => {
    console.log("[AI][meal-ideas] sending", { mealsPerDay: 3 });
    mealIdeasAi.mutate(
      {
        preferences: [],
        mealsPerDay: 3,
      },
      {
        onSuccess: (data) => {
          console.log("[AI][meal-ideas] success", { ideas: data.ideas?.length || 0 });
          setGeneratedMeals(data.ideas || []);
        },
        onError: (error) => {
          console.log("[AI][meal-ideas] error", {
            message: error instanceof Error ? error.message : String(error),
          });
        },
      }
    );
  };

  const weeklyMessage =
    weeklyFeedbackQuery.data?.summary ||
    "Saptamana asta ai tinut ritmul bine, dar hidratarea a fost sub tinta. Saptamana viitoare focus pe apa si proteine la pranz.";

  useEffect(() => {
    if (weeklyFeedbackQuery.isError) {
      console.log("[AI][weekly-feedback] error", {
        message:
          weeklyFeedbackQuery.error instanceof Error
            ? weeklyFeedbackQuery.error.message
            : String(weeklyFeedbackQuery.error),
      });
    }
    if (weeklyFeedbackQuery.data) {
      console.log("[AI][weekly-feedback] loaded", {
        summaryLen: weeklyFeedbackQuery.data.summary?.length || 0,
      });
    }
  }, [weeklyFeedbackQuery.isError, weeklyFeedbackQuery.error, weeklyFeedbackQuery.data]);

  const pushEnabled = clientProfile?.pushEnabled ?? false;
  const pushSessionReminders = clientProfile?.pushSessionReminders ?? true;
  const pushDailyTips = clientProfile?.pushDailyTips ?? true;
  const pushWeeklyMessage = clientProfile?.pushWeeklyMessage ?? true;

  const handleTogglePush = async (nextValue: boolean) => {
    if (nextValue) {
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        Alert.alert("Notificări", "Permisiunea pentru notificări nu a fost acordată.");
        return;
      }
      updateMyProfile.mutate(
        {
          pushEnabled: true,
          pushToken: token,
        },
        {
          onSuccess: async () => {
            await refreshUser();
          },
        }
      );
      return;
    }

    updateMyProfile.mutate(
      {
        pushEnabled: false,
      },
      {
        onSuccess: async () => {
          await refreshUser();
        },
      }
    );
  };

  const handleTogglePushSetting = (key: "pushSessionReminders" | "pushDailyTips" | "pushWeeklyMessage", value: boolean) => {
    updateMyProfile.mutate(
      {
        [key]: value,
      } as any,
      {
        onSuccess: async () => {
          await refreshUser();
        },
      }
    );
  };

  const handleCompleteObjective = () => {
    updateMyProfile.mutate(
      { status: "COMPLETED" },
      {
        onSuccess: async () => {
          await refreshUser();
          triggerCongrats("Obiectiv atins. Felicitări!");
        },
      }
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-secondary text-sm mb-2">Tu</Text>
        <Text className="text-text-primary text-3xl font-bold">
          {clientProfile?.firstName || "Client"}
        </Text>
        <Text className="text-text-muted text-sm mt-1">
          {STATUS_LABELS[clientProfile?.status || "ACTIVE"]}
        </Text>
      </View>

      <View className="px-6 pb-10">
        <SectionCard title="Profil" icon="person-circle-outline">
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Nume</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {clientProfile?.firstName} {clientProfile?.lastName}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Email</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {supabaseUser?.email || "-"}
              </Text>
            </View>
            <Button
              label="Editează profilul"
              variant="outline"
              iconName="create-outline"
              onPress={() => router.push("/profile/edit")}
              className="mt-2"
            />
          </View>
        </SectionCard>

        <SectionCard title="Obiectiv" icon="flag-outline">
          <Text className="text-text-primary text-base">
            {clientProfile?.goalDescription || "Nu ai setat un obiectiv inca."}
          </Text>
          <Text className="text-text-muted text-sm mt-2">
            Status: {STATUS_LABELS[clientProfile?.status || "ACTIVE"]}
          </Text>
          {clientProfile?.status !== "COMPLETED" ? (
            <Button
              label="Marchează obiectiv atins"
              variant="outline"
              iconName="trophy-outline"
              onPress={handleCompleteObjective}
              className="mt-3"
              loading={updateMyProfile.isPending}
              disabled={updateMyProfile.isPending}
            />
          ) : null}
        </SectionCard>

        <SectionCard title="Informații onboarding" icon="clipboard-outline">
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Vârstă</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {clientProfile?.age ? `${clientProfile.age} ani` : "-"}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Înălțime</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {clientProfile?.height ? `${clientProfile.height} cm` : "-"}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Greutate</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {clientProfile?.weight ? `${clientProfile.weight} kg` : "-"}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Sesiuni / săpt.</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {clientProfile?.recommendedSessionsPerWeek || "-"}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary text-sm">Timezone</Text>
              <Text className="text-text-primary text-sm font-semibold">
                {clientProfile?.timezone || "UTC"}
              </Text>
            </View>
            <Button
              label="Editează datele"
              variant="outline"
              iconName="create-outline"
              onPress={() => router.push("/profile/edit")}
              className="mt-2"
            />
          </View>
        </SectionCard>

        <SectionCard title="Nutritie" icon="leaf-outline">
          <View className="bg-background border border-border rounded-xl p-4 mb-3">
            <Text className="text-text-secondary text-xs uppercase tracking-wider">
              Tinte
            </Text>
            <Text className="text-text-primary text-sm mt-2">
              Proteine: {todayQuery.data?.nutritionSettings?.proteinTargetPerDay || 0} g / zi
            </Text>
            <Text className="text-text-primary text-sm mt-1">
              Apa: {todayQuery.data?.nutritionSettings?.waterTargetMlPerDay || 0} ml / zi
            </Text>
          </View>

          <View className="bg-background border border-border rounded-xl p-4 mb-3">
            <Text className="text-text-secondary text-xs uppercase tracking-wider">
              Obiectiv saptamanal
            </Text>
            <Text className="text-text-primary text-sm mt-2">
              {todayQuery.data?.nutritionSettings?.weeklyGoal1 || "-"}
            </Text>
          </View>

          <View className="bg-background border border-border rounded-xl p-4 mb-3">
            <Text className="text-text-secondary text-xs uppercase tracking-wider">
              Tips pinned
            </Text>
            {pinnedTips.length ? (
              pinnedTips.map((tip, idx) => (
                <View key={`${tip}-${idx}`} className="flex-row items-start gap-2 mt-2">
                  <Ionicons name="pin-outline" size={14} color="#f4b86b" />
                  <Text className="text-text-primary text-sm flex-1">{tip}</Text>
                </View>
              ))
            ) : (
              <Text className="text-text-muted text-sm mt-2">Nu exista tips-uri pin.</Text>
            )}
          </View>

          <View className="bg-background border border-border rounded-xl p-4">
            <Text className="text-text-secondary text-xs uppercase tracking-wider">
              Idei de mese
            </Text>
            <Button
              label="Genereaza idei pentru azi"
              variant="outline"
              onPress={handleGenerateMeals}
              className="mt-3"
              loading={mealIdeasAi.isPending}
              disabled={mealIdeasAi.isPending}
              iconName="sparkles-outline"
            />
            {generatedMeals.length ? (
              <View className="mt-3 gap-2">
                {generatedMeals.map((meal, idx) => (
                  <Text key={`${meal}-${idx}`} className="text-text-primary text-sm">
                    • {meal}
                  </Text>
                ))}
              </View>
            ) : mealIdeasQuery.data?.length ? (
              <View className="mt-3 gap-2">
                {mealIdeasQuery.data.slice(0, 3).map((meal) => (
                  <Text key={meal.id} className="text-text-primary text-sm">
                    • {meal.title}
                  </Text>
                ))}
              </View>
            ) : (
              <Text className="text-text-muted text-sm mt-3">Nu exista idei salvate.</Text>
            )}
          </View>
        </SectionCard>

        <SectionCard title="Notificari" icon="notifications-outline">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-text-secondary text-sm">Reminder antrenament</Text>
            <Switch
              value={pushSessionReminders && pushEnabled}
              onValueChange={(value) => handleTogglePushSetting("pushSessionReminders", value)}
              disabled={!pushEnabled}
              thumbColor="#f798af"
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-secondary text-sm">Tips nutritie</Text>
            <Switch
              value={pushDailyTips && pushEnabled}
              onValueChange={(value) => handleTogglePushSetting("pushDailyTips", value)}
              disabled={!pushEnabled}
              thumbColor="#f798af"
            />
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-text-secondary text-sm">Mesaj săptămânal</Text>
            <Switch
              value={pushWeeklyMessage && pushEnabled}
              onValueChange={(value) => handleTogglePushSetting("pushWeeklyMessage", value)}
              disabled={!pushEnabled}
              thumbColor="#f798af"
            />
          </View>
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-text-secondary text-sm">Notificări push</Text>
            <Switch
              value={pushEnabled}
              onValueChange={handleTogglePush}
              thumbColor="#f798af"
            />
          </View>
        </SectionCard>

        <SectionCard title="Mesaj saptamanal" icon="sparkles-outline">
          {weeklyFeedbackQuery.isLoading ? (
            <Text className="text-text-muted text-sm">Generam feedback-ul...</Text>
          ) : (
            <Text className="text-text-primary text-sm leading-6">{weeklyMessage}</Text>
          )}
        </SectionCard>

        <Button
          label="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          iconName="log-out-outline"
          fullWidth
          className="mb-10"
        />
      </View>
      <CongratsOverlay
        visible={showCongrats}
        message={congratsMessage}
        onDone={() => setShowCongrats(false)}
      />
    </ScrollView>
  );
}

function TrainerProfileScreen({ userRole }: { userRole: UserRole | null }) {
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
          <View className="p-4 flex-row items-center justify-between border-b border-border">
            <View>
              <Text className="text-text-primary text-base font-medium mb-1">
                Notifications
              </Text>
              <Text className="text-text-muted text-xs">Manage your notifications</Text>
            </View>
            <Text className="text-primary">→</Text>
          </View>

          <View className="p-4 flex-row items-center justify-between border-b border-border">
            <View>
              <Text className="text-text-primary text-base font-medium mb-1">
                Privacy & Security
              </Text>
              <Text className="text-text-muted text-xs">
                Control your privacy settings
              </Text>
            </View>
            <Text className="text-primary">→</Text>
          </View>

          <View className="p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-text-primary text-base font-medium mb-1">
                Help & Support
              </Text>
              <Text className="text-text-muted text-xs">Get help and support</Text>
            </View>
            <Text className="text-primary">→</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <Button
          label="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          iconName="log-out-outline"
          fullWidth
          className="mb-10"
        />
      </View>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const userRole = useUserRole() ?? null;

  if (userRole === "CLIENT") {
    return <ClientProfileScreen />;
  }

  return <TrainerProfileScreen userRole={userRole} />;
}
