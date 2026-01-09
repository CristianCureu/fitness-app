import OnboardingWrapper from "@/components/onboarding-wrapper";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  age?: string;
}

export default function PersonalInfoStep() {
  const data = useOnboardingStore((state) => state.data);
  const setPersonalInfo = useOnboardingStore((state) => state.setPersonalInfo);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const previousStep = useOnboardingStore((state) => state.previousStep);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoForm>({
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      age: data.age?.toString() || "",
    },
  });

  const onSubmit = (formData: PersonalInfoForm) => {
    setPersonalInfo(
      formData.firstName.trim(),
      formData.lastName.trim(),
      formData.age ? parseInt(formData.age, 10) : undefined
    );
    nextStep();
  };

  return (
    <OnboardingWrapper
      currentStep={2}
      title="Personal Information"
      description="Tell us a bit about yourself"
    >
      <View>
        {/* First Name */}
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="FIRST NAME *"
              placeholder="John"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              error={errors.firstName?.message}
              containerClassName="mb-4"
            />
          )}
        />

        {/* Last Name */}
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="LAST NAME *"
              placeholder="Doe"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              error={errors.lastName?.message}
              containerClassName="mb-4"
            />
          )}
        />

        {/* Age (Optional) */}
        <Controller
          control={control}
          name="age"
          rules={{
            validate: (value) => {
              if (!value) return true;
              const age = parseInt(value, 10);
              if (isNaN(age)) return "Must be a valid number";
              if (age < 13 || age > 120) return "Must be between 13 and 120";
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="AGE (Optional)"
              placeholder="25"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              error={errors.age?.message}
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
      </View>
    </OnboardingWrapper>
  );
}
