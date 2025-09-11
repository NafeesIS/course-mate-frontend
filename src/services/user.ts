// // src/services/user.ts
// import { config } from '@/config';

// export interface User {
//   _id: string;
//   email: string;
//   supertokensId: string;
//   role: 'admin' | 'user';
//   createdAt: string;
//   firstName?: string;
//   lastName?: string;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
// }

// class ApiError extends Error {
//   constructor(public status: number, message: string) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// // Helper function to make authenticated API calls
// async function apiCall<T>(
//   endpoint: string, 
//   options: RequestInit = {}
// ): Promise<ApiResponse<T>> {
//   const url = `${config.API_URL}${endpoint}`;
  
//   const defaultOptions: RequestInit = {
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//     ...options,
//   };

//   try {
//     const response = await fetch(url, defaultOptions);
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new ApiError(
//         response.status,
//         errorData.message || `HTTP ${response.status}: ${response.statusText}`
//       );
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw error;
//     }
    
//     // Network or parsing error
//     throw new ApiError(0, error instanceof Error ? error.message : 'Network error occurred');
//   }
// }

// // Get current user information
// export async function getUserInfo(): Promise<User> {
//   try {
//     const response = await apiCall<User>('/auth/me');
    
//     if (!response.success || !response.data) {
//       throw new ApiError(404, 'User information not found');
//     }
    
//     return response.data;
//   } catch (error) {
//     if (error instanceof ApiError) {
//       // Handle specific error cases
//       if (error.status === 401) {
//         throw new ApiError(401, 'Please log in to continue');
//       } else if (error.status === 404) {
//         throw new ApiError(404, 'User profile not found');
//       }
//     }
//     throw error;
//   }
// }

// // Update user profile
// export async function updateUserProfile(updates: Partial<Pick<User, 'firstName' | 'lastName'>>): Promise<User> {
//   const response = await apiCall<User>('/auth/me', {
//     method: 'PATCH',
//     body: JSON.stringify(updates),
//   });
  
//   if (!response.success || !response.data) {
//     throw new ApiError(400, 'Failed to update profile');
//   }
  
//   return response.data;
// }

// // Create user (typically called after SuperTokens registration)
// export async function createUser(userData: {
//   supertokensId: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   role?: 'admin' | 'user';
// }): Promise<User> {
//   const response = await apiCall<User>('/auth', {
//     method: 'POST',
//     body: JSON.stringify(userData),
//   });
  
//   if (!response.success || !response.data) {
//     throw new ApiError(400, 'Failed to create user profile');
//   }
  
//   return response.data;
// }

// // Get all users (admin only)
// export async function getAllUsers(): Promise<User[]> {
//   const response = await apiCall<User[]>('/users');
  
//   if (!response.success || !response.data) {
//     throw new ApiError(400, 'Failed to fetch users');
//   }
  
//   return response.data;
// }

// // Delete user (admin only)
// export async function deleteUser(userId: string): Promise<void> {
//   const response = await apiCall(`/users/${userId}`, {
//     method: 'DELETE',
//   });
  
//   if (!response.success) {
//     throw new ApiError(400, 'Failed to delete user');
//   }
// }

// // Check if user has admin role
// export function isAdmin(user: User | null): boolean {
//   return user?.role === 'admin';
// }

// // Get user display name
// export function getUserDisplayName(user: User | null): string {
//   if (!user) return 'Guest';
  
//   if (user.firstName) {
//     return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
//   }
  
//   return user.email.split('@')[0] || 'User';
// }

// // Get user initials for avatar
// export function getUserInitials(user: User | null): string {
//   if (!user) return 'G';
  
//   if (user.firstName) {
//     const firstInitial = user.firstName.charAt(0).toUpperCase();
//     const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
//     return firstInitial + lastInitial;
//   }
  
//   return user.email.charAt(0).toUpperCase();
// }

export async function getUserInfo() {
  const res = await fetch("http://localhost:4000/auth/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}