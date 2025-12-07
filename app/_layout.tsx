import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ReactQueryProvider } from '@/lib/providers/react-query-provider';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useProtectedRoute } from '@/lib/hooks/use-protected-route';
import { LoadingScreen } from '@/components/loading-screen';
import '../global.css';

function RootLayoutNav() {
  const { isInitialized } = useProtectedRoute();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
    </Stack>
  );
}

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <ReactQueryProvider>
      <RootLayoutNav />
    </ReactQueryProvider>
  );
}
