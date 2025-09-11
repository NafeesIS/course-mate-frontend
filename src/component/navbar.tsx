"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function Navbar() {
  const { user, loading } = useUser();
  const sessionContext = useSessionContext();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Course Mate 🎓
      </Link>
      <div className="flex gap-4 items-center">
        {loading || sessionContext.loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : !sessionContext.doesSessionExist ? (
          <Link href="/auth" className="text-blue-600 font-medium hover:underline">
            Login / Signup
          </Link>
        ) : (
          <>
            <div className="text-sm text-gray-600">
              Welcome, {user?.email || "User"}
            </div>
            <Link href="/dashboard" className="text-green-600 font-medium hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="text-red-600 font-medium hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}