import { useAuthStore } from '../stores/auth-store';
import { useCallback } from 'react';

/**
 * Hook for authentication actions and state
 */
export function useAuth() {
  const {
    session,
    supabaseUser,
    appUser,
    isLoading,
    isInitialized,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshUser,
  } = useAuthStore();

  const isAuthenticated = !!session;
  const role = appUser?.role;
  const isClient = role === 'CLIENT';
  const isTrainer = role === 'TRAINER';

  return {
    // State
    session,
    supabaseUser,
    appUser,
    isLoading,
    isInitialized,
    isAuthenticated,
    role,
    isClient,
    isTrainer,

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshUser,
  };
}

/**
 * Hook that requires authentication
 * Throws error if not authenticated
 */
export function useRequireAuth() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    throw new Error('Authentication required');
  }

  return auth;
}

/**
 * Hook that requires CLIENT role
 */
export function useRequireClient() {
  const auth = useRequireAuth();

  if (!auth.isClient) {
    throw new Error('CLIENT role required');
  }

  return auth;
}

/**
 * Hook that requires TRAINER role
 */
export function useRequireTrainer() {
  const auth = useRequireAuth();

  if (!auth.isTrainer) {
    throw new Error('TRAINER role required');
  }

  return auth;
}
