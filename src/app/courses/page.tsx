// src/app/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getCourses, enrollInCourse, type Course } from "@/services/course";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  isAuthenticated: boolean;
  onEnroll?: (courseId: string) => void;
}

function CourseCard({ course, isAuthenticated, onEnroll }: CourseCardProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!isAuthenticated || !onEnroll) return;

    setIsEnrolling(true);
    try {
      await onEnroll(course._id);
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const getThumbnailFromVideo = (url: string) => {
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <Image
          src={course.thumbnail || "/api/placeholder/400/240"}
          alt={course.title}
          width={200}
          height={150}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${course.price}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <span>
              Created {new Date(course.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/courses/${course._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Details
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isEnrolling ? "Enrolling..." : "Enroll"}
            </button>
          )}
        </div>

        {!isAuthenticated && (
          <p className="text-center text-gray-500 text-sm mt-3">
            <Link href="/auth" className="text-blue-600 hover:underline">
              Login to enroll
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { user } = useUser();
  const sessionContext = useSessionContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">(
    "all"
  );

  const isAuthenticated =
    !sessionContext.loading && sessionContext.doesSessionExist;

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, priceFilter]);

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

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);
      alert("Successfully enrolled in the course!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("Already enrolled")) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Discover Amazing Courses
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Learn new skills, advance your career, and achieve your goals with
              our comprehensive course catalog
            </p>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-4 mb-6"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses by title or description..."
                    className="w-full px-6 py-4 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  Search
                </button>
              </form>

              {/* Price Filter */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPriceFilter("all")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    priceFilter === "all"
                      ? "bg-white text-blue-600"
                      : "bg-blue-700 text-white hover:bg-blue-800"
                  }`}
                >
                  All Courses
                </button>
                <button
                  onClick={() => setPriceFilter("free")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    priceFilter === "free"
                      ? "bg-white text-blue-600"
                      : "bg-blue-700 text-white hover:bg-blue-800"
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => setPriceFilter("paid")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    priceFilter === "paid"
                      ? "bg-white text-blue-600"
                      : "bg-blue-700 text-white hover:bg-blue-800"
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-500 mb-6">
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
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : "Available Courses"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  My Learning
                </Link>
              )}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isAuthenticated={isAuthenticated}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
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
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students and start your learning journey today
            </p>
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg inline-block"
            >
              Sign Up Now - It&apos;s Free!
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
