import OnboardingWrapper from "@/components/onboarding-wrapper";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

interface FitnessGoalsForm {
  goalDescription?: string;
  preferredSessionsPerWeek?: string;
}

export default function FitnessGoalsStep() {
  const data = useOnboardingStore((state) => state.data);
  const setFitnessGoals = useOnboardingStore((state) => state.setFitnessGoals);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const previousStep = useOnboardingStore((state) => state.previousStep);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FitnessGoalsForm>({
    defaultValues: {
      goalDescription: data.goalDescription || "",
      preferredSessionsPerWeek: data.preferredSessionsPerWeek?.toString() || "",
    },
  });

  const onSubmit = (formData: FitnessGoalsForm) => {
    setFitnessGoals(
      formData.goalDescription?.trim(),
      formData.preferredSessionsPerWeek
        ? parseInt(formData.preferredSessionsPerWeek, 10)
        : undefined
    );
    nextStep();
  };

  return (
    <OnboardingWrapper
      currentStep={4}
      title="Fitness Goals"
      description="What are you working towards?"
    >
      <View>
        {/* Goal Description */}
        <Controller
          control={control}
          name="goalDescription"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="YOUR FITNESS GOALS"
              placeholder="E.g., Lose weight, build muscle, get stronger..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              error={errors.goalDescription?.message}
              containerClassName="mb-4"
            />
          )}
        />

        {/* Preferred Sessions Per Week */}
        <Controller
          control={control}
          name="preferredSessionsPerWeek"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const sessions = parseInt(value, 10);
              if (isNaN(sessions)) return "Must be a valid number";
              if (sessions < 1 || sessions > 7)
                return "Must be between 1 and 7 sessions";
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="PREFERRED SESSIONS PER WEEK"
              placeholder="3"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              error={errors.preferredSessionsPerWeek?.message}
              containerClassName="mb-6"
            />
          )}
        />

        {/* Info Box */}
        <View className="bg-surface/50 border border-border rounded-2xl p-4 mb-6">
          <Text className="text-text-secondary text-sm leading-6">
            Your trainer will use this information to create a personalized program
            tailored to your goals and availability.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-4">
          <Button
            label="Back"
            onPress={previousStep}
            variant="outline"
            iconName="arrow-back-outline"
            className="flex-1"
          />
          <Button
            label="Continue"
            onPress={handleSubmit(onSubmit)}
            iconName="arrow-forward-outline"
            className="flex-1"
          />
        </View>

        {/* Skip Option */}
        <View className="mt-4">
          <Button
            label="Skip for now"
            onPress={() => {
              setFitnessGoals(undefined, undefined);
              nextStep();
            }}
            variant="ghost"
            iconName="play-skip-forward-outline"
            fullWidth
          />
        </View>
      </View>
    </OnboardingWrapper>
  );
}
