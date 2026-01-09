import type {
  AppUser,
  CheckinQueryParams,
  ClientProfile,
  CompleteOnboardingRequest,
  CreateCheckinDto,
  CreateClientProfileDto,
  CreateInviteRequest,
  CreateClientSessionDto,
  CreateNutritionGoalDto,
  CreateNutritionSettingsDto,
  CreateNutritionTipDto,
  CreateMealIdeaDto,
  AssignProgramRequest,
  CreateProgramRequest,
  CreateRecommendationDto,
  CreateSessionDto,
  ClientProgram,
  ClientSessionRecommendation,
  AiAskResponse,
  AiMealIdeasResponse,
  AiWeeklyFeedbackResponse,
  DailyCheckin,
  DailyRecommendation,
  GetProgramHistoryResponse,
  GetRecommendationsResponse,
  InviteCode,
  MealIdea,
  MealIdeaQueryParams,
  NutritionGoal,
  NutritionGoalQueryParams,
  NutritionSettings,
  NutritionSettingsQueryParams,
  NutritionTip,
  NutritionTipQueryParams,
  OnboardingStatus,
  PaginatedResponse,
  Program,
  RecommendationQueryParams,
  RegisterRequest,
  ScheduledSession,
  SessionQueryParams,
  SessionStatus,
  TodayView,
  UserRole,
  ValidateInviteRequest,
  ValidateInviteResponse,
  UpdateProgramRequest,
  UpdateTrainingDaysRequest,
  Exercise,
  ExerciseSearchParams,
  ExerciseRecommendedParams,
  ExerciseRecommendedResponse,
  SessionDetails,
  CompleteSessionRequest,
  WeekCalendarResponse,
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
  getAll: (params?: { search?: string; status?: string; offset?: number; limit?: number }) =>
    api.get<PaginatedResponse<ClientProfile>>(`/clients${buildQueryString(params || {})}`),

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
   * Create session as client (CLIENT only)
   */
  createClientSession: (data: CreateClientSessionDto) =>
    api.post<ScheduledSession>('/schedule/sessions/client', data),

  /**
   * Get recommended session for client (CLIENT only)
   */
  getClientRecommendation: () =>
    api.get<ClientSessionRecommendation>('/schedule/recommendation'),

  /**
   * Get all sessions (filtered by role)
   * TRAINER: sees all their clients' sessions
   * CLIENT: only sees their own sessions
   */
  getSessions: (params?: SessionQueryParams) =>
    api.get<PaginatedResponse<ScheduledSession>>(`/schedule/sessions${buildQueryString(params || {})}`),

  /**
   * Get session details with exercises (CLIENT)
   */
  getSessionDetails: (id: string) =>
    api.get<SessionDetails>(`/schedule/sessions/${id}`),

  /**
   * Complete a session (CLIENT)
   */
  completeSession: (id: string, data: CompleteSessionRequest) =>
    api.post<SessionDetails>(`/schedule/sessions/${id}/complete`, data),

  /**
   * Get week calendar (CLIENT)
   */
  getWeekCalendar: (date: string) =>
    api.get<WeekCalendarResponse>(`/schedule/calendar/week${buildQueryString({ date })}`),

  /**
   * Get upcoming sessions (CLIENT)
   */
  getUpcomingSessions: (limit: number = 5) =>
    api.get<ScheduledSession[]>(`/schedule/sessions/upcoming${buildQueryString({ limit })}`),

  /**
   * Get session history (CLIENT)
   */
  getSessionHistory: (limit: number = 20, offset: number = 0) =>
    api.get<PaginatedResponse<ScheduledSession>>(`/schedule/sessions/history${buildQueryString({ limit, offset })}`),

  /**
   * Update session (TRAINER only)
   */
  updateSession: (id: string, data: Partial<CreateSessionDto>) =>
    api.patch<ScheduledSession>(`/schedule/sessions/${id}`, data),

  /**
   * Update session status (TRAINER and CLIENT)
   * Lightweight endpoint for status-only updates
   */
  updateSessionStatus: (id: string, status: SessionStatus) =>
    api.patch<ScheduledSession>(`/schedule/sessions/${id}/status`, { status }),

  /**
   * Delete session (TRAINER only)
   */
  deleteSession: (id: string) =>
    api.delete<void>(`/schedule/sessions/${id}`),
};

// ============================================================================
// PROGRAMS (TRAINER)
// ============================================================================

export const programApi = {
  /**
   * Create a program template (TRAINER only)
   */
  create: (data: CreateProgramRequest) =>
    api.post<Program>('/programs', data),

  /**
   * Get all programs (defaults + trainer-owned)
   */
  getAll: () =>
    api.get<Program[]>('/programs'),

  /**
   * Get program by ID
   */
  getById: (id: string) =>
    api.get<Program>(`/programs/${id}`),

  /**
   * Update program (TRAINER only)
   */
  update: (id: string, data: UpdateProgramRequest) =>
    api.patch<Program>(`/programs/${id}`, data),

  /**
   * Delete program (TRAINER only)
   */
  delete: (id: string) =>
    api.delete<{ message: string }>(`/programs/${id}`),

  /**
   * Clone a program into trainer ownership
   */
  clone: (id: string) =>
    api.post<Program>(`/programs/${id}/clone`),
};

// ============================================================================
// CLIENT PROGRAM ASSIGNMENTS (TRAINER)
// ============================================================================

export const clientProgramApi = {
  /**
   * Assign a program to a client
   */
  assign: (clientId: string, data: AssignProgramRequest) =>
    api.post<ClientProgram>(`/clients/${clientId}/program/assign`, data),

  /**
   * Get active program assignment for a client
   */
  getActive: (clientId: string) =>
    api.get<ClientProgram>(`/clients/${clientId}/program`),

  /**
   * Update training days for active program
   */
  updateTrainingDays: (clientId: string, data: UpdateTrainingDaysRequest) =>
    api.patch<ClientProgram>(`/clients/${clientId}/program/days`, data),

  /**
   * Remove active program assignment
   */
  remove: (clientId: string) =>
    api.delete<{ message: string }>(`/clients/${clientId}/program`),
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
    api.post<DailyCheckin>('/checkins/today', {
      ...data,
      note: data.notes,
    }),

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
    api.patch<DailyCheckin>(`/checkins/${id}`, {
      ...data,
      note: data.notes,
    }),

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
// PROGRAM RECOMMENDATIONS & HISTORY (TRAINER)
// ============================================================================

export const programInsightsApi = {
  /**
   * Get AI program recommendations for a client
   */
  getRecommendations: (clientId: string) =>
    api.get<GetRecommendationsResponse>(`/clients/${clientId}/program/recommendations`),

  /**
   * Get recommendation/selection history timeline
   */
  getHistory: (clientId: string) =>
    api.get<GetProgramHistoryResponse>(`/clients/${clientId}/program/history`),
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

  /**
   * Get nutrition settings
   */
  getSettings: (params?: NutritionSettingsQueryParams) =>
    api.get<NutritionSettings | null>(`/nutrition/settings${buildQueryString(params || {})}`),

  /**
   * Upsert nutrition settings (TRAINER only)
   */
  upsertSettings: (data: CreateNutritionSettingsDto) =>
    api.post<NutritionSettings>('/nutrition/settings', data),

  /**
   * Update nutrition settings (TRAINER only)
   */
  updateSettings: (id: string, data: Partial<CreateNutritionSettingsDto>) =>
    api.patch<NutritionSettings>(`/nutrition/settings/${id}`, data),

  /**
   * Get today's nutrition tip (CLIENT only)
   */
  getTodayTip: () =>
    api.get<NutritionTip | null>('/nutrition/tips/today'),

  /**
   * List nutrition tips (TRAINER only)
   */
  getTips: (params?: NutritionTipQueryParams) =>
    api.get<NutritionTip[]>(`/nutrition/tips${buildQueryString(params || {})}`),

  /**
   * Create nutrition tip (TRAINER only)
   */
  createTip: (data: CreateNutritionTipDto) =>
    api.post<NutritionTip>('/nutrition/tips', data),

  /**
   * Update nutrition tip (TRAINER only)
   */
  updateTip: (id: string, data: Partial<CreateNutritionTipDto>) =>
    api.patch<NutritionTip>(`/nutrition/tips/${id}`, data),

  /**
   * Delete nutrition tip (TRAINER only)
   */
  deleteTip: (id: string) =>
    api.delete<void>(`/nutrition/tips/${id}`),

  /**
   * List meal ideas
   */
  getMealIdeas: (params?: MealIdeaQueryParams) =>
    api.get<MealIdea[]>(`/nutrition/meals${buildQueryString(params || {})}`),

  /**
   * Create meal idea (TRAINER only)
   */
  createMealIdea: (data: CreateMealIdeaDto) =>
    api.post<MealIdea>('/nutrition/meals', data),

  /**
   * Update meal idea (TRAINER only)
   */
  updateMealIdea: (id: string, data: Partial<CreateMealIdeaDto>) =>
    api.patch<MealIdea>(`/nutrition/meals/${id}`, data),

  /**
   * Delete meal idea (TRAINER only)
   */
  deleteMealIdea: (id: string) =>
    api.delete<void>(`/nutrition/meals/${id}`),
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
// AI ENDPOINTS (CLIENT)
// ============================================================================

export const aiApi = {
  askToday: (question: string) =>
    api.post<AiAskResponse>('/ai/ask', { question }),

  mealIdeas: (data?: { preferences?: string[]; mealsPerDay?: number }) =>
    api.post<AiMealIdeasResponse>('/ai/meal-ideas', data),

  weeklyFeedback: () =>
    api.post<AiWeeklyFeedbackResponse>('/ai/weekly-feedback'),
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

// ============================================================================
// EXERCISES ENDPOINTS
// ============================================================================

export const exerciseApi = {
  /**
   * Search exercises with filters
   */
  search: (params?: ExerciseSearchParams) =>
    api.get<Exercise[]>(`/exercises/search${buildQueryString(params || {})}`),

  /**
   * Get recommended exercises grouped by category
   */
  recommended: (params?: ExerciseRecommendedParams) => {
    const queryParams: Record<string, any> = {};
    if (params?.categories) {
      queryParams.categories = params.categories.join(',');
    }
    if (params?.difficulty) {
      queryParams.difficulty = params.difficulty;
    }
    return api.get<ExerciseRecommendedResponse>(`/exercises/recommended${buildQueryString(queryParams)}`);
  },

  /**
   * Get single exercise by ID
   */
  getById: (id: string) =>
    api.get<Exercise>(`/exercises/${id}`),
};
