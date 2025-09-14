"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useUser } from "@/context/userContext";
import { getCourse, updateCourse, type Course } from "@/services/course";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { generateImageUrl } from "@/utils/gegerateImageUrl";

export interface UpdateCourse {
  title?: string;
  description?: string;
  price?: number;
  thumbnail?: File | string;
  createdBy?: string;
  isActive?: boolean;
}

function EditCoursePage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "", // We will store the URL or file here
    fileThumbnail: null as File | null, // For file input (for file uploads)
  });

  useEffect(() => {
    if (user && !user?.roles?.includes("admin")) {
      router.push("/dashboard");
      return;
    }

    if (courseId) {
      fetchCourse();
    }
  }, [user, courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const courseData = await getCourse(courseId);
      setCourse(courseData);
      setFormData({
        title: courseData.title,
        description: courseData.description,
        price: courseData.price.toString(),
        thumbnail: courseData.thumbnail,
        fileThumbnail: null, // Reset file on load
      });
    } catch (error) {
      console.error("Failed to fetch course:", error);
      alert("Failed to load course data");
      router.push("/dashboard/admin/courses");
    } finally {
      setIsLoading(false);
    }
  };

  if (user && !user?.roles?.includes("admin")) {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      fileThumbnail: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      (!formData.thumbnail && !formData.fileThumbnail) // Ensure either URL or File is provided
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedCourseData: UpdateCourse = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
      };

      // If a file is provided, attach it
      if (formData.fileThumbnail) {
        updatedCourseData.thumbnail = formData.fileThumbnail; // Use the file for thumbnail
      }

      await updateCourse(courseId, updatedCourseData);

      alert("Course updated successfully!");
      router.push("/dashboard/admin/courses");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to update course:", error);
      alert(error.message || "Failed to update course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Course Not Found
          </h1>
          <p className="text-gray-600">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/dashboard/admin/courses"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.price &&
    (formData.thumbnail || formData.fileThumbnail); // Either URL or File must be provided
  const hasChanges =
    formData.title !== course.title ||
    formData.description !== course.description ||
    formData.price !== course.price.toString() ||
    formData.thumbnail !== course.thumbnail ||
    formData.fileThumbnail !== null;
  const imageUrl = generateImageUrl(formData.thumbnail);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard/admin/courses"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Courses
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-2">Update course information</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Course Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed course description..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                required
              />
            </div>

            {/* Course Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Course Thumbnail URL or File */}
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Thumbnail Image URL or File *
              </label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {/* File Input for Image Upload */}
              <div className="mt-3">
                <input
                  type="file"
                  id="fileThumbnail"
                  name="fileThumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {formData.fileThumbnail ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">File Preview:</p>
                  <Image
                    src={URL.createObjectURL(formData.fileThumbnail)}
                    alt="Thumbnail preview"
                    width={200}
                    height={150}
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ) : imageUrl ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <Image
                    src={imageUrl}
                    alt="Thumbnail preview"
                    width={200}
                    height={150}
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none"; // Hide the image on error
                    }}
                  />
                </div>
              ) : null}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={!isFormValid || !hasChanges || isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? "Updating..." : "Update Course"}
              </button>

              <Link
                href="/dashboard/admin/courses"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
              >
                Cancel
              </Link>

              <Link
                href={`/dashboard/admin/courses/${courseId}`}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
              >
                Manage Content
              </Link>
            </div>

            {!hasChanges && isFormValid && (
              <p className="text-sm text-gray-500 text-center">
                No changes detected
              </p>
            )}
          </form>
        </div>

        {/* Course Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Course Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Created:</span>{" "}
              {new Date(course.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(course.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Course ID:</span> {course._id}
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
      <EditCoursePage />
    </SessionAuth>
  );
}
