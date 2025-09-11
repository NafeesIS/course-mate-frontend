"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    // Let SuperTokens handle the callback
    const handleCallback = async () => {
      try {
        // SuperTokens will automatically process the callback
        // and create/login the user, then redirect
        router.push("/dashboard");
      } catch (error) {
        console.error("Google callback error:", error);
        router.push("/auth?error=google_callback_failed");
      }
    };

    // Small delay to ensure SuperTokens processes the callback
    const timer = setTimeout(handleCallback, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Completing Google sign-in...</p>
      </div>
    </div>
  );
}