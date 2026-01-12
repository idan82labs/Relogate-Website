'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getCurrentUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  isAuthenticated,
  setOnboardingCookie,
  type User,
  type OnboardingStatus,
} from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  onboardingStatus: OnboardingStatus | null;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateOnboardingStatus: (status: OnboardingStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onboardingStatus = user?.onboardingStatus ?? null;
  const hasCompletedOnboarding = onboardingStatus === 'completed';
  const authenticated = !!user;

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
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authLogin(email, password);

    if (result.error) {
      return { success: false, error: result.error };
    }

    setUser(result.user);
    return { success: true };
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const result = await authRegister(userData);

    if (result.error) {
      return { success: false, error: result.error };
    }

    setUser(result.user);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const updateOnboardingStatus = useCallback((status: OnboardingStatus) => {
    if (user) {
      setUser({ ...user, onboardingStatus: status });
      // Sync cookie for middleware access
      setOnboardingCookie(status);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: authenticated,
    onboardingStatus,
    hasCompletedOnboarding,
    login,
    register,
    logout,
    refreshUser,
    updateOnboardingStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { AuthContextType };
