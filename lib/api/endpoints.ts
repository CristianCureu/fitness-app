import type {
  AppUser,
  CheckinQueryParams,
  ClientProfile,
  CompleteOnboardingRequest,
  CreateCheckinDto,
  CreateClientProfileDto,
  CreateInviteRequest,
  CreateNutritionGoalDto,
  CreateRecommendationDto,
  CreateSessionDto,
  DailyCheckin,
  DailyRecommendation,
  InviteCode,
  NutritionGoal,
  NutritionGoalQueryParams,
  OnboardingStatus,
  RecommendationQueryParams,
  RegisterRequest,
  ScheduledSession,
  SessionQueryParams,
  TodayView,
  UserRole,
  ValidateInviteRequest,
  ValidateInviteResponse,
} from '../types/api';
import { api } from './client';

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const authApi = {
  /**
   * Register user with backend after Supabase authentication
   * Must be called after successful Supabase sign up/sign in
   */
  register: (data: RegisterRequest) =>
    api.post<AppUser>('/auth/register', data),
};

export const userApi = {
  getMe: () =>
    api.get<AppUser>('/users/me'),

  /**
   * Update user role (TRAINER only)
   */
  updateRole: (userId: string, role: UserRole) =>
    api.patch<AppUser>(`/users/${userId}/role`, { role }),
};

export const clientApi = {
  /**
   * Create client profile (TRAINER only)
   */
  create: (data: CreateClientProfileDto) =>
    api.post<ClientProfile>('/clients', data),

  /**
   * Get all clients
   * TRAINER: all their clients
   * CLIENT: just themselves
   */
  getAll: () =>
    api.get<ClientProfile[]>('/clients'),

  /**
   * Get single client by ID
   */
  getById: (id: string) =>
    api.get<ClientProfile>(`/clients/${id}`),

  /**
   * Update client profile (TRAINER only)
   */
  update: (id: string, data: Partial<CreateClientProfileDto>) =>
    api.patch<ClientProfile>(`/clients/${id}`, data),

  /**
   * Delete client (TRAINER only)
   */
  delete: (id: string) =>
    api.delete<void>(`/clients/${id}`),
};


export const scheduleApi = {
  /**
   * Create session (TRAINER only)
   */
  createSession: (data: CreateSessionDto) =>
    api.post<ScheduledSession>('/schedule/sessions', data),

  /**
   * Get all sessions (filtered by role)
   * TRAINER: sees all their clients' sessions
   * CLIENT: only sees their own sessions
   */
  getSessions: (params?: SessionQueryParams) =>
    api.get<ScheduledSession[]>(`/schedule/sessions${buildQueryString(params || {})}`),

  /**
   * Update session (TRAINER only)
   */
  updateSession: (id: string, data: Partial<CreateSessionDto>) =>
    api.patch<ScheduledSession>(`/schedule/sessions/${id}`, data),

  /**
   * Delete session (TRAINER only)
   */
  deleteSession: (id: string) =>
    api.delete<void>(`/schedule/sessions/${id}`),
};


export const todayApi = {
  /**
   * Get aggregated "Today" view (CLIENT only)
   * Returns next session, daily recommendation, check-in, nutrition goal, and client info
   */
  getToday: () =>
    api.get<TodayView>('/today'),
};


export const checkinApi = {
  /**
   * Upsert today's check-in (CLIENT only)
   * Creates or updates check-in for today
   */
  upsertToday: (data: CreateCheckinDto) =>
    api.post<DailyCheckin>('/checkins/today', data),

  /**
   * Get all check-ins
   * TRAINER: can query any client's check-ins
   * CLIENT: only sees their own
   */
  getAll: (params?: CheckinQueryParams) =>
    api.get<DailyCheckin[]>(`/checkins${buildQueryString(params || {})}`),

  /**
   * Get single check-in by ID
   */
  getById: (id: string) =>
    api.get<DailyCheckin>(`/checkins/${id}`),

  /**
   * Update check-in (CLIENT and TRAINER)
   */
  update: (id: string, data: Partial<CreateCheckinDto>) =>
    api.patch<DailyCheckin>(`/checkins/${id}`, data),

  /**
   * Delete check-in (CLIENT and TRAINER)
   */
  delete: (id: string) =>
    api.delete<void>(`/checkins/${id}`),
};

