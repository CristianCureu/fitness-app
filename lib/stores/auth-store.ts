import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { authApi, userApi } from '../api/endpoints';
import { supabase } from '../supabase';
import type { AppUser } from '../types/api';

interface AuthState {
  session: Session | null;
  supabaseUser: User | null;

  appUser: AppUser | null;

  isLoading: boolean;
  isInitialized: boolean;

  setSession: (session: Session | null) => void;
  setAppUser: (user: AppUser | null) => void;
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ requiresEmailVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  supabaseUser: null,
  appUser: null,
  isLoading: false,
  isInitialized: false,

  setSession: (session) => {
    set({
      session,
      supabaseUser: session?.user ?? null
    });
  },

  setAppUser: (user) => {
    set({ appUser: user });
  },

  /**
   * Initialize auth state from stored session
   * Call this on app startup
   */
  initialize: async () => {
    try {
      set({ isLoading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        set({
          session,
          supabaseUser: session.user
        });

        // Fetch app user from backend
        try {
          const appUser = await userApi.getMe();
          set({ appUser });
        } catch (error) {
          console.error('Failed to fetch app user:', error);
          // Session exists but app user doesn't - might need to register
        }
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({
          session,
          supabaseUser: session?.user ?? null
        });

        if (session) {
          try {
            const appUser = await userApi.getMe();
            set({ appUser });
          } catch (error) {
            console.error('Failed to fetch app user:', error);
            set({ appUser: null });
          }
        } else {
          set({ appUser: null });
        }
      });

      set({ isInitialized: true });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Sign up with email and password
   * Then register with backend
   */
  signUp: async (email, password) => {
    try {
      set({ isLoading: true });

      // Sign up with Supabase (Supabase sends verification email automatically if enabled)
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        // Check for specific Supabase errors
        if (error.message.includes('already registered')) {
          throw new Error('A user with this email already exists');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('Failed to create account. Please try again.');
      }

      // Register with backend immediately, regardless of email verification status
      const appUser = await authApi.register({
        authId: data.user.id,
      });

      // If we got a session, user can sign in immediately (email verification disabled)
      if (data.session) {
        set({
          session: data.session,
          supabaseUser: data.user,
          appUser,
        });

        return { requiresEmailVerification: false };
      }

      // No session = email verification required
      // User is registered in backend but can't access app until they verify email
      // When they click the verification link, onAuthStateChange will handle the session
      // Supabase has already sent the email, just return success
      return { requiresEmailVerification: true };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Sign in with email and password
   * Then fetch/register with backend if needed
   */
  signIn: async (email, password) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        session: data.session,
        supabaseUser: data.user,
      });

      try {
        const appUser = await userApi.getMe();
        set({ appUser });
      } catch (error: any) {
        // If app user doesn't exist, register them
        if (error.statusCode === 404 || error.statusCode === 401) {
          const appUser = await authApi.register({
            authId: data.user.id,
          });
          set({ appUser });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      // OAuth flow continues in browser
      // Session will be handled by onAuthStateChange listener
    } catch (error) {
      console.error('Google sign in error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        session: null,
        supabaseUser: null,
        appUser: null,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      const appUser = await userApi.getMe();
      set({ appUser });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  },
}));

export const useSession = () => useAuthStore((state) => state.session);
export const useSupabaseUser = () => useAuthStore((state) => state.supabaseUser);
export const useAppUser = () => useAuthStore((state) => state.appUser);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.session);
export const useUserRole = () => useAuthStore((state) => state.appUser?.role);
export const useIsClient = () => useAuthStore((state) => state.appUser?.role === 'CLIENT');
export const useIsTrainer = () => useAuthStore((state) => state.appUser?.role === 'TRAINER');
