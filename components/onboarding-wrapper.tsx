import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

interface OnboardingWrapperProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
  title: string;
  description: string;
  showStepIndicator?: boolean;
}

export default function OnboardingWrapper({
  children,
  currentStep,
  totalSteps = 5,
  title,
  description,
  showStepIndicator = true,
}: OnboardingWrapperProps) {
  return (
    <LinearGradient
      colors={["#0F111A", "#131625", "#181C33"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-14"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-text-primary mb-3">{title}</Text>
            <Text className="text-base text-text-secondary leading-6">{description}</Text>
          </View>

          {/* Step Indicator */}
          {showStepIndicator && (
            <View className="flex-row items-center justify-center mb-8">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <View
                  key={step}
                  className={`h-2 rounded-full mx-1 transition-all ${
                    step === currentStep
                      ? "w-8 bg-primary"
                      : step < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-border"
                  }`}
                />
              ))}
            </View>
          )}

          {/* Content */}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
