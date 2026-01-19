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

// Paginated Response Type
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

// User & Authentication Types
export type UserRole = "CLIENT" | "TRAINER";

export interface AppUser {
  id: string;
  authId: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  clientProfile?: ClientProfile;
  trainerProfile?: TrainerProfile;
  trainerClients?: ClientProfile[];
}

export interface RegisterRequest {
  authId: string;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Client Profile Types
export type ClientStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

export interface ClientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  timezone?: string;
  pushToken?: string;
  pushEnabled?: boolean;
  pushSessionReminders?: boolean;
  pushDailyTips?: boolean;
  pushWeeklyMessage?: boolean;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  goalDescription?: string;
  status: ClientStatus;
  programStartDate?: string;
  programWeeks?: number;
  recommendedSessionsPerWeek?: number;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientProfileDto {
  userId: string;
  firstName: string;
  lastName: string;
  timezone?: string;
  pushToken?: string;
  pushEnabled?: boolean;
  pushSessionReminders?: boolean;
  pushDailyTips?: boolean;
  pushWeeklyMessage?: boolean;
  age?: number;
  height?: number;
  weight?: number;
  goalDescription?: string;
  status?: ClientStatus;
  programStartDate?: string;
  programWeeks?: number;
  recommendedSessionsPerWeek?: number;
}

export interface UpdateMyProfileDto {
  firstName?: string;
  lastName?: string;
  timezone?: string;
  age?: number;
  height?: number;
  weight?: number;
  goalDescription?: string;
  recommendedSessionsPerWeek?: number;
  status?: ClientStatus;
  pushToken?: string;
  pushEnabled?: boolean;
  pushSessionReminders?: boolean;
  pushDailyTips?: boolean;
  pushWeeklyMessage?: boolean;
}

// Session Types
export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface ScheduledSession {
  id: string;
  clientId: string;
  startAt: string;
  endAt: string;
  sessionType: string;
  sessionName: string;
  notes?: string;
  status: SessionStatus;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateSessionDto {
  clientId: string;
  startAt: string;
  endAt: string;
  sessionName: string;
  sessionType?: string;
  notes?: string;
  autoRecommended?: boolean;
}

export interface CreateClientSessionDto {
  startAt: string;
  endAt?: string;
}

export interface UpdateSessionStatusDto {
  status: SessionStatus;
}

export interface ClientSessionRecommendation {
  sessionName: string;
  sessionType: string;
}

export interface AiAskResponse {
  ideas: string[];
  answer?: string;
}

export interface AiMealIdeasResponse {
  ideas: string[];
}

export interface AiWeeklyFeedbackResponse {
  summary: string;
}

// Check-in Types
export interface DailyCheckin {
  id: string;
  clientId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckinDto {}

// Recommendation Types
export interface DailyRecommendation {
  id: string;
  clientId: string;
  date: string;
  focusText: string;
  tipsText?: string;
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
  proteinTargetPerDay: number;
  waterTargetMlPerDay: number;
  weeklyFocus: string;
  createdAt: string;
}

export interface CreateNutritionGoalDto {
  clientId: string;
  weekStartDate: string;
  proteinTargetPerDay: number;
  waterTargetMlPerDay: number;
  weeklyFocus: string;
}

export interface NutritionSettings {
  id: string;
  clientId: string;
  objective?: string;
  proteinTargetPerDay: number;
  waterTargetMlPerDay: number;
  weeklyGoal1?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNutritionSettingsDto {
  clientId: string;
  objective?: string;
  proteinTargetPerDay: number;
  waterTargetMlPerDay: number;
  weeklyGoal1?: string;
}

export type NutritionTipScope = "GLOBAL" | "CLIENT" | "OBJECTIVE";

export interface NutritionTip {
  id: string;
  scope: NutritionTipScope;
  text: string;
  goalTag?: string;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNutritionTipDto {
  scope: NutritionTipScope;
  text: string;
  goalTag?: string;
  clientId?: string;
}

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

export interface MealIdea {
  id: string;
  title: string;
  description?: string;
  mealType: MealType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealIdeaDto {
  title: string;
  description?: string;
  mealType: MealType;
  tags?: string[];
}

// Today View Types (CLIENT only)
export interface TodayView {
  nextSession: ScheduledSession | null;
  dailyRecommendation: {
    focusText: string;
    tipsText?: string | null;
    hasWorkoutToday: boolean;
    notes?: string;
    date: Date;
  };
  checkin: DailyCheckin | null;
  nutritionGoal: NutritionGoal | null;
  nutritionSettings: NutritionSettings | null;
  nutritionTip: NutritionTip | null;
  clientInfo: {
    firstName: string;
    lastName: string;
    goalDescription?: string;
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

export interface NutritionSettingsQueryParams {
  clientId?: string;
}

export interface NutritionTipQueryParams {
  scope?: NutritionTipScope;
  clientId?: string;
  goalTag?: string;
}

export interface MealIdeaQueryParams {
  type?: MealType;
  tags?: string;
}

// Onboarding Types
export interface OnboardingStatus {
  completed: boolean;
  completedAt?: string;
  profileExists: boolean;
}

export interface ValidateInviteRequest {
  inviteCode: string;
}

export interface ValidateInviteResponse {
  valid: boolean;
  message?: string;
  trainerInfo?: {
    trainerId: string;
  };
  prefillData?: {
    clientEmail?: string;
    clientFirstName?: string;
    clientLastName?: string;
  };
}

export interface CompleteOnboardingRequest {
  inviteCode: string;
  firstName: string;
  lastName: string;
  timezone?: string;
  age?: number;
  height?: number;
  weight?: number;
  goalDescription?: string;
  programStartDate?: string;
  preferredSessionsPerWeek?: number;
}

export interface InviteCode {
  id: string;
  code: string;
  used: boolean;
  usedAt?: string;
  expiresAt?: string;
  clientEmail?: string;
  usedBy?: {
    id: string;
    clientProfile: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
}

export interface CreateInviteRequest {
  clientEmail?: string;
  clientFirstName?: string;
  clientLastName?: string;
  expiresInDays?: number;
}

// ============================================================================
// PROGRAMS & RECOMMENDATIONS
// ============================================================================

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export interface CreateProgramRequest {
  name: string;
  description?: string;
  sessionsPerWeek: number;
  durationWeeks?: number;
  sessions: Array<{
    dayNumber: number;
    name: string;
    focus: string;
    notes?: string;
    exercises?: Array<{
      exerciseId: string;
      orderIndex: number;
      sets?: number;
      reps?: string;
      notes?: string;
    }>;
  }>;
}

export type UpdateProgramRequest = Partial<CreateProgramRequest>;

export interface ProgramSession {
  id: string;
  dayNumber: number;
  name: string;
  focus: string;
  notes?: string;
  sessionExercises?: SessionExercise[];
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  sessionsPerWeek: number;
  durationWeeks?: number;
  isDefault: boolean;
  trainerId?: string | null;
  sessions: ProgramSession[];
}

export interface AssignProgramRequest {
  programId: string;
  startDate: string;
  trainingDays: DayOfWeek[];
  customize?: boolean;
}

export interface ClientProgram {
  id: string;
  clientId: string;
  programId: string;
  startDate: string;
  trainingDays: DayOfWeek[];
  isCustomized: boolean;
  active: boolean;
  program: Program;
}

export interface UpdateTrainingDaysRequest {
  trainingDays: DayOfWeek[];
}

export interface ProgramRecommendation {
  programId: string;
  programName: string;
  score: number;
  confidence: Confidence;
  reasons: string[];
  warnings: string[];
}

export interface ClientStats {
  completionRate: number;
  consistency: number;
  painFrequency: number;
  avgNutritionScore: number;
  weeksSinceStart: number;
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
}

export interface GetRecommendationsResponse {
  recommendations: ProgramRecommendation[];
  currentProgram: ClientProgram | null;
  clientStats: ClientStats;
}

export interface ProgramHistoryEntry {
  date: string;
  recommended: {
    programId: string;
    programName: string;
    score: number;
    confidence: Confidence;
  };
  selected: {
    programId: string;
    programName: string;
    wasRecommended: boolean;
  };
  trainerFeedback?: string | null;
  clientStats: ClientStats;
}

export interface GetProgramHistoryResponse {
  history: ProgramHistoryEntry[];
}


// ============================================================================
// EXERCISES
// ============================================================================

export type ExerciseCategory =
  | "SQUAT"
  | "HINGE"
  | "HORIZONTAL_PUSH"
  | "HORIZONTAL_PULL"
  | "VERTICAL_PUSH"
  | "VERTICAL_PULL"
  | "LUNGE"
  | "CORE"
  | "ACCESSORY"
  | "OTHER";

export type ExerciseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type ExerciseEquipment =
  | "BODYWEIGHT"
  | "DUMBBELL"
  | "BARBELL"
  | "KETTLEBELL"
  | "MACHINE"
  | "RESISTANCE_BAND"
  | "CABLE"
  | "OTHER";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  equipment: ExerciseEquipment;
  description?: string;
  isDefault: boolean;
  trainerId?: string;
  trainer: AppUser;
  howTo: string[];
  cues: string[];
  mistakes: string[];
  createdAt: string;
  updatedAt: string;
}


export interface ExerciseSearchParams {
  search?: string;
  category?: ExerciseCategory;
  difficulty?: ExerciseDifficulty;
  equipment?: ExerciseEquipment;
  limit?: number;
  offset?: number;
}

export interface ExerciseRecommendedParams {
  categories?: ExerciseCategory[];
  difficulty?: ExerciseDifficulty;
}

export interface ExerciseRecommendedResponse {
  categories: ExerciseCategory[];
  totalExercises: number;
  exercisesByCategory: Record<ExerciseCategory, Exercise[]>;
  allExercises: Exercise[];
}

// Session Exercise (linking exercise to session)
export interface SessionExercise {
  id: string;
  sessionId: string;
  session: ProgramSession;
  exerciseId: string;
  exercise: Exercise;
  orderInSession: number;
  sets?: number;
  reps?: string;
  restSeconds?: number;
  tempo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// CLIENT SESSION VIEWS (reusing ScheduledSession where possible)
// ============================================================================

// Session Details with full exercise information
export interface SessionExerciseDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: ExerciseDifficulty;
  howTo: string[];
  cues: string[];
  mistakes: string[];
  equipment: string[];
  sets: number;
  reps: string;
  restSeconds: number | null;
  tempo: string | null;
  notes: string | null;
  orderInSession: number;
}

export interface SessionDetails extends ScheduledSession {
  exercises: SessionExerciseDetail[];
  completedAt?: string | null;
}

// Complete Session Request
export interface CompleteSessionRequest {
  notes?: string;
}

// Week Calendar Response (reuses ScheduledSession structure)
export interface WeekCalendarResponse {
  weekStart: string;
  weekEnd: string;
  sessions: ScheduledSession[];
}
