# Frontend Implementation Plan: Questionnaire V2 Migration Support

## Overview

This plan addresses two critical issues:
1. **No "Update Questionnaire" button** - Users who completed V1 cannot update to V2
2. **No version mismatch detection** - Frontend doesn't check if questionnaire is outdated

## Prerequisites

Before implementing frontend changes, the backend must provide:

```typescript
// GET /api/v1/questionnaire/status
// Response:
{
  success: true,
  data: {
    hasQuestionnaire: boolean;
    status: 'in_progress' | 'completed' | 'archived' | null;
    schemaVersion: number | null;        // User's questionnaire version
    currentSchemaVersion: number;         // Latest schema version
    needsUpdate: boolean;                 // true if schemaVersion < currentSchemaVersion
    missingFields: string[];              // Fields user hasn't filled yet
  }
}

// POST /api/v1/questionnaire/migrate
// Reopens completed questionnaire for updates
// Response:
{
  success: true,
  data: {
    questionnaire: { id, status: 'in_progress', ... }
  }
}
```

---

## Implementation Tasks

### Task 1: Create Questionnaire Status Service

**File:** `src/services/questionnaire-status.ts` (NEW)

**Purpose:** API client for questionnaire status and migration endpoints.

```typescript
/**
 * Questionnaire Status Service
 * Handles questionnaire version checking and migration
 */

import { getAccessToken, refreshAccessToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface QuestionnaireStatus {
  hasQuestionnaire: boolean;
  status: 'in_progress' | 'completed' | 'archived' | null;
  schemaVersion: number | null;
  currentSchemaVersion: number;
  needsUpdate: boolean;
  missingFields: string[];
}

export interface MigrateResponse {
  questionnaire: {
    id: string;
    status: string;
    schemaVersion: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Make an authenticated API request
 */
async function authenticatedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let accessToken = getAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Not authenticated' };
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...options.headers,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Try to refresh token on 401
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        accessToken = getAccessToken();
        if (accessToken) {
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              'Authorization': `Bearer ${accessToken}`,
            },
          });
        }
      }
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
        code: data.code,
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error('Questionnaire Status API error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get questionnaire status including version info
 */
export async function getQuestionnaireStatus(): Promise<{
  data: QuestionnaireStatus | null;
  error?: string;
}> {
  const response = await authenticatedFetch<QuestionnaireStatus>(
    '/api/v1/questionnaire/status'
  );

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}

/**
 * Migrate questionnaire to new version (reopen for updates)
 */
export async function migrateQuestionnaire(): Promise<{
  data: MigrateResponse | null;
  error?: string;
}> {
  const response = await authenticatedFetch<MigrateResponse>(
    '/api/v1/questionnaire/migrate',
    { method: 'POST' }
  );

  if (!response.success || !response.data) {
    return { data: null, error: response.error };
  }

  return { data: response.data };
}
```

**Export from index:** Update `src/services/index.ts` to include new service.

---

### Task 2: Update Hebrew Content

**File:** `src/content/he.ts`

**Location:** Inside `personalAreaDashboard.sections.questionnaire` (around line 622)

**Changes:**

```typescript
questionnaire: {
  title: "שאלון רילוקיישן",
  notStarted: "לא התחלת עדיין את השאלון",
  inProgress: "השאלון בתהליך",
  completed: "השאלון הושלם",
  // NEW: Add these keys
  needsUpdate: "השאלון שלך דורש עדכון",
  needsUpdateDescription: "נוספו שאלות חדשות לשאלון. אנא השלם את הפרטים הנוספים כדי לקבל דוח מעודכן.",

  startButton: "התחל שאלון",
  continueButton: "המשך שאלון",
  viewResultsButton: "צפה בתוצאות",
  // NEW: Add this key
  updateButton: "עדכן שאלון",

  // NEW: Add update banner
  updateBanner: {
    title: "גרסה חדשה של השאלון זמינה",
    description: "נוספו שאלות חדשות שיעזרו לנו להתאים לך דוח מדויק יותר.",
    action: "עדכן עכשיו",
  },

  // NEW: Migration in progress
  migrating: "מעדכן את השאלון...",
  migrationError: "שגיאה בעדכון השאלון. אנא נסה שוב.",
},
```

---

### Task 3: Update AuthContext with Questionnaire Status

**File:** `src/contexts/AuthContext.tsx`

**Changes:**

#### 3.1 Add imports and types

```typescript
import {
  getQuestionnaireStatus,
  type QuestionnaireStatus,
} from '@/services/questionnaire-status';

interface AuthContextType {
  // ... existing fields
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboardingStatus: OnboardingStatus | null;
  hasCompletedOnboarding: boolean;

  // NEW: Add these fields
  questionnaireStatus: QuestionnaireStatus | null;
  needsQuestionnaireUpdate: boolean;
  isLoadingQuestionnaireStatus: boolean;

  // ... existing methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateOnboardingStatus: (status: OnboardingStatus) => void;

  // NEW: Add this method
  refreshQuestionnaireStatus: () => Promise<void>;
}
```

#### 3.2 Add state variables

```typescript
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: Add questionnaire status state
  const [questionnaireStatus, setQuestionnaireStatus] = useState<QuestionnaireStatus | null>(null);
  const [isLoadingQuestionnaireStatus, setIsLoadingQuestionnaireStatus] = useState(false);

  // Derived values
  const onboardingStatus = user?.onboardingStatus ?? null;
  const hasCompletedOnboarding = onboardingStatus === 'completed';
  const authenticated = !!user;

  // NEW: Derived value for update needed
  const needsQuestionnaireUpdate = questionnaireStatus?.needsUpdate ?? false;
```

#### 3.3 Add questionnaire status fetch function

```typescript
// NEW: Fetch questionnaire status
const fetchQuestionnaireStatus = useCallback(async () => {
  if (!authenticated) {
    setQuestionnaireStatus(null);
    return;
  }

  setIsLoadingQuestionnaireStatus(true);
  try {
    const { data, error } = await getQuestionnaireStatus();
    if (data) {
      setQuestionnaireStatus(data);
    } else {
      console.error('Failed to fetch questionnaire status:', error);
    }
  } catch (error) {
    console.error('Error fetching questionnaire status:', error);
  } finally {
    setIsLoadingQuestionnaireStatus(false);
  }
}, [authenticated]);

// NEW: Exposed method to refresh status
const refreshQuestionnaireStatus = useCallback(async () => {
  await fetchQuestionnaireStatus();
}, [fetchQuestionnaireStatus]);
```

#### 3.4 Update loadUser effect

```typescript
// Fetch current user on mount
useEffect(() => {
  async function loadUser() {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Sync onboarding cookie with current user status
      if (currentUser?.onboardingStatus) {
        setOnboardingCookie(currentUser.onboardingStatus);
      }

      // NEW: Fetch questionnaire status after user is loaded
      // (will be triggered by authenticated changing to true)
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  loadUser();
}, []);

// NEW: Fetch questionnaire status when authenticated
useEffect(() => {
  if (authenticated && !isLoading) {
    fetchQuestionnaireStatus();
  }
}, [authenticated, isLoading, fetchQuestionnaireStatus]);
```

#### 3.5 Update context value

```typescript
const value: AuthContextType = {
  user,
  isLoading,
  isAuthenticated: authenticated,
  onboardingStatus,
  hasCompletedOnboarding,

  // NEW: Add these
  questionnaireStatus,
  needsQuestionnaireUpdate,
  isLoadingQuestionnaireStatus,

  login,
  register,
  logout,
  refreshUser,
  updateOnboardingStatus,

  // NEW: Add this
  refreshQuestionnaireStatus,
};
```

#### 3.6 Update login to fetch questionnaire status

```typescript
const login = useCallback(async (email: string, password: string) => {
  const result = await authLogin(email, password);

  if (result.error) {
    return { success: false, error: result.error };
  }

  setUser(result.user);

  // NEW: Questionnaire status will be fetched by the useEffect
  // when authenticated becomes true

  return { success: true };
}, []);
```

---

### Task 4: Update PersonalArea Component (Desktop)

**File:** `src/components/desktop/PersonalArea.tsx`

**Changes:**

#### 4.1 Update imports and hooks

```typescript
import { useAuth } from "@/contexts";
import { migrateQuestionnaire } from "@/services/questionnaire-status";

// Inside component:
const {
  user,
  hasCompletedOnboarding,
  onboardingStatus,
  logout,
  // NEW: Add these
  questionnaireStatus,
  needsQuestionnaireUpdate,
  isLoadingQuestionnaireStatus,
  refreshQuestionnaireStatus,
} = useAuth();

// NEW: Add migration state
const [isMigrating, setIsMigrating] = useState(false);
const [migrationError, setMigrationError] = useState<string | null>(null);
```

#### 4.2 Update getQuestionnaireStatus function

```typescript
const getQuestionnaireStatusDisplay = () => {
  // NEW: Check for update needed first (highest priority for completed questionnaires)
  if (hasCompletedOnboarding && needsQuestionnaireUpdate) {
    return {
      text: personalAreaDashboard.sections.questionnaire.needsUpdate,
      description: personalAreaDashboard.sections.questionnaire.needsUpdateDescription,
      buttonText: personalAreaDashboard.sections.questionnaire.updateButton,
      color: "text-[#E67E22]", // Orange for attention
      showWarning: true,
    };
  }

  if (hasCompletedOnboarding) {
    return {
      text: personalAreaDashboard.sections.questionnaire.completed,
      buttonText: personalAreaDashboard.sections.questionnaire.viewResultsButton,
      color: "text-[#239083]",
      showWarning: false,
    };
  }

  if (onboardingStatus === "in_progress") {
    return {
      text: personalAreaDashboard.sections.questionnaire.inProgress,
      buttonText: personalAreaDashboard.sections.questionnaire.continueButton,
      color: "text-[#215388]",
      showWarning: false,
    };
  }

  return {
    text: personalAreaDashboard.sections.questionnaire.notStarted,
    buttonText: personalAreaDashboard.sections.questionnaire.startButton,
    color: "text-[#706F6F]",
    showWarning: false,
  };
};

const questionnaireStatusDisplay = getQuestionnaireStatusDisplay();
```

#### 4.3 Update handleQuestionnaireAction function

```typescript
const handleQuestionnaireAction = async () => {
  // NEW: Handle migration case
  if (hasCompletedOnboarding && needsQuestionnaireUpdate) {
    setIsMigrating(true);
    setMigrationError(null);

    const { data, error } = await migrateQuestionnaire();

    if (error || !data) {
      setMigrationError(personalAreaDashboard.sections.questionnaire.migrationError);
      setIsMigrating(false);
      return;
    }

    // Refresh questionnaire status and redirect
    await refreshQuestionnaireStatus();
    setIsMigrating(false);
    router.push("/questionnaire");
    return;
  }

  if (hasCompletedOnboarding) {
    router.push("/questionnaire/results");
  } else if (onboardingStatus === "in_progress") {
    router.push("/questionnaire");
  } else {
    router.push("/questionnaire");
  }
};
```

#### 4.4 Update Questionnaire Status Card JSX

```tsx
{/* Questionnaire Status Card */}
<Card padding="lg" className="bg-white">
  <h2 className="text-xl font-medium text-[#1D1D1B] text-right mb-6">
    {personalAreaDashboard.sections.questionnaire.title}
  </h2>

  <div className="text-center py-8">
    {/* NEW: Warning banner for updates needed */}
    {questionnaireStatusDisplay.showWarning && (
      <div className="mb-6 p-4 bg-[#FEF3E7] border border-[#E67E22] rounded-lg text-right">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-medium text-[#E67E22] mb-1">
              {personalAreaDashboard.sections.questionnaire.updateBanner.title}
            </p>
            <p className="text-sm text-[#706F6F]">
              {personalAreaDashboard.sections.questionnaire.updateBanner.description}
            </p>
          </div>
          <svg
            className="w-6 h-6 text-[#E67E22] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
    )}

    {/* Status text */}
    <p className={`text-lg mb-2 ${questionnaireStatusDisplay.color}`}>
      {questionnaireStatusDisplay.text}
    </p>

    {/* Description (for update state) */}
    {questionnaireStatusDisplay.description && (
      <p className="text-sm text-[#706F6F] mb-6">
        {questionnaireStatusDisplay.description}
      </p>
    )}

    {/* Migration error */}
    {migrationError && (
      <p className="text-sm text-red-500 mb-4">{migrationError}</p>
    )}

    {/* Action button */}
    <Button
      variant={questionnaireStatusDisplay.showWarning ? "primary" : "primary"}
      size="lg"
      onClick={handleQuestionnaireAction}
      disabled={isMigrating || isLoadingQuestionnaireStatus}
      className={questionnaireStatusDisplay.showWarning ? "bg-[#E67E22] hover:bg-[#D35400]" : ""}
    >
      {isMigrating
        ? personalAreaDashboard.sections.questionnaire.migrating
        : questionnaireStatusDisplay.buttonText
      }
    </Button>

    {/* NEW: Show "View Results" as secondary action when update is needed */}
    {questionnaireStatusDisplay.showWarning && (
      <button
        onClick={() => router.push("/questionnaire/results")}
        className="mt-3 text-sm text-[#215388] hover:underline block mx-auto"
      >
        {personalAreaDashboard.sections.questionnaire.viewResultsButton}
      </button>
    )}
  </div>
</Card>
```

---

### Task 5: Update MobilePersonalArea Component

**File:** `src/components/mobile/MobilePersonalArea.tsx`

