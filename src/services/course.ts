// src/services/course.ts
import { config } from '@/config';

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  title: string;
  moduleNumber: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  _id: string;
  title: string;
  lectureNumber: number;
  content: string;
  videoUrl?: string;
  moduleId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  _id: string;
  userId: string;
  courseId: string;
  currentLecture?: string;
  progressPercentage: number;
  completedLectures: string[];
  enrolledAt: string;
  lastAccessed?: string;
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

// Course API calls
export async function getCourses(params?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<PaginatedResponse<Course>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryString = params ? new URLSearchParams(params as any).toString() : '';
  const response = await fetch(`${config.API_URL}/courses?${queryString}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status}`);
  }
  
  const data: ApiResponse<PaginatedResponse<Course>> = await response.json();
  return data.data;
}

export async function getCourse(id: string): Promise<Course> {
  const response = await fetch(`${config.API_URL}/courses/${id}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.status}`);
  }
  
  const data: ApiResponse<Course> = await response.json();
  return data.data;
}

export async function createCourse(courseData: {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}): Promise<Course> {
  const response = await fetch(`${config.API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(courseData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create course: ${response.status}`);
  }
  
  const data: ApiResponse<Course> = await response.json();
  return data.data;
}

export async function updateCourse(id: string, courseData: Partial<{
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}>): Promise<Course> {
  const response = await fetch(`${config.API_URL}/courses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(courseData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update course: ${response.status}`);
  }
  
  const data: ApiResponse<Course> = await response.json();
  return data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  const response = await fetch(`${config.API_URL}/courses/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete course: ${response.status}`);
  }
}

// Module API calls
export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  const response = await fetch(`${config.API_URL}/modules/${courseId}/modules`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch modules: ${response.status}`);
  }
  
  const data: ApiResponse<Module[]> = await response.json();
  return data.data;
}

export async function createModule(moduleData: {
  title: string;
  courseId: string;
  moduleNumber: number;
}): Promise<Module> {
  const response = await fetch(`${config.API_URL}/modules/${moduleData.courseId}/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      title: moduleData.title,
      courseId: moduleData.courseId,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create module: ${response.status}`);
  }
  
  const data: ApiResponse<Module> = await response.json();
  return data.data;
}

export async function updateModule(id: string, moduleData: {
  title: string;
}): Promise<Module> {
  const response = await fetch(`${config.API_URL}/modules/modules/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(moduleData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update module: ${response.status}`);
  }
  
  const data: ApiResponse<Module> = await response.json();
  return data.data;
}

export async function deleteModule(id: string): Promise<void> {
  const response = await fetch(`${config.API_URL}/modules/modules/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete module: ${response.status}`);
  }
}

// Lecture API calls
export async function getLecturesByModule(moduleId: string): Promise<Lecture[]> {
  const response = await fetch(`${config.API_URL}/lectures/modules/${moduleId}/lectures`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch lectures: ${response.status}`);
  }
  
  const data: ApiResponse<Lecture[]> = await response.json();
  return data.data;
}

export async function createLecture(lectureData: {
  title: string;
  content: string;
  videoUrl?: string;
  moduleId: string;
  lectureNumber: number;
}): Promise<Lecture> {
  const response = await fetch(`${config.API_URL}/lectures/modules/${lectureData.moduleId}/lectures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(lectureData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create lecture: ${response.status}`);
  }
  
  const data: ApiResponse<Lecture> = await response.json();
  return data.data;
}

export async function updateLecture(id: string, lectureData: Partial<{
  title: string;
  content: string;
  videoUrl: string;
}>): Promise<Lecture> {
  const response = await fetch(`${config.API_URL}/lectures/lectures/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(lectureData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update lecture: ${response.status}`);
  }
  
  const data: ApiResponse<Lecture> = await response.json();
  return data.data;
}

export async function deleteLecture(id: string): Promise<void> {
  const response = await fetch(`${config.API_URL}/lectures/lectures/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete lecture: ${response.status}`);
  }
}

// User Progress API calls
export async function enrollInCourse(courseId: string): Promise<UserProgress> {
  const response = await fetch(`${config.API_URL}/courses/${courseId}/enroll`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to enroll in course: ${response.status}`);
  }
  
  const data: ApiResponse<UserProgress> = await response.json();
  return data.data;
}

export async function getUserProgress(courseId: string): Promise<UserProgress> {
  const response = await fetch(`${config.API_URL}/lectures/${courseId}/progress`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user progress: ${response.status}`);
  }
  
  const data: ApiResponse<UserProgress> = await response.json();
  return data.data;
}

export async function markLectureComplete(lectureId: string): Promise<UserProgress> {
  const response = await fetch(`${config.API_URL}/lectures/lectures/${lectureId}/complete`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to mark lecture complete: ${response.status}`);
  }
  
  const data: ApiResponse<UserProgress> = await response.json();
  return data.data;
}

export async function getEnrolledCourses(): Promise<UserProgress[]> {
  const response = await fetch(`${config.API_URL}/courses/enrolled`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch enrolled courses: ${response.status}`);
  }
  
  const data: ApiResponse<UserProgress[]> = await response.json();
  return data.data;
}