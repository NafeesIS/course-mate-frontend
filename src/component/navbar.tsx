// src/components/navbar.tsx (Enhanced version)
"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useState } from "react";

export default function Navbar() {
  const { user, loading } = useUser();
  const sessionContext = useSessionContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.firstName 
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.email.split("@")[0];
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.firstName) {
      return user.firstName[0] + (user.lastName?.[0] || "");
    }
    return user.email[0].toUpperCase();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">📚</div>
            <span className="text-xl font-bold text-gray-800">Course Mate</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/courses" 
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Browse Courses
            </Link>
            
            {!sessionContext.loading && sessionContext.doesSessionExist && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {user?.role === "admin" ? "Admin Panel" : "My Learning"}
                </Link>
                
                {user?.role === "admin" && (
                  <Link 
                    href="/dashboard/admin/courses" 
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Manage Courses
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading || sessionContext.loading ? (
              <div className="animate-pulse flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
              </div>
            ) : !sessionContext.doesSessionExist ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {getUserDisplayName()}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {user?.role || "Student"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
              <Link 
                href="/courses"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                Browse Courses
              </Link>
              
              {!sessionContext.loading && sessionContext.doesSessionExist && (
                <>
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                  >
                    {user?.role === "admin" ? "Admin Panel" : "My Learning"}
                  </Link>
                  
                  {user?.role === "admin" && (
                    <Link 
                      href="/dashboard/admin/courses"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                    >
                      Manage Courses
                    </Link>
                  )}
                </>
              )}

              {/* User Section - Mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {loading || sessionContext.loading ? (
                  <div className="px-3 py-2">
                    <div className="animate-pulse flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="w-20 h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ) : !sessionContext.doesSessionExist ? (
                  <div className="space-y-2">
                    <Link 
                      href="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 bg-blue-600 text-white rounded-lg font-medium mx-3 text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getUserInitials()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                          {getUserDisplayName()}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {user?.role || "Student"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}