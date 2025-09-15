// src/app/dashboard/user/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useUser } from "@/context/userContext";
import {
  getEnrolledCourses,
  type UserProgress,
  type Course,
} from "@/services/course";
import Link from "next/link";
import Image from "next/image";

interface EnrolledCourseWithProgress extends UserProgress {
  course: Course;
}

function UserDashboard() {
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLecturesCompleted: 0,
  });

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const courses = await getEnrolledCourses();
      setEnrolledCourses(courses);

      // Calculate stats
      const totalEnrolled = courses.length;
      const completedCourses = courses.filter(
        (c) => c.progressPercentage === 100
      ).length;
      const inProgressCourses = courses.filter(
        (c) => c.progressPercentage > 0 && c.progressPercentage < 100
      ).length;
      const totalLecturesCompleted = courses.reduce(
        (sum, c) => sum + c.completedLectures.length,
        0
      );

      setStats({
        totalEnrolled,
        completedCourses,
        inProgressCourses,
        totalLecturesCompleted,
      });
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return "bg-gray-300";
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-yellow-500";
    if (percentage < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const getProgressText = (percentage: number) => {
    if (percentage === 0) return "Not Started";
    if (percentage === 100) return "Completed";
    return "In Progress";
  };

  const formatLastAccessed = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  console.log({ enrolledCourses });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back,{" "}
            {user?.firstName || user?.email?.split("@")[0] || "Student"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalEnrolled}
                </h3>
                <p className="text-gray-600">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.completedCourses}
                </h3>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">📈</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.inProgressCourses}
                </h3>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalLecturesCompleted}
                </h3>
                <p className="text-gray-600">Lectures Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Courses
            </Link>
            <Link
              href="/dashboard/user/profile"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Update Profile
            </Link>
            {stats.completedCourses > 0 && (
              <Link
                href="/dashboard/user/certificates"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View Certificates ({stats.completedCourses})
              </Link>
            )}
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <p className="text-gray-600 mt-1">Continue where you left off</p>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Courses Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start your learning journey by enrolling in a course
              </p>
              <Link
                href="/courses"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.map((enrollment) => (
                  <div
                    key={enrollment._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Course Image Placeholder */}
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-4xl">📚</span>
                      </div>

                      {/* Progress Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            enrollment.progressPercentage === 100
                              ? "bg-green-500"
                              : enrollment.progressPercentage > 0
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {getProgressText(enrollment.progressPercentage)}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {enrollment?.courseId && enrollment?.courseId?.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Progress tracking and learning analytics
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>
                            {Math.round(enrollment.progressPercentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                              enrollment.progressPercentage
                            )}`}
                            style={{
                              width: `${enrollment.progressPercentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="text-sm text-gray-500 mb-4 space-y-1">
                        <div>
                          <span className="font-medium">Enrolled:</span>{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Accessed:</span>{" "}
                          {formatLastAccessed(enrollment.lastAccessed)}
                        </div>
                        <div>
                          <span className="font-medium">
                            Completed Lectures:
                          </span>{" "}
                          {enrollment.completedLectures.length}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          href={`/learn/${enrollment.courseId._id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          {enrollment.progressPercentage === 0
                            ? "Start Learning"
                            : "Continue"}
                        </Link>
                        <Link
                          href={`/courses/${enrollment.courseId._id}`}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Details
                        </Link>
                      </div>

                      {/* Achievement Badge */}
                      {enrollment.progressPercentage === 100 && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <span>🏆</span>
                            <span className="font-medium">
                              Course Completed!
                            </span>
                            <Link
                              href={`/certificates/${enrollment.courseId}`}
                              className="ml-auto text-green-600 hover:text-green-800 text-sm underline"
                            >
                              View Certificate
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            {enrolledCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {enrolledCourses
                  .filter((c) => c.lastAccessed)
                  .sort(
                    (a, b) =>
                      new Date(b.lastAccessed!).getTime() -
                      new Date(a.lastAccessed!).getTime()
                  )
                  .slice(0, 5)
                  .map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded flex items-center justify-center text-white text-lg">
                        📚
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {enrollment?.courseId && enrollment?.courseId?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Last accessed{" "}
                          {formatLastAccessed(enrollment.lastAccessed)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(enrollment.progressPercentage)}% Complete
                        </div>
                        <Link
                          href={`/learn/${enrollment.courseId._id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Continue →
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Keep Learning! 🚀</h2>
            <p className="text-blue-100 mb-6">
              You&apos;re doing great!{" "}
              {stats.completedCourses > 0
                ? `You've completed ${stats.completedCourses} course${
                    stats.completedCourses > 1 ? "s" : ""
                  }. `
                : ""}
              {stats.inProgressCourses > 0
                ? `Keep going with your ${
                    stats.inProgressCourses
                  } ongoing course${stats.inProgressCourses > 1 ? "s" : ""}.`
                : "Ready to start your first course?"}
            </p>
            <div className="flex gap-4">
              <Link
                href="/courses"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Explore More Courses
              </Link>
              {stats.inProgressCourses > 0 && (
                <Link
                  href={`/learn/${
                    enrolledCourses.find(
                      (c) =>
                        c.progressPercentage > 0 && c.progressPercentage < 100
                    )?.courseId._id
                  }`}
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                >
                  Continue Learning
                </Link>
              )}
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
      <UserDashboard />
    </SessionAuth>
  );
}
