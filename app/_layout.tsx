import { LoadingScreen } from "@/components/loading-screen";
import { useProtectedRoute } from "@/lib/hooks/use-protected-route";
import { ReactQueryProvider } from "@/lib/providers/react-query-provider";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

function RootLayoutNav() {
  const { isInitialized } = useProtectedRoute();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="session" />
    </Stack>
  );
}

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReactQueryProvider>
        <RootLayoutNav />
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}
