// src/app/courses/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import {
  getCourse,
  getModulesByCourse,
  getLecturesByModule,
  enrollInCourse,
  getUserProgress,
  type Course,
  type Module,
  type Lecture,
  type UserProgress,
} from "@/services/course";
import Link from "next/link";
import Image from "next/image";

interface ModuleWithLectures extends Module {
  lectures: Lecture[];
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const sessionContext = useSessionContext();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLectures[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const isAuthenticated =
    !sessionContext.loading && sessionContext.doesSessionExist;
  const isEnrolled = userProgress !== null;

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseData = await getCourse(courseId);
      setCourse(courseData);

      // Fetch modules and lectures
      const modulesData = await getModulesByCourse(courseId);
      const modulesWithLectures = await Promise.all(
        modulesData.map(async (module) => {
          try {
            const lectures = await getLecturesByModule(module._id);
            return { ...module, lectures };
          } catch (error) {
            console.error(
              `Failed to fetch lectures for module ${module._id}:`,
              error
            );
            return { ...module, lectures: [] };
          }
        })
      );
      setModules(modulesWithLectures);

      // Fetch user progress if authenticated
      if (isAuthenticated && user) {
        try {
          const progress = await getUserProgress(courseId);
          setUserProgress(progress);
        } catch (error) {
          // User not enrolled, which is fine
          setUserProgress(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch course data:", error);
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    setEnrolling(true);
    try {
      await enrollInCourse(courseId);
      alert("Successfully enrolled in the course!");
      await fetchCourseData(); // Refresh to get progress data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("Already enrolled")) {
        alert("You are already enrolled in this course!");
        await fetchCourseData();
      } else {
        alert(error.message || "Failed to enroll. Please try again.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const totalLectures = modules.reduce(
    (total, module) => total + module.lectures.length,
    0
  );
  const completedLectures = userProgress?.completedLectures?.length || 0;

  if (loading) {
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
          <Link href="/courses" className="text-blue-600 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">📚</span>
                  <span>{modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">🎥</span>
                  <span>{totalLectures} Lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">📅</span>
                  <span>
                    Created {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar (if enrolled) */}
              {isEnrolled && userProgress && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {completedLectures} of {totalLectures} lectures completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${userProgress.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {userProgress.progressPercentage}% Complete
                  </p>
                </div>
              )}
            </div>

            {/* Course Thumbnail & Enrollment */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
                <Image
                  src={course.thumbnail || "/api/placeholder/400/250"}
                  alt={course.title}
                  width={200}
                  height={150}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${course.price}
                    </div>
                    {course.price === 0 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Enrollment Button */}
                  {!isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        href="/auth"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center block"
                      >
                        Login to Enroll
                      </Link>
                      <p className="text-center text-gray-500 text-sm">
                        Create an account to access this course
                      </p>
                    </div>
                  ) : isEnrolled ? (
                    <div className="space-y-3">
                      <Link
                        href={`/learn/${courseId}`}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block"
                      >
                        Continue Learning
                      </Link>
                      <p className="text-center text-green-600 text-sm font-semibold">
                        ✓ You&apos;re enrolled in this course
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                  )}

                  {/* Course Includes */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      This course includes:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {totalLectures} video lectures
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Downloadable resources
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Lifetime access
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Progress tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
            <p className="text-gray-600 mt-2">
              {modules.length} modules • {totalLectures} lectures
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {modules.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  No content available for this course yet.
                </p>
              </div>
            ) : (
              modules.map((module, moduleIndex) => (
                <div key={module._id} className="p-6">
                  <button
                    onClick={() => toggleModule(module._id)}
                    className="w-full flex justify-between items-center text-left hover:bg-gray-50 rounded-lg p-3 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Module {module.moduleNumber}: {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {module.lectures.length} lectures
                      </p>
                    </div>
                    <span className="text-gray-400 text-xl">
                      {expandedModule === module._id ? "−" : "+"}
                    </span>
                  </button>

                  {expandedModule === module._id && (
                    <div className="mt-4 pl-6 space-y-3">
                      {module.lectures.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No lectures in this module
                        </p>
                      ) : (
                        module.lectures.map((lecture, lectureIndex) => {
                          const isCompleted =
                            userProgress?.completedLectures?.includes(
                              lecture._id
                            ) || false;
                          const isAccessible = isEnrolled || moduleIndex === 0; // First module preview for non-enrolled users

                          return (
                            <div
                              key={lecture._id}
                              className="flex items-center gap-3 py-2"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                  isCompleted
                                    ? "bg-green-500 text-white"
                                    : isAccessible
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-200 text-gray-400"
                                }`}
                              >
                                {isCompleted ? "✓" : lecture.lectureNumber}
                              </div>

                              <div className="flex-1">
                                <h4
                                  className={`font-medium ${
                                    isAccessible
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Lecture {lecture.lectureNumber}:{" "}
                                  {lecture.title}
                                </h4>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {lecture.content}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {lecture.videoUrl && (
                                  <span className="text-blue-600 text-sm">
                                    🎥 Video
                                  </span>
                                )}
                                {!isAccessible && (
                                  <span className="text-gray-400 text-sm">
                                    🔒 Locked
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructor Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              👨‍🏫
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Expert Instructor
              </h3>
              <p className="text-gray-600">
                Course Creator & Industry Professional
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Experienced educator with years of industry expertise
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Student Reviews
          </h2>

          {/* Overall Rating */}
          <div className="flex items-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">4.8</div>
              <div className="flex justify-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-1">Course Rating</p>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-3">{rating}</span>
                    <span className="text-yellow-400">★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${
                            rating === 5 ? 75 : rating === 4 ? 20 : 5
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {rating === 5 ? "75%" : rating === 4 ? "20%" : "5%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Reviews */}
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  JD
                </div>
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                Excellent course! The content is well-structured and easy to
                follow. The instructor explains complex concepts in a simple
                way.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  SM
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sarah Miller</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                Great value for money! I learned so much from this course. The
                practical examples really helped me understand the concepts.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  MJ
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mike Johnson</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <span key={star} className="text-yellow-400 text-sm">
                        ★
                      </span>
                    ))}
                    <span className="text-gray-300 text-sm">★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                Good course overall. Some sections could be more detailed, but
                it covers all the essential topics well.
              </p>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample related courses - in a real app, these would come from the API */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Sample Course {i}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Learn advanced concepts in this related course
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">$29.99</span>
                    <span className="text-yellow-400">★ 4.7</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
