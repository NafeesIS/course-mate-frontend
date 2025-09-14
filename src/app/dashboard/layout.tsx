"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/userContext";

/**
 * Dashboard Layout Component
 * Handles authentication state and provides consistent layout for dashboard pages
 * Redirects unauthenticated users to login page
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionContext = useSessionContext();
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    if (!sessionContext.loading && !sessionContext.doesSessionExist && !user) {
      router.push("/auth?error=unauthorized");
    }
  }, [sessionContext, router, user]);

  // Show loading state while checking authentication
  if (sessionContext.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if no session
  if (!sessionContext.doesSessionExist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h1>
            <p className="text-gray-600 mb-6">
              Please sign in to access your dashboard.
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

  // Render dashboard content
  return <>{children}</>;
}
