"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

/**
 * Dashboard Root Page
 * Redirects users to appropriate dashboard based on their role
 * Handles authentication state and loading
 */

export default function DashboardRoot() {
  const { user, loading: userLoading } = useUser();
  const sessionContext = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    // Wait for both session and user data to load
    if (sessionContext.loading || userLoading) {
      return;
    }

    // Redirect if not authenticated
    if (!sessionContext.doesSessionExist) {
      router.push("/auth?error=unauthorized");
      return;
    }

    // Redirect based on user role once user data is available
    if (user) {
      if (user.roles?.includes("admin")) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [sessionContext, userLoading, user, router]);

  // Show loading state
  if (sessionContext.loading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
          <div className="text-center">
            {/* Loading Animation */}
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl">📚</div>
              </div>
            </div>

            {/* Loading Text */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Dashboard
            </h2>
            <p className="text-gray-600">
              Please wait while we prepare your learning environment...
            </p>

            {/* Progress Steps */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
                Verifying authentication
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                Loading user profile
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                Preparing dashboard
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (!sessionContext.doesSessionExist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to access your dashboard.
            </p>
            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show user not found state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              User Profile Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              There seems to be an issue with your user profile. Please try signing out and back in.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
              >
                Retry
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium w-full"
              >
                Sign In Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting state (this should be brief)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
        <div className="text-center">
          {/* Success Animation */}
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-green-600 text-2xl">✓</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome, {user.firstName || user.email.split('@')[0]}!
          </h2>
          <p className="text-gray-600 mb-4">
            Redirecting to your {user.roles?.includes("admin") ? "admin" : "learning"} dashboard...
          </p>

          {/* Role Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            user.roles?.includes("admin") 
              ? "bg-purple-100 text-purple-800" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {user.roles?.includes("admin") ? "Administrator" : "Student"}
          </div>

          {/* Manual Navigation (fallback) */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">
              Taking too long? Navigate manually:
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/dashboard/user")}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                My Learning
              </button>
              {user.roles?.includes("admin") && (
                <button
                  onClick={() => router.push("/dashboard/admin")}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}