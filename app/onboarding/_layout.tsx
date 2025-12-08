import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false, // Prevent back gesture during onboarding
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