Apply the same changes as Task 4, with mobile-appropriate styling:
- Smaller padding/margins
- Smaller font sizes
- Same logic and state management

---

### Task 6: Update Services Index

**File:** `src/services/index.ts`

```typescript
// Add export for new service
export * from './questionnaire-status';
```

---

### Task 7: Add TypeScript Types (Optional Enhancement)

**File:** `src/types/questionnaire.ts` (NEW - optional)

```typescript
export type QuestionnaireStatusType =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'needs_update';

export interface QuestionnaireStatusDisplay {
  text: string;
  description?: string;
  buttonText: string;
  color: string;
  showWarning: boolean;
}
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/services/questionnaire-status.ts` | CREATE | New service for status/migrate API |
| `src/services/index.ts` | UPDATE | Export new service |
| `src/content/he.ts` | UPDATE | Add Hebrew content for update state |
| `src/contexts/AuthContext.tsx` | UPDATE | Add questionnaire status state & methods |
| `src/components/desktop/PersonalArea.tsx` | UPDATE | Add update UI and migration logic |
| `src/components/mobile/MobilePersonalArea.tsx` | UPDATE | Same changes for mobile |

---

## Implementation Order

```
Phase 1: Foundation (No UI changes yet)
├── Task 1: Create questionnaire-status.ts service
├── Task 6: Update services/index.ts
└── Task 2: Update he.ts content

Phase 2: State Management
└── Task 3: Update AuthContext.tsx

Phase 3: UI Components
├── Task 4: Update PersonalArea.tsx (Desktop)
└── Task 5: Update MobilePersonalArea.tsx (Mobile)

Phase 4: Testing
├── Manual test: Login as V1 user
├── Manual test: Verify update banner appears
├── Manual test: Click update button
├── Manual test: Complete migration flow
└── Manual test: Verify results still accessible
```

---

## Testing Checklist

### Prerequisites
- [ ] Backend `/api/v1/questionnaire/status` endpoint deployed
- [ ] Backend `/api/v1/questionnaire/migrate` endpoint deployed
- [ ] Test user with V1 completed questionnaire exists

### Functional Tests
- [ ] V1 user sees "Update Questionnaire" banner in PersonalArea
- [ ] V1 user sees orange "עדכן שאלון" button
- [ ] V1 user can still click "View Results" secondary link
- [ ] Clicking update button calls migrate API
- [ ] After migration, user redirected to questionnaire
- [ ] Questionnaire shows only new/missing fields (if supported)
- [ ] After completing V2 fields, status shows "completed" without warning
- [ ] V2 user (no update needed) sees normal "View Results" button
- [ ] New user sees "Start Questionnaire" button
- [ ] In-progress user sees "Continue Questionnaire" button

### Error Handling Tests
- [ ] Network error during status fetch shows graceful fallback
- [ ] Migration API error shows error message
- [ ] Button disabled during migration (no double-click)
- [ ] Loading state shown while fetching status

### Visual Tests
- [ ] Desktop: Warning banner styling correct
- [ ] Desktop: Button colors correct (orange for update)
- [ ] Mobile: Warning banner fits small screens
- [ ] Mobile: All text readable
- [ ] RTL: All elements aligned correctly

---

## Rollback Plan

If issues arise after deployment:

1. **Quick fix:** Add feature flag in AuthContext:
   ```typescript
   const ENABLE_QUESTIONNAIRE_VERSION_CHECK = false; // Toggle off
   const needsQuestionnaireUpdate = ENABLE_QUESTIONNAIRE_VERSION_CHECK
     ? (questionnaireStatus?.needsUpdate ?? false)
     : false;
   ```

2. **Full rollback:** Revert commits for Tasks 3-5, keep service files.

---

## Dependencies

### Backend API Required

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/v1/questionnaire/status` | GET | Required before frontend deploy |
| `/api/v1/questionnaire/migrate` | POST | Required before frontend deploy |

### No New NPM Packages Required

All implementation uses existing dependencies:
- React hooks (useState, useEffect, useCallback)
- Next.js router
- Existing auth service pattern
- Existing component library (Button, Card)

---

## Estimated Effort

| Task | Complexity | Estimate |
|------|------------|----------|
| Task 1: Service | Low | 15 min |
| Task 2: Content | Low | 10 min |
| Task 3: AuthContext | Medium | 30 min |
| Task 4: Desktop PersonalArea | Medium | 45 min |
| Task 5: Mobile PersonalArea | Low | 20 min |
| Task 6: Index export | Low | 5 min |
| Testing | Medium | 30 min |
| **Total** | | **~2.5 hours** |
