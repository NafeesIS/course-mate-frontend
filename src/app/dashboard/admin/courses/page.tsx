// src/app/admin/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useUser } from "@/context/userContext";
import { getCourses, deleteCourse, type Course } from "@/services/course";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  onDelete: (id: string) => void;
}

function CourseCard({ course, onDelete }: CourseCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCourse(course._id);
      onDelete(course._id);
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Image
        src={course.thumbnail || "/api/placeholder/300/200"}
        alt={course.title}
        width={200}
        height={150}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {course.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-green-600">
            ${course.price}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/courses/${course._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Manage Content
          </Link>
          <Link
            href={`/admin/courses/${course._id}/edit`}
            className="bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminCoursesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchCourses();
  }, [user, currentPage, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses({
        searchTerm,
        page: currentPage,
        limit: 12,
        sort: "-createdAt",
      });
      setCourses(response.result);
      setTotalPages(response.meta.totalPage);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course._id !== courseId));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  if (user && user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Course Management
            </h1>
            <Link
              href="/admin/courses/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Create Course
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No Courses Found
            </h2>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first course to get started"}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/courses/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Create First Course
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <SessionAuth>
      <AdminCoursesPage />
    </SessionAuth>
  );
}
