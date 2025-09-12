// src/app/learn/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import {
  getCourseWithStructure,
  getUserProgress,
  markLectureComplete,
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

interface CourseWithStructure extends Course {
  modules: ModuleWithLectures[];
}

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const sessionContext = useSessionContext();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseWithStructure | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const isAuthenticated = !sessionContext.loading && sessionContext.doesSessionExist;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, isAuthenticated, router]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course structure
      const courseData = await getCourseWithStructure(courseId);
      setCourse(courseData);

      // Fetch user progress
      const progress = await getUserProgress(courseId);
      setUserProgress(progress);

      // Set current lecture (either from progress or first lecture)
      if (progress.currentLecture) {
        const currentLec = findLectureById(courseData.modules, progress.currentLecture);
        setCurrentLecture(currentLec);
      } else if (courseData.modules[0]?.lectures[0]) {
        setCurrentLecture(courseData.modules[0].lectures[0]);
      }

      // Expand all modules by default
      setExpandedModules(new Set(courseData.modules.map(m => m._id)));

    } catch (error) {
      console.error("Failed to fetch course data:", error);
      alert("Failed to load course. You may not be enrolled.");
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const findLectureById = (modules: ModuleWithLectures[], lectureId: string): Lecture | null => {
    for (const singleModule of modules) {
      const lecture = singleModule.lectures.find(l => l._id === lectureId);
      if (lecture) return lecture;
    }
    return null;
  };

  const isLectureUnlocked = (lecture: Lecture): boolean => {
    if (!userProgress) return false;
    
    // First lecture of first module is always unlocked
    if (course?.modules[0]?.lectures[0]?._id === lecture._id) {
      return true;
    }

    // Check if previous lectures are completed
    const allLectures = course?.modules.flatMap(m => m.lectures) || [];
    const lectureIndex = allLectures.findIndex(l => l._id === lecture._id);
    
    if (lectureIndex === 0) return true;
    
    const previousLecture = allLectures[lectureIndex - 1];
    return userProgress.completedLectures.includes(previousLecture._id);
  };

  const handleLectureSelect = (lecture: Lecture) => {
    if (isLectureUnlocked(lecture)) {
      setCurrentLecture(lecture);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLecture || !userProgress) return;

    try {
      const updatedProgress = await markLectureComplete(currentLecture._id);
      setUserProgress(updatedProgress);

      // Auto-advance to next lecture if available
      const allLectures = course?.modules.flatMap(m => m.lectures) || [];
      const currentIndex = allLectures.findIndex(l => l._id === currentLecture._id);
      const nextLecture = allLectures[currentIndex + 1];
      
      if (nextLecture) {
        setCurrentLecture(nextLecture);
      }
    } catch (error) {
      console.error("Failed to mark lecture complete:", error);
      alert("Failed to mark lecture as complete");
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const filteredModules = course?.modules.map(module => ({
    ...module,
    lectures: module.lectures.filter(lecture =>
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(module => 
    searchTerm === "" || module.lectures.length > 0
  ) || [];

  const isLectureCompleted = (lectureId: string) => {
    return userProgress?.completedLectures.includes(lectureId) || false;
  };

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
          <h1 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-4">You may not be enrolled in this course.</p>
          <Link href="/courses" className="text-blue-600 hover:underline">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLectures = course.modules.reduce((sum, module) => sum + module.lectures.length, 0);
  const completedLectures = userProgress?.completedLectures.length || 0;
  const progressPercentage = totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1 bg-white border-r border-gray-200 overflow-y-auto">
            {/* Course Header */}
            <div className="p-6 border-b border-gray-200">
              <Link
                href={`/courses/${courseId}`}
                className="text-blue-600 hover:text-blue-800 text-sm mb-3 inline-block"
              >
                ← Back to Course Details
              </Link>
              
              <Image
                src={course.thumbnail || "/api/placeholder/300/150"}
                alt={course.title}
                width={300}
                height={150}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              
              <h1 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h1>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{completedLectures}/{totalLectures}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% Complete</p>
              </div>

              {/* Search Lectures */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search lectures..."
                  className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Modules and Lectures */}
            <div className="p-4">
              {filteredModules.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No lectures found matching {searchTerm}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredModules.map((module) => (
                    <div key={module._id}>
                      <button
                        onClick={() => toggleModule(module._id)}
                        className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Module {module.moduleNumber}: {module.title}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {expandedModules.has(module._id) ? "−" : "+"}
                        </span>
                      </button>

                      {expandedModules.has(module._id) && (
                        <div className="ml-4 mt-2 space-y-1">
                          {module.lectures.map((lecture) => {
                            const isUnlocked = isLectureUnlocked(lecture);
                            const isCompleted = isLectureCompleted(lecture._id);
                            const isCurrent = currentLecture?._id === lecture._id;

                            return (
                              <button
                                key={lecture._id}
                                onClick={() => handleLectureSelect(lecture)}
                                disabled={!isUnlocked}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                  isCurrent
                                    ? "bg-blue-100 border-l-4 border-blue-500"
                                    : isUnlocked
                                    ? "hover:bg-gray-50"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                    isCompleted
                                      ? "bg-green-500 text-white"
                                      : isUnlocked
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-200 text-gray-400"
                                  }`}>
                                    {isCompleted ? "✓" : !isUnlocked ? "🔒" : lecture.lectureNumber}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className={`text-sm font-medium ${
                                      isUnlocked ? "text-gray-900" : "text-gray-400"
                                    }`}>
                                      Lecture {lecture.lectureNumber}: {lecture.title}
                                    </h4>
                                  </div>
                                  {lecture.videoUrl && (
                                    <span className="text-blue-500 text-xs">🎥</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-white">
            {currentLecture ? (
              <div className="h-full flex flex-col">
                {/* Lecture Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Lecture {currentLecture.lectureNumber}: {currentLecture.title}
                      </h2>
                      <p className="text-gray-600 mt-2">{currentLecture.content}</p>
                    </div>
                    
                    {!isLectureCompleted(currentLecture._id) && (
                      <button
                        onClick={handleMarkComplete}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>

                  {isLectureCompleted(currentLecture._id) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <span>✅</span>
                        <span className="font-medium">Lecture Completed</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Player */}
                <div className="flex-1 p-6">
                  {currentLecture.videoUrl ? (
                    <div className="mb-8">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        {extractYouTubeId(currentLecture.videoUrl) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(currentLecture.videoUrl)}`}
                            title={currentLecture.title}
                            className="w-full h-96 rounded-lg shadow-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={currentLecture.videoUrl}
                            controls
                            className="w-full h-96 rounded-lg shadow-lg"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center mb-8">
                      <div className="text-gray-400 text-4xl mb-4">🎥</div>
                      <p className="text-gray-600">No video available for this lecture</p>
                    </div>
                  )}

                  {/* Lecture Content */}
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lecture Notes</h3>
                      <div className="text-gray-700 leading-relaxed">
                        {currentLecture.content}
                      </div>
                    </div>

                    {/* Placeholder for PDF notes */}
                    <div className="mt-6 bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Downloadable Resources</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-700">
                          <span>📄</span>
                          <span>Lecture Notes - Coming Soon</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-700">
                          <span>📊</span>
                          <span>Supplementary Materials - Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                    Welcome to Your Course
                  </h2>
                  <p className="text-gray-500">
                    Select a lecture from the sidebar to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}