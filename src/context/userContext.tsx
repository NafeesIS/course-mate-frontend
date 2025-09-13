"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { config } from "@/config";

/**
 * User Context for managing user state across the application
 * Integrates with SuperTokens authentication and backend API
 */

interface UserMetaData {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
}

interface User {
  _id: string;
  uId: string; // SuperTokens user ID
  emails: string[];
  meta_data: UserMetaData;
  emailVerified: boolean;
  profilePicture?: string;
  roles: string[];
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  
  // Computed properties for easier access
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserMetaData>) => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  updateUser: async () => {},
  clearError: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionContext = useSessionContext();

  /**
   * Transform backend user data to match frontend interface
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformUserData = (backendUser: any): User => {
    return {
      ...backendUser,
      // Computed properties for easier access
      email: backendUser.emails?.[0] || '',
      firstName: backendUser.meta_data?.firstName,
      lastName: backendUser.meta_data?.lastName,
      role: backendUser.roles?.[0] || 'user',
    };
  };

  /**
   * Fetch user data from backend
   */
  const fetchUserData = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch(`${config.API_URL}${config.ENDPOINTS.AUTH.ME}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - session might be expired
          throw new Error('Session expired. Please sign in again.');
        }
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      return transformUserData(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching user data:', errorMessage);
      throw err;
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (!sessionContext.loading && !sessionContext.doesSessionExist) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userData = await fetchUserData();
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [sessionContext, fetchUserData]);

  /**
   * Update user profile
   */
 const updateUser = useCallback(async (updates: Partial<UserMetaData>) => {
  if (!user) throw new Error('No user logged in');

  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`${config.API_URL}${config.ENDPOINTS.AUTH.UPDATE_PROFILE}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error(`Failed to update profile: ${response.status}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.message || 'Failed to update profile');

    const updatedUser = transformUserData(data.data);
    setUser(updatedUser);

    // ❌ remove this line
    // return updatedUser;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}, [user]);


  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Effect to handle session changes
   */
  useEffect(() => {
    if (sessionContext.loading) {
      return;
    }

    if (!sessionContext.doesSessionExist) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch user data when session exists
    refreshUser();
  }, [sessionContext, refreshUser]);

  /**
   * Debug logging in development
   */
  useEffect(() => {
    if (config.IS_DEVELOPMENT) {
      console.log('UserContext State:', {
        user: user ? { id: user._id, email: user.email, role: user?.roles?.includes('admin') ? 'admin' : 'user'  } : null,
        loading,
        error,
       sessionExists: !sessionContext.loading ? sessionContext.doesSessionExist : null,
        sessionLoading: sessionContext.loading,
      });
    }
  }, [user, loading, error, sessionContext]);

  const contextValue: UserContextType = {
    user,
    loading: loading || sessionContext.loading,
    error,
    refreshUser,
    updateUser,
    clearError,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

/**
 * Helper hooks for common user checks
 */
export const useIsAuthenticated = () => {
  const { user, loading } = useUser();
  return { isAuthenticated: !!user, loading };
};

export const useIsAdmin = () => {
  const { user, loading } = useUser();
  return { isAdmin: user?.roles?.includes('admin') ?? false, loading };
};

export const useUserProfile = () => {
  const { user, loading, updateUser, error, clearError } = useUser();
  
  return {
    profile: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.meta_data.mobileNumber,
      profilePicture: user.profilePicture,
    } : null,
    loading,
    error,
    updateProfile: updateUser,
    clearError,
  };
};