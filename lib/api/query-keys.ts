import type {
  SessionQueryParams,
  CheckinQueryParams,
  RecommendationQueryParams,
  NutritionGoalQueryParams,
} from '../types/api';

export const queryKeys = {
  // Auth-related queries
  auth: {
    session: () => ['auth', 'session'] as const,
    user: () => ['auth', 'user'] as const,
  },

  // Today view (CLIENT only)
  today: {
    all: () => ['today'] as const,
  },

  // Client profiles
  clients: {
    all: (params?: { search?: string; status?: string; offset?: number; limit?: number }) =>
      params ? ['clients', params] as const : ['clients'] as const,
    detail: (id: string) => ['clients', id] as const,
  },

  // Sessions
  sessions: {
    all: (params?: SessionQueryParams) =>
      params ? ['sessions', params] as const : ['sessions'] as const,
    detail: (id: string) => ['sessions', id] as const,
  },

  // Programs
  programs: {
    all: () => ['programs'] as const,
    detail: (id: string) => ['programs', id] as const,
  },

  clientPrograms: {
    active: (clientId: string) => ['clients', clientId, 'program'] as const,
  },

  programInsights: {
    recommendations: (clientId: string) => ['clients', clientId, 'program', 'recommendations'] as const,
    history: (clientId: string) => ['clients', clientId, 'program', 'history'] as const,
  },

  // Check-ins
  checkins: {
    all: (params?: CheckinQueryParams) =>
      params ? ['checkins', params] as const : ['checkins'] as const,
    detail: (id: string) => ['checkins', id] as const,
    today: () => ['checkins', 'today'] as const,
  },

  // Recommendations
  recommendations: {
    all: (params?: RecommendationQueryParams) =>
      params ? ['recommendations', params] as const : ['recommendations'] as const,
    detail: (id: string) => ['recommendations', id] as const,
    today: () => ['recommendations', 'today'] as const,
  },

  // Nutrition
  nutrition: {
    all: (params?: NutritionGoalQueryParams) =>
      params ? ['nutrition', params] as const : ['nutrition'] as const,
    detail: (id: string) => ['nutrition', id] as const,
    current: () => ['nutrition', 'current'] as const,
  },

  // Onboarding
  onboarding: {
    status: () => ['onboarding', 'status'] as const,
  },

  // Users
  users: {
    me: () => ['users', 'me'] as const,
  },

  // Invite codes (TRAINER only)
  invites: {
    all: () => ['invites'] as const,
    detail: (id: string) => ['invites', id] as const,
  },
} as const;
