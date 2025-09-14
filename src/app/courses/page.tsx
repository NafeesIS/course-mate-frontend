// src/app/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getCourses,
  enrollInCourse,
  getUserProgress,
  type Course,
} from "@/services/course";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import Link from "next/link";
import Image from "next/image";
import { generateImageUrl } from "@/utils/gegerateImageUrl";

interface EnrollmentStatus {
  [courseId: string]: {
    isEnrolled: boolean;
    progressPercentage?: number;
  };
}

interface CourseCardProps {
  course: Course;
  isAuthenticated: boolean;
  enrollmentStatus?: {
    isEnrolled: boolean;
    progressPercentage?: number;
  };
  onEnroll?: (courseId: string) => void;
}

function CourseCard({
  course,
  isAuthenticated,
  enrollmentStatus,
  onEnroll,
}: CourseCardProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const isEnrolled = enrollmentStatus?.isEnrolled || false;
  const progressPercentage = enrollmentStatus?.progressPercentage || 0;

  const handleEnroll = async () => {
    if (!isAuthenticated || !onEnroll || isEnrolled) return;

    setIsEnrolling(true);
    try {
      await onEnroll(course._id);
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const imageUrl = generateImageUrl(course.thumbnail);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
      <div className="relative overflow-hidden">
        <Image
          src={imageUrl || "/api/placeholder/400/240"}
          alt={course.title}
          width={400}
          height={240}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          {course.price === 0 ? (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              FREE
            </span>
          ) : (
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              ${course.price}
            </span>
          )}
        </div>

        {/* Enrollment Status Badge */}
        {isAuthenticated && isEnrolled && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              ENROLLED
            </span>
          </div>
        )}

        {/* Progress Bar for Enrolled Courses */}
        {isAuthenticated && isEnrolled && progressPercentage > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="flex justify-between items-center text-white text-xs mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {new Date(course.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-600">4.8</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={`/courses/${course._id}`}
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View Details
          </Link>

          {isAuthenticated ? (
            isEnrolled ? (
              <Link
                href={`/learn/${course._id}`}
                className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-center py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {progressPercentage > 0
                  ? "Continue Learning"
                  : "Start Learning"}
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isEnrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enrolling...
                  </span>
                ) : (
                  "Enroll Now"
                )}
              </button>
            )
          ) : (
            <Link
              href="/auth"
              className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-center py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Login to Enroll
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { user } = useUser();
  const sessionContext = useSessionContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentStatuses, setEnrollmentStatuses] =
    useState<EnrollmentStatus>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">(
    "all"
  );

  const isAuthenticated =
    !sessionContext.loading && sessionContext.doesSessionExist;
  const isAdmin = user?.roles?.includes("admin");
  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, priceFilter]);

  useEffect(() => {
    if (isAuthenticated && courses.length > 0) {
      fetchEnrollmentStatuses();
    }
  }, [isAuthenticated, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        page: currentPage,
        limit: 12,
        sort: "-createdAt",
      };

      if (searchTerm) {
        params.searchTerm = searchTerm;
      }

      const response = await getCourses(params);

      // Apply price filter on client side since API doesn't support it directly
      let filteredCourses = response.result;
      if (priceFilter === "free") {
        filteredCourses = response.result.filter(
          (course) => course.price === 0
        );
      } else if (priceFilter === "paid") {
        filteredCourses = response.result.filter((course) => course.price > 0);
      }

      setCourses(filteredCourses);
      setTotalPages(response.meta.totalPage);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollmentStatuses = async () => {
    try {
      const statuses: EnrollmentStatus = {};

      await Promise.all(
        courses.map(async (course) => {
          try {
            const progress = await getUserProgress(course._id);
            statuses[course._id] = {
              isEnrolled: true,
              progressPercentage: progress.progressPercentage || 0,
            };
          } catch (error) {
            // User not enrolled in this course
            statuses[course._id] = {
              isEnrolled: false,
            };
          }
        })
      );

      setEnrollmentStatuses(statuses);
    } catch (error) {
      console.error("Failed to fetch enrollment statuses:", error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);

      // Update enrollment status locally
      setEnrollmentStatuses((prev) => ({
        ...prev,
        [courseId]: {
          isEnrolled: true,
          progressPercentage: 0,
        },
      }));

      // Show success message
      alert("Successfully enrolled in the course!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("Already enrolled")) {
        // Update local state if already enrolled
        setEnrollmentStatuses((prev) => ({
          ...prev,
          [courseId]: {
            isEnrolled: true,
            progressPercentage: 0,
          },
        }));
        alert("You are already enrolled in this course!");
      } else {
        alert(error.message || "Failed to enroll. Please try again.");
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br pt-4 from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)`,
          }}
        ></div>


          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold mb-4 shadow-lg">
                🚀 Learn • Grow • Succeed
              </span>
              <h1 className="text-xl lg:text-3xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Discover Amazing
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Courses
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master new skills, advance your career, and transform your future
              with our
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
                {" "}
                world-class courses
              </span>
            </p>

            {/* Enhanced Search and Filter */}
          </div>
     
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              No Courses Found
            </h2>
            <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || priceFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No courses are available at the moment"}
            </p>
            {(searchTerm || priceFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("all");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:-translate-y-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Enhanced Results Header */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : "Available Courses"}
                </h2>
                <p className="text-gray-600 text-lg">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {isAuthenticated && !isAdmin && (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  My Learning Dashboard
                </Link>
              )}
            </div>

            {/* Enhanced Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isAuthenticated={isAuthenticated}
                  enrollmentStatus={enrollmentStatuses[course._id]}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-300 font-semibold disabled:hover:bg-transparent"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                          currentPage === page
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform -translate-y-1"
                            : "border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-300 font-semibold disabled:hover:bg-transparent"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced CTA Section */}
      {!isAuthenticated && (
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(255, 118, 117, 0.3) 0%, transparent 50%)`,
            }}
          ></div>

          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold mb-6 shadow-xl">
                🎓 JOIN THOUSANDS OF LEARNERS
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Ready to Start Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Learning Journey?
                </span>
              </h2>
            </div>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join our community of passionate learners and unlock your
              potential with expert-designed courses
            </p>

            <Link
              href="/auth"
              className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-5 rounded-2xl transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2"
            >
              Sign Up Now - It&apos;s Free!
            </Link>

            <div className="mt-8 flex justify-center gap-8 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No Credit Card Required
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Instant Access
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
