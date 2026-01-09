import OnboardingWrapper from "@/components/onboarding-wrapper";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useValidateInvite } from "@/lib/hooks/queries/use-onboarding";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";

interface InviteCodeForm {
  inviteCode: string;
}

export default function InviteCodeStep() {
  const setInviteCode = useOnboardingStore((state) => state.setInviteCode);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const validateInviteMutation = useValidateInvite();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteCodeForm>({
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = (data: InviteCodeForm) => {
    const formattedCode = data.inviteCode.toUpperCase().trim();

    validateInviteMutation.mutate(
      { inviteCode: formattedCode },
      {
        onSuccess: (validationResult) => {
          if (!validationResult.valid) {
            Alert.alert(
              "Invalid Invite Code",
              validationResult.message || "Please check your code and try again"
            );
            return;
          }

          // Store the invite code and validation data in the store
          setInviteCode(formattedCode, validationResult);

          // Move to next step
          nextStep();
        },
        onError: (error) => {
          Alert.alert(
            "Validation Error",
            error.message || "Failed to validate invite code. Please try again."
          );
        },
      }
    );
  };

  return (
    <OnboardingWrapper
      currentStep={1}
      title="Welcome!"
      description="Enter your invite code to get started"
    >
      {/* Info Box */}
      <View className="bg-surface/50 border border-border rounded-2xl p-4 mb-8">
        <Text className="text-text-secondary text-sm leading-6">
          Your trainer should have provided you with an invite code. It looks like:{" "}
          <Text className="text-primary font-semibold">TRAIN-ABC123</Text>
        </Text>
      </View>

      {/* Form */}
      <View>
        {/* Invite Code Input */}
        <Controller
          control={control}
          name="inviteCode"
          rules={{
            required: "Invite code is required",
            pattern: {
              value: /^TRAIN-[A-Z0-9]{6}$/i,
              message: "Invalid format. Should be TRAIN-XXXXXX",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="INVITE CODE"
              placeholder="TRAIN-ABC123"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!validateInviteMutation.isPending}
              error={errors.inviteCode?.message}
              containerClassName="mb-6"
            />
          )}
        />

        {/* Continue Button */}
        <Button
          label="Continue"
          onPress={handleSubmit(onSubmit)}
          loading={validateInviteMutation.isPending}
          iconName="arrow-forward-outline"
          fullWidth
          className="mt-5"
        />
      </View>

      {/* Help Text */}
      <View className="mt-8">
        <Text className="text-text-muted text-sm text-center">
          Don't have an invite code?{"\n"}
          Contact your trainer to get one.
        </Text>
      </View>
    </OnboardingWrapper>
  );
}
