/**
 * Services Barrel Export
 *
 * Central export for all service modules.
 */

// ============================================================================
// Auth Service
// ============================================================================

export {
  login,
  register,
  logout,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  getCurrentUser,
  isAuthenticated,
  setOnboardingCookie,
} from "./auth";
export type {
  User,
  AuthTokens,
  LoginResponse,
  RegisterResponse,
  OnboardingStatus,
  UserRole,
} from "./auth";

// ============================================================================
// API Utilities
// ============================================================================

export {
  api,
  apiRequest,
  ApiError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  NetworkError,
  getHebrewErrorMessage,
  isAuthError,
  isNetworkError,
} from "./api";

// ============================================================================
// Questionnaire Services (V2)
// ============================================================================

export {
  questionnaireServiceV2,
  loadOrCreateQuestionnaire,
  needsFieldCompletion,
  getStepsNeedingCompletion,
} from "./questionnaire-v2";
export type { QuestionnaireV2State } from "./questionnaire-v2";

// Migration Utilities
export {
  migrateV1ToV2,
  isV1Data,
  deepMerge,
  getNewFieldsToComplete,
  getStepsWithNewFields,
  getFirstIncompleteStep,
} from "./questionnaire-migration";

// ============================================================================
// Admin Service
// ============================================================================

export {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./admin";
export type {
  UserRole as AdminUserRole,
  OnboardingStatus as AdminOnboardingStatus,
  AdminUser,
  AdminQuestionnaire,
  AdminUserDetail,
  UserListResponse,
  ListUsersParams,
  CreateUserInput,
  UpdateUserInput,
} from "./admin";

// ============================================================================
// Reports Service
// ============================================================================

export {
  listReports,
  getPendingQuestionnaires,
  getReportById,
  createReport,
  updateReport,
  publishReport,
  deleteReport,
  getDestinationResponseById,
  createDestinationResponse,
  updateDestinationResponse,
  publishDestinationResponse,
  deleteDestinationResponse,
  deleteCountryResponse,
} from "./reports";
export type {
  ReportStatus,
  ReportProfileSummary,
  ReportUser,
  DestinationInfo,
  MatchInfo,
  DestinationNarrative,
  DestinationSection,
  DestinationResponseListItem,
  DestinationResponseFull,
  Report,
  ReportListItem,
  ReportListResponse,
  ListReportsParams,
  CreateReportInput,
  UpdateReportInput,
  CreateDestinationResponseInput,
  UpdateDestinationResponseInput,
  PendingQuestionnaire,
  ReportCountryResponse,
  CreateCountryResponseInput,
  UpdateCountryResponseInput,
  PersonalizedContent,
  CategoryOverrides,
} from "./reports";

// ============================================================================
// User Reports Service
// ============================================================================

export {
  getReportStatus,
  getUserReport,
  getDestinationResponse,
  getCountryResponse,
} from "./userReports";
export type {
  UserReportProfileSummary,
  UserDestinationInfo,
  UserMatchInfo,
  UserDestinationNarrative,
  UserDestinationSection,
  UserDestinationResponse,
  UserReport,
  UserReportStatus,
  UserCountryResponse,
} from "./userReports";

// ============================================================================
// Notifications Service
// ============================================================================

export {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "./notifications";
export type {
  NotificationType,
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
} from "./notifications";
