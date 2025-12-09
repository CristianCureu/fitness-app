import { Stack } from "expo-router";

export default function ClientsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F111A" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="[id]/client-view"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
