import OnboardingWrapper from "@/components/onboarding-wrapper";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

interface BodyMetricsForm {
  height?: string;
  weight?: string;
}

export default function BodyMetricsStep() {
  const data = useOnboardingStore((state) => state.data);
  const setBodyMetrics = useOnboardingStore((state) => state.setBodyMetrics);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const previousStep = useOnboardingStore((state) => state.previousStep);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyMetricsForm>({
    defaultValues: {
      height: data.height?.toString() || "",
      weight: data.weight?.toString() || "",
    },
  });

  const onSubmit = (formData: BodyMetricsForm) => {
    setBodyMetrics(
      formData.height ? parseFloat(formData.height) : undefined,
      formData.weight ? parseFloat(formData.weight) : undefined
    );
    nextStep();
  };

  return (
    <OnboardingWrapper
      currentStep={3}
      title="Body Metrics"
      description="Help us track your progress"
    >
      <View>
        {/* Info Text */}
        <View className="bg-surface/50 border border-border rounded-2xl p-4 mb-6">
          <Text className="text-text-secondary text-sm leading-6">
            These measurements are optional but will help your trainer track your progress
            more effectively.
          </Text>
        </View>

        {/* Height */}
        <Controller
          control={control}
          name="height"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const height = parseFloat(value);
              if (isNaN(height)) return "Must be a valid number";
              if (height < 100 || height > 250)
                return "Must be between 100 and 250 cm";
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="HEIGHT (cm)"
              placeholder="175"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              error={errors.height?.message}
              containerClassName="mb-4"
            />
          )}
        />

        {/* Weight */}
        <Controller
          control={control}
          name="weight"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const weight = parseFloat(value);
              if (isNaN(weight)) return "Must be a valid number";
              if (weight < 30 || weight > 300)
                return "Must be between 30 and 300 kg";
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="WEIGHT (kg)"
              placeholder="70"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="decimal-pad"
              error={errors.weight?.message}
              containerClassName="mb-6"
            />
          )}
        />

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
              setBodyMetrics(undefined, undefined);
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
