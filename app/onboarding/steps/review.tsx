import OnboardingWrapper from "@/components/onboarding-wrapper";
import { Button } from "@/components/ui/button";
import { useCompleteOnboarding } from "@/lib/hooks/queries/use-onboarding";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import type { CompleteOnboardingRequest } from "@/lib/types/api";
import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";

export default function ReviewStep() {
  const data = useOnboardingStore((state) => state.data);
  const previousStep = useOnboardingStore((state) => state.previousStep);
  const reset = useOnboardingStore((state) => state.reset);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const completeOnboardingMutation = useCompleteOnboarding();

  const handleSubmit = () => {
    const payload: CompleteOnboardingRequest = {
      inviteCode: data.inviteCode,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      height: data.height,
      weight: data.weight,
      goalDescription: data.goalDescription,
      preferredSessionsPerWeek: data.preferredSessionsPerWeek,
    };

    completeOnboardingMutation.mutate(payload, {
      onSuccess: async () => {
        // Refresh user data to get the updated profile
        await refreshUser();

        // Reset onboarding store
        reset();

        // Navigate to main app
        router.replace("/(tabs)");
      },
      onError: (error) => {
        Alert.alert(
          "Onboarding Failed",
          error.message || "Failed to complete onboarding. Please try again."
        );
      },
    });
  };

  return (
    <OnboardingWrapper
      currentStep={5}
      title="Review & Submit"
      description="Please review your information before submitting"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Invite Code Section */}
        <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <Text className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Invite Code
          </Text>
          <Text className="text-text-primary text-base font-semibold">
            {data.inviteCode}
          </Text>
        </View>

        {/* Personal Info Section */}
        <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <Text className="text-text-muted text-xs uppercase tracking-wider mb-3">
            Personal Information
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between py-2">
              <Text className="text-text-secondary">Name</Text>
              <Text className="text-text-primary font-medium">
                {data.firstName} {data.lastName}
              </Text>
            </View>
            {data.age && (
              <View className="flex-row justify-between py-2 border-t border-border/50">
                <Text className="text-text-secondary">Age</Text>
                <Text className="text-text-primary font-medium">{data.age} years</Text>
              </View>
            )}
          </View>
        </View>

        {/* Body Metrics Section */}
        {(data.height || data.weight) && (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
            <Text className="text-text-muted text-xs uppercase tracking-wider mb-3">
              Body Metrics
            </Text>
            <View className="space-y-2">
              {data.height && (
                <View className="flex-row justify-between py-2">
                  <Text className="text-text-secondary">Height</Text>
                  <Text className="text-text-primary font-medium">{data.height} cm</Text>
                </View>
              )}
              {data.weight && (
                <View className="flex-row justify-between py-2 border-t border-border/50">
                  <Text className="text-text-secondary">Weight</Text>
                  <Text className="text-text-primary font-medium">{data.weight} kg</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Fitness Goals Section */}
        {(data.goalDescription || data.preferredSessionsPerWeek) && (
          <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
            <Text className="text-text-muted text-xs uppercase tracking-wider mb-3">
              Fitness Goals
            </Text>
            <View className="space-y-2">
              {data.goalDescription && (
                <View className="py-2">
                  <Text className="text-text-secondary text-xs mb-1">Goals</Text>
                  <Text className="text-text-primary leading-6">
                    {data.goalDescription}
                  </Text>
                </View>
              )}
              {data.preferredSessionsPerWeek && (
                <View className="py-2 border-t border-border/50">
                  <Text className="text-text-secondary">Preferred Sessions/Week</Text>
                  <Text className="text-text-primary font-medium">
                    {data.preferredSessionsPerWeek} sessions
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Buttons */}
        <View className="flex-row gap-3 mt-6 mb-4">
          <Button
            label="Back"
            onPress={previousStep}
            variant="outline"
            disabled={completeOnboardingMutation.isPending}
            iconName="arrow-back-outline"
            className="flex-1"
          />
          <Button
            label="Complete"
            onPress={handleSubmit}
            loading={completeOnboardingMutation.isPending}
            iconName="checkmark-circle-outline"
            className="flex-1"
          />
        </View>
      </ScrollView>
    </OnboardingWrapper>
  );
}