// ============================================================================
// RECOMMENDATION ENDPOINTS
// ============================================================================

export const recommendationApi = {
  /**
   * Create daily recommendation (TRAINER only)
   */
  create: (data: CreateRecommendationDto) =>
    api.post<DailyRecommendation>('/recommendations', data),

  /**
   * Get today's recommendation (CLIENT only)
   */
  getToday: () =>
    api.get<DailyRecommendation>('/recommendations/today'),

  /**
   * Get all recommendations
   * TRAINER: can query any client's recommendations
   * CLIENT: only sees their own
   */
  getAll: (params?: RecommendationQueryParams) =>
    api.get<DailyRecommendation[]>(`/recommendations${buildQueryString(params || {})}`),

  /**
   * Update recommendation (TRAINER only)
   */
  update: (id: string, data: Partial<CreateRecommendationDto>) =>
    api.patch<DailyRecommendation>(`/recommendations/${id}`, data),

  /**
   * Delete recommendation (TRAINER only)
   */
  delete: (id: string) =>
    api.delete<void>(`/recommendations/${id}`),
};

// ============================================================================
// NUTRITION ENDPOINTS
// ============================================================================

export const nutritionApi = {
  /**
   * Create nutrition goal (TRAINER only)
   */
  createGoal: (data: CreateNutritionGoalDto) =>
    api.post<NutritionGoal>('/nutrition/goals', data),

  /**
   * Get current week's nutrition goal (CLIENT only)
   */
  getCurrentGoal: () =>
    api.get<NutritionGoal>('/nutrition/goals/current'),

  /**
   * Get all nutrition goals
   * TRAINER: can query any client's goals
   * CLIENT: only sees their own
   */
  getAll: (params?: NutritionGoalQueryParams) =>
    api.get<NutritionGoal[]>(`/nutrition/goals${buildQueryString(params || {})}`),

  /**
   * Update nutrition goal (TRAINER only)
   */
  update: (id: string, data: Partial<CreateNutritionGoalDto>) =>
    api.patch<NutritionGoal>(`/nutrition/goals/${id}`, data),

  /**
   * Delete nutrition goal (TRAINER only)
   */
  delete: (id: string) =>
    api.delete<void>(`/nutrition/goals/${id}`),
};

// ============================================================================
// ONBOARDING ENDPOINTS
// ============================================================================

export const onboardingApi = {
  /**
   * Get onboarding status (CLIENT only)
   */
  getStatus: () =>
    api.get<OnboardingStatus>('/onboarding/status'),

  /**
   * Validate invite code before completing onboarding (CLIENT only)
   */
  validateInvite: (data: ValidateInviteRequest) =>
    api.post<ValidateInviteResponse>('/onboarding/validate-invite', data),

  /**
   * Complete onboarding with invite code (CLIENT only)
   */
  complete: (data: CompleteOnboardingRequest) =>
    api.post<{ message: string; profile: ClientProfile }>('/onboarding/complete', data),
};

// ============================================================================
// INVITE CODE ENDPOINTS (TRAINER only)
// ============================================================================

export const inviteApi = {
  /**
   * Create invite code (TRAINER only)
   */
  create: (data: CreateInviteRequest) =>
    api.post<InviteCode>('/invites', data),

  /**
   * Get all invite codes (TRAINER only)
   */
  getAll: () =>
    api.get<{ invites: InviteCode[] }>('/invites'),

  /**
   * Get single invite code by ID (TRAINER only)
   */
  getById: (id: string) =>
    api.get<InviteCode>(`/invites/${id}`),

  /**
   * Delete invite code (TRAINER only)
   */
  delete: (id: string) =>
    api.delete<{ message: string }>(`/invites/${id}`),
};