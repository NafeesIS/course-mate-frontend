"use client";

import { useState } from "react";
import { useUser } from "@/context/userContext";
import Link from "next/link";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function Navbar() {
  const { user, loading } = useUser();
  const sessionContext = useSessionContext();
  const [isOpen, setIsOpen] = useState(false); // For mobile menu toggle

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-100 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Course Mate 🎓
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {loading || sessionContext.loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : !sessionContext.doesSessionExist ? (
              <Link
                href="/auth"
                className="text-blue-600 font-medium hover:underline"
              >
                Login / Signup
              </Link>
            ) : (
              <>
                <div className="text-sm text-gray-600">
                  Welcome, {user?.email || "User"}
                </div>
                <Link
                  href="/dashboard"
                  className="text-green-600 font-medium hover:underline"
                >
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

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {loading || sessionContext.loading ? (
              <div className="text-gray-500 px-2 py-1">Loading...</div>
            ) : !sessionContext.doesSessionExist ? (
              <Link
                href="/auth"
                className="block px-3 py-2 text-blue-600 font-medium rounded hover:bg-gray-200"
              >
                Login / Signup
              </Link>
            ) : (
              <>
                <div className="px-3 py-2 text-gray-600 font-medium">
                  Welcome, {user?.email || "User"}
                </div>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-green-600 font-medium rounded hover:bg-gray-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-red-600 font-medium rounded hover:bg-gray-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
