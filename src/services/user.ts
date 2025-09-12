// src/services/user.ts
import { config } from '@/config';

export interface User {
  _id: string;
  email: string;
  supertokensId: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Get current user information
export async function getUserInfo(): Promise<User> {
  const response = await fetch(`${config.API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  const data: ApiResponse<User> = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch user info');
  }

  return data.data;
}

// Update user profile
export async function updateUserProfile(updates: {
  firstName?: string;
  lastName?: string;
}): Promise<User> {
  const response = await fetch(`${config.API_URL}/auth/me`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.status}`);
  }

  const data: ApiResponse<User> = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data.data;
}

// Helper functions
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  
  if (user.firstName) {
    return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
  }
  
  return user.email.split('@')[0] || 'User';
}