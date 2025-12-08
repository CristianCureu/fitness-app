import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const session = useAuthStore((state) => state.session);
  const appUser = useAuthStore((state) => state.appUser);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    // 1. Not signed in → redirect to auth
    if (!session && !inAuthGroup) {
      router.replace('/auth/sign-in');
      return;
    }

    // 2. Signed in but on auth screen → check onboarding status
    if (session && inAuthGroup) {
      // Check if user needs onboarding (CLIENT only)
      if (appUser?.role === 'CLIENT' && !appUser.clientProfile?.onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    // 3. Signed in, has appUser, CLIENT needs onboarding
    if (
      session &&
      appUser?.role === 'CLIENT' &&
      !appUser.clientProfile?.onboardingCompleted &&
      !inOnboardingGroup
    ) {
      router.replace('/onboarding');
      return;
    }

    // 4. Signed in, completed onboarding (or TRAINER), but still on onboarding screen
    if (
      session &&
      inOnboardingGroup &&
      (appUser?.role === 'TRAINER' ||
        (appUser?.role === 'CLIENT' && appUser.clientProfile?.onboardingCompleted))
    ) {
      router.replace('/(tabs)');
      return;
    }
  }, [session, appUser, segments, isInitialized, router]);

  return { isInitialized, session, appUser };
}