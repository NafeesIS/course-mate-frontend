// src/app/dashboard/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useUser } from "@/context/userContext";
import { getCourses, type Course } from "@/services/course";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { generateImageUrl } from "@/utils/gegerateImageUrl";

/**
 * Enhanced Admin Dashboard
 * Beautiful overview with statistics, recent courses, and quick actions
 */

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalRevenue: number;
  avgCoursePrice: number;
  recentCourses: Course[];
}

function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    activeCourses: 0,
    totalRevenue: 0,
    avgCoursePrice: 0,
    recentCourses: [],
  });

  // Access control
  useEffect(() => {
    if (!userLoading && user && !user.roles?.includes("admin")) {
      router.push("/dashboard");
      return;
    }

    if (!userLoading && user?.roles?.includes("admin")) {
      fetchDashboardData();
    }
  }, [user, userLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch courses for statistics
      const coursesResponse = await getCourses({
        limit: 50, // Get more courses for better stats
        sort: "-createdAt",
      });

      const courses = coursesResponse.result;
      const activeCourses = courses.filter((c) => c.isActive);
      const totalRevenue = courses.reduce((sum, c) => sum + c.price, 0);
      const avgPrice = courses.length > 0 ? totalRevenue / courses.length : 0;

      setStats({
        totalCourses: courses.length,
        activeCourses: activeCourses.length,
        totalRevenue,
        avgCoursePrice: avgPrice,
        recentCourses: courses.slice(0, 6), // Get 6 most recent
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create-course":
        router.push("/dashboard/admin/courses/create");
        break;
      case "manage-courses":
        router.push("/dashboard/admin/courses");
        break;
      case "view-analytics":
        // Future feature
        alert("Analytics feature coming soon!");
        break;
      default:
        break;
    }
  };

  // Access control render
  if (!userLoading && user && !user.roles?.includes("admin")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You don&apos;t have permission to access the admin dashboard.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-3xl">👨‍💼</div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-600">
                Welcome back, {user?.firstName || "Admin"}! Here&apos;s
                what&apos;s happening with your courses.
              </p>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0] || user?.email[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickAction("create-course")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">📚</div>
              <div className="font-semibold mb-1">Create Course</div>
              <div className="text-blue-100 text-sm">
                Add new course content
              </div>
            </button>

            <button
              onClick={() => handleQuickAction("manage-courses")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <div className="font-semibold mb-1">Manage Courses</div>
              <div className="text-green-100 text-sm">
                Edit existing courses
              </div>
            </button>

            <button
              onClick={() => handleQuickAction("view-analytics")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-semibold mb-1">Analytics</div>
              <div className="text-purple-100 text-sm">
                View performance data
              </div>
            </button>

            <Link
              href="/dashboard/admin/courses"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 block text-center"
            >
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold mb-1">All Courses</div>
              <div className="text-orange-100 text-sm">
                Browse course library
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Courses */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📚</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.totalCourses}
                    </h3>
                    <p className="text-gray-600 text-sm">Total Courses</p>
                  </div>
                </div>
              </div>

              {/* Active Courses */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.activeCourses}
                    </h3>
                    <p className="text-gray-600 text-sm">Active Courses</p>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${stats.totalRevenue.toFixed(2)}
                    </h3>
                    <p className="text-gray-600 text-sm">Total Value</p>
                  </div>
                </div>
              </div>

              {/* Average Price */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${stats.avgCoursePrice.toFixed(2)}
                    </h3>
                    <p className="text-gray-600 text-sm">Avg. Price</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Courses
            </h2>
            <Link
              href="/dashboard/admin/courses"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats.recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentCourses.map((course) => {
                const imageUrl = generateImageUrl(course.thumbnail); // Declare imageUrl outside JSX

                return (
                  <Link
                    key={course._id}
                    href={`/dashboard/admin/courses/${course._id}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={course.title}
                          width={300}
                          height={160}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ${course.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Courses Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first course to get started
              </p>
              <button
                onClick={() => handleQuickAction("create-course")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create First Course
              </button>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentCourses.slice(0, 3).map((course, index) => (
                  <div
                    key={course._id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          Course {course.title}
                        </span>{" "}
                        was created
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString()} at{" "}
                        {new Date(course.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {stats.recentCourses.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Guidelines */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Admin Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>
                Keep course titles clear and descriptive for better
                discoverability
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>Use high-quality thumbnails to attract more students</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>
                Structure courses with modules and lectures for better learning
                flow
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span>
                Regular content updates keep students engaged and coming back
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <SessionAuth>
      <AdminDashboard />
    </SessionAuth>
  );
}
