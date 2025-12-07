// API Response Wrapper Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    statusCode: number;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// User & Authentication Types
export type UserRole = "CLIENT" | "TRAINER";

export interface AppUser {
  id: string;
  authId: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  clientProfile?: ClientProfile;
  trainerClients?: ClientProfile[];
}

export interface RegisterRequest {
  authId: string;
}

// Client Profile Types
export type ClientStatus = "ACTIVE" | "INACTIVE" | "PAUSED";

export interface ClientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  timezone?: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  goalDescription?: string;
  status: ClientStatus;
  programStartDate?: string;
  programWeeks?: number;
  recommendedSessionsPerWeek?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  timezone?: string;
  age?: number;
  height?: number;
  weight?: number;
  goalDescription?: string;
  status?: ClientStatus;
  programStartDate?: string;
  programWeeks?: number;
  recommendedSessionsPerWeek?: number;
}

// Session Types
export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface ScheduledSession {
  id: string;
  clientId: string;
  startAt: string;
  endAt: string;
  sessionType: string;
  notes?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionDto {
  clientId: string;
  startAt: string;
  endAt: string;
  sessionType: string;
  notes?: string;
  status?: SessionStatus;
}

// Check-in Types
export interface DailyCheckin {
  id: string;
  clientId: string;
  date: string;
  weight?: number;
  sleepHours?: number;
  energyLevel?: number; // 1-10
  stressLevel?: number; // 1-10
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckinDto {
  weight?: number;
  sleepHours?: number;
  energyLevel?: number;
  stressLevel?: number;
  notes?: string;
}

// Recommendation Types
export interface DailyRecommendation {
  id: string;
  clientId: string;
  date: string;
  focusText: string;
  hasWorkoutToday: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecommendationDto {
  clientId: string;
  date: string;
  focusText: string;
  hasWorkoutToday: boolean;
  notes?: string;
}

// Nutrition Types
export interface NutritionGoal {
  id: string;
  clientId: string;
  weekStartDate: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNutritionGoalDto {
  clientId: string;
  weekStartDate: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
}

// Today View Types (CLIENT only)
export interface TodayView {
  nextSession: ScheduledSession | null;
  dailyRecommendation: {
    focusText: string;
    hasWorkoutToday: boolean;
    notes?: string;
    date: Date;
  };
  checkin: DailyCheckin | null;
  nutritionGoal: NutritionGoal | null;
  clientInfo: {
    firstName: string;
    lastName: string;
    programWeek: number;
    totalWeeks: number;
  };
}

// Query Parameters
export interface SessionQueryParams {
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: SessionStatus;
}

export interface CheckinQueryParams {
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export interface RecommendationQueryParams {
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export interface NutritionGoalQueryParams {
  clientId?: string;
}