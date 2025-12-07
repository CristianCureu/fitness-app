import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const session = useAuthStore((state) => state.session);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // User is not signed in but not on auth screen - redirect to sign in
      router.replace('../auth/sign-in');
    } else if (session && inAuthGroup) {
      // User is signed in but still on auth screen - redirect to app
      router.replace('../(tabs)');
    }
  }, [session, segments, isInitialized, router]);

  return { isInitialized, session };
}