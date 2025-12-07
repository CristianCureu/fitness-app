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
    all: () => ['clients'] as const,
    detail: (id: string) => ['clients', id] as const,
  },

  // Sessions
  sessions: {
    all: (params?: SessionQueryParams) => ['sessions', params] as const,
    detail: (id: string) => ['sessions', id] as const,
  },

  // Check-ins
  checkins: {
    all: (params?: CheckinQueryParams) => ['checkins', params] as const,
    detail: (id: string) => ['checkins', id] as const,
    today: () => ['checkins', 'today'] as const,
  },

  // Recommendations
  recommendations: {
    all: (params?: RecommendationQueryParams) => ['recommendations', params] as const,
    detail: (id: string) => ['recommendations', id] as const,
    today: () => ['recommendations', 'today'] as const,
  },

  // Nutrition
  nutrition: {
    all: (params?: NutritionGoalQueryParams) => ['nutrition', params] as const,
    detail: (id: string) => ['nutrition', id] as const,
    current: () => ['nutrition', 'current'] as const,
  },
} as const;