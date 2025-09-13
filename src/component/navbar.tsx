// src/components/navbar.tsx
"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Enhanced Navigation Component
 * Modern, responsive navbar with elegant design
 */

export default function Navbar() {
  const { user, loading } = useUser();
  const sessionContext = useSessionContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
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
      return (user.firstName[0] + (user.lastName?.[0] || "")).toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-200">📚</div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Course Mate
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Learn. Grow. Excel.</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href="/courses" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActivePath('/courses')
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Browse Courses
              </Link>
              
              {!sessionContext.loading && sessionContext.doesSessionExist && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActivePath('/dashboard')
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {user?.roles?.includes("admin") ? "Admin Panel" : "My Learning"}
                  </Link>
                  
                  {user?.roles?.includes("admin") && (
                    <Link 
                      href="/dashboard/admin/courses" 
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActivePath('/dashboard/admin/courses')
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
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
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : !sessionContext.doesSessionExist ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/auth" 
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 border">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {getUserInitials()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 leading-tight">
                        {getUserDisplayName()}
                      </span>
                      <span className="text-xs text-gray-500 capitalize leading-tight">
                        {user?.roles?.[0] || "Student"}
                      </span>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Sign Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
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
            <div className="md:hidden bg-white border-t border-gray-100 shadow-lg rounded-b-xl">
              <div className="px-4 py-6 space-y-3">
                <Link 
                  href="/courses"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActivePath('/courses')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Browse Courses
                </Link>
                
                {!sessionContext.loading && sessionContext.doesSessionExist && (
                  <>
                    <Link 
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActivePath('/dashboard')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      {user?.roles?.includes("admin") ? "Admin Panel" : "My Learning"}
                    </Link>
                    
                    {user?.roles?.includes("admin") && (
                      <Link 
                        href="/dashboard/admin/courses"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActivePath('/dashboard/admin/courses')
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        Manage Courses
                      </Link>
                    )}
                  </>
                )}

                {/* User Section - Mobile */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  {loading || sessionContext.loading ? (
                    <div className="px-4 py-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ) : !sessionContext.doesSessionExist ? (
                    <div className="space-y-3">
                      <Link 
                        href="/auth"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-gray-600 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/auth"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-center shadow-md"
                      >
                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="px-4 py-3 flex items-center space-x-3 bg-gray-50 rounded-lg border">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                          {getUserInitials()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">
                            {getUserDisplayName()}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {user?.roles?.[0] || "Student"}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-left flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}