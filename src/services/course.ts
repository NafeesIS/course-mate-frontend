// src/services/course.ts
import { config } from "@/config";

/**
 * Course Service API
 * Handles all course-related API calls with proper error handling
 * Matches backend API endpoints and data structures
 */

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  moduleNumber: number;
  courseId: Course;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lectureCount?: number;
}

export interface Lecture {
  _id: string;
  title: string;
  lectureNumber: number;
  videoUrl: string;
  pdfNotes: string[];
  moduleId: string;
  courseId: Course;
  isActive: boolean;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  isUnlocked?: boolean;
  isCompleted?: boolean;
}

export interface UserProgress {
  _id: string;
  userId: string;
  courseId: Course;
  currentLecture?: string;
  progressPercentage: number;
  completedLectures: string[];
  enrolledAt: string;
  lastAccessed?: string;
  isCompleted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  result: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

/**
 * Generic API call handler with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.API_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    if (!response.ok) {
      // Handle different error status codes
      switch (response.status) {
        case 401:
          throw new Error("Authentication required. Please sign in.");
        case 403:
          throw new Error("You do not have permission to perform this action.");
        case 404:
          throw new Error("Resource not found.");
        case 409:
          throw new Error("Resource already exists or conflict occurred.");
        case 429:
          throw new Error("Too many requests. Please try again later.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(`Request failed with status ${response.status}`);
      }
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Request failed");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}

// =============================================================================
// COURSE API CALLS
// =============================================================================

export async function getCourses(params?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<PaginatedResponse<Course>> {
  const queryString = params
    ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  const endpoint = queryString
    ? `${config.ENDPOINTS.COURSES.LIST}?${queryString}`
    : config.ENDPOINTS.COURSES.LIST;
  return apiCall<PaginatedResponse<Course>>(endpoint);
}

export async function getCourse(id: string): Promise<Course> {
  return apiCall<Course>(config.ENDPOINTS.COURSES.DETAIL(id));
}

export async function createCourse(courseData: {
  title: string;
  description: string;
  price: number;
  thumbnail: File; // Only expect a File object here
}): Promise<Course> {
  const formData = new FormData();

  // Append form data fields
  formData.append("title", courseData.title);
  formData.append("description", courseData.description);
  formData.append("price", courseData.price.toString()); // Convert price to string

  // Append thumbnail file
  formData.append("thumbnail", courseData.thumbnail);

  // Send API request using fetch
  const res = await fetch(`${config.API_URL}/courses`, {
    method: "POST",
    body: formData,
    credentials: "include", // Include credentials (cookies, etc.) in the request
  });

  if (!res.ok) {
    throw new Error("Failed to create course");
  }

  // Return the parsed JSON response from the backend
  return res.json();
}

export async function updateCourse(
  id: string,
  courseData: Partial<{
    title: string;
    description: string;
    price: number;
    thumbnail: File | string; // Either File or URL for thumbnail
  }>
): Promise<Course> {
  const formData = new FormData();

  // Append text fields to FormData
  formData.append("title", courseData.title || "");
  formData.append("description", courseData.description || "");
  formData.append("price", (courseData.price ?? 0).toString()); // Convert price to string if it's provided

  // If there's a file in thumbnail, append it to FormData, otherwise append the URL
  if (courseData.thumbnail instanceof File) {
    formData.append("thumbnail", courseData.thumbnail);
  }

  // Send the API request using fetch
  const res = await fetch(`${config.API_URL}/courses/update/${id}`, {
    method: "PATCH",
    body: formData, // Sending FormData
    credentials: "include", // To include cookies (for session handling)
  });

  if (!res.ok) {
    throw new Error("Failed to update course");
  }

  return res.json(); // Return the response JSON
}

export async function deleteCourse(id: string): Promise<void> {
  await apiCall<void>(config.ENDPOINTS.COURSES.DELETE(id), {
    method: "DELETE",
  });
}

// =============================================================================
// MODULE API CALLS
// =============================================================================

export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  return apiCall<Module[]>(config.ENDPOINTS.MODULES.BY_COURSE(courseId));
}

export async function createModule(moduleData: {
  title: string;
  courseId: string;
}): Promise<Module> {
  return apiCall<Module>(config.ENDPOINTS.MODULES.CREATE(moduleData.courseId), {
    method: "POST",
    body: JSON.stringify({ title: moduleData.title }),
  });
}

export async function updateModule(
  id: string,
  moduleData: {
    title: string;
  }
): Promise<Module> {
  return apiCall<Module>(config.ENDPOINTS.MODULES.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(moduleData),
  });
}

export async function deleteModule(id: string): Promise<void> {
  await apiCall<void>(config.ENDPOINTS.MODULES.DELETE(id), {
    method: "DELETE",
  });
}

// =============================================================================
// LECTURE API CALLS
// =============================================================================

export async function getLecturesByModule(
  moduleId: string
): Promise<Lecture[]> {
  return apiCall<Lecture[]>(config.ENDPOINTS.LECTURES.BY_MODULE(moduleId));
}

export async function createLecture(lectureData: {
  title: string;
  videoUrl: string;
  moduleId: string;
}): Promise<Lecture> {
  return apiCall<Lecture>(
    config.ENDPOINTS.LECTURES.CREATE(lectureData.moduleId),
    {
      method: "POST",
      body: JSON.stringify(lectureData),
    }
  );
}

export async function updateLecture(
  id: string,
  lectureData: Partial<{
    title: string;
    videoUrl: string;
  }>
): Promise<Lecture> {
  return apiCall<Lecture>(config.ENDPOINTS.LECTURES.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(lectureData),
  });
}

export async function deleteLecture(id: string): Promise<void> {
  await apiCall<void>(config.ENDPOINTS.LECTURES.DELETE(id), {
    method: "DELETE",
  });
}

// =============================================================================
// USER PROGRESS API CALLS
// =============================================================================

export async function enrollInCourse(courseId: string): Promise<UserProgress> {
  return apiCall<UserProgress>(config.ENDPOINTS.COURSES.ENROLL(courseId), {
    method: "POST",
  });
}

export async function getEnrolledCourses(): Promise<UserProgress[]> {
  return apiCall<UserProgress[]>(config.ENDPOINTS.COURSES.ENROLLED);
}

export async function getUserProgress(courseId: string): Promise<UserProgress> {
  return apiCall<UserProgress>(config.ENDPOINTS.LECTURES.PROGRESS(courseId));
}

export async function markLectureComplete(
  lectureId: string
): Promise<UserProgress> {
  return apiCall<UserProgress>(config.ENDPOINTS.LECTURES.COMPLETE(lectureId), {
    method: "POST",
  });
}

// =============================================================================
// COURSE STRUCTURE API CALLS
// =============================================================================

export async function getCourseWithStructure(courseId: string): Promise<
  Course & {
    modules: (Module & { lectures: Lecture[] })[];
    userProgress?: UserProgress;
    totalLectures?: number;
    completedLectures?: number;
  }
> {
  try {
    // Fetch course details
    const course = await getCourse(courseId);

    // Fetch modules
    const modules = await getModulesByCourse(courseId);

    // Fetch lectures for each module
    const modulesWithLectures = await Promise.all(
      modules.map(async (module) => {
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

    // Try to fetch user progress (optional - might fail if not authenticated)
    let userProgress: UserProgress | undefined;
    let totalLectures = 0;
    let completedLectures = 0;

    try {
      userProgress = await getUserProgress(courseId);
      totalLectures = modulesWithLectures.reduce(
        (sum, module) => sum + module.lectures.length,
        0
      );
      completedLectures = userProgress.completedLectures.length;
    } catch (error) {
      // User might not be enrolled or authenticated - this is OK
      console.log("User progress not available:", error);
    }

    return {
      ...course,
      modules: modulesWithLectures,
      userProgress,
      totalLectures,
      completedLectures,
    };
  } catch (error) {
    console.error("Failed to fetch course structure:", error);
    throw error;
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if user can access specific lecture (unlock logic)
 */
export function isLectureUnlocked(
  lecture: Lecture,
  allLectures: Lecture[],
  completedLectures: string[]
): boolean {
  // First lecture is always unlocked
  const sortedLectures = allLectures.sort(
    (a, b) => a.lectureNumber - b.lectureNumber
  );
  if (sortedLectures.length > 0 && sortedLectures[0]._id === lecture._id) {
    return true;
  }

  // Find lecture index in sorted order
  const lectureIndex = sortedLectures.findIndex((l) => l._id === lecture._id);
  if (lectureIndex === -1) return false;

  // Check if all previous lectures are completed
  for (let i = 0; i < lectureIndex; i++) {
    if (!completedLectures.includes(sortedLectures[i]._id)) {
      return false;
    }
  }

  return true;
}

/**
 * Get next lecture in sequence
 */
export function getNextLecture(
  currentLectureId: string,
  allLectures: Lecture[]
): Lecture | null {
  const sortedLectures = allLectures.sort(
    (a, b) => a.lectureNumber - b.lectureNumber
  );
  const currentIndex = sortedLectures.findIndex(
    (l) => l._id === currentLectureId
  );

  if (currentIndex === -1 || currentIndex === sortedLectures.length - 1) {
    return null;
  }

  return sortedLectures[currentIndex + 1];
}

/**
 * Get previous lecture in sequence
 */
export function getPreviousLecture(
  currentLectureId: string,
  allLectures: Lecture[]
): Lecture | null {
  const sortedLectures = allLectures.sort(
    (a, b) => a.lectureNumber - b.lectureNumber
  );
  const currentIndex = sortedLectures.findIndex(
    (l) => l._id === currentLectureId
  );

  if (currentIndex <= 0) {
    return null;
  }

  return sortedLectures[currentIndex - 1];
}

/**
 * Calculate course progress percentage
 */
export function calculateCourseProgress(
  totalLectures: number,
  completedLectures: number
): number {
  if (totalLectures === 0) return 0;
  return Math.round((completedLectures / totalLectures) * 100);
}

/**
 * Format course duration (if available)
 */
export function formatCourseDuration(lectures: Lecture[]): string {
  const totalMinutes = lectures.reduce(
    (sum, lecture) => sum + (lecture.duration || 0),
    0
  );

  if (totalMinutes === 0) return "Duration not available";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const regexPatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Get YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoUrl: string): string {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return videoUrl;

  return `https://www.youtube.com/embed/${videoId}`;
}
