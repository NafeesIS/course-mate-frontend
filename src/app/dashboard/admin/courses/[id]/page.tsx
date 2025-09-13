// src/app/dashboard/admin/courses/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { useUser } from '@/context/userContext';
import { 
  getCourse, 
  getModulesByCourse, 
  getLecturesByModule,
  createModule,
  createLecture,
  updateModule,
  updateLecture,
  deleteModule,
  deleteLecture,
  type Course,
  type Module,
  type Lecture
} from '@/services/course';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Enhanced Course Content Management Page
 * Modern interface for managing course modules and lectures
 */

interface ModuleWithLectures extends Module {
  lectures: Lecture[];
}

function CourseContentPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const justCreated = searchParams.get('created') === 'true';
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLectures[]>([]);
  
  // Form states
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const [moduleForm, setModuleForm] = useState({
    title: ''
  });

  const [lectureForm, setLectureForm] = useState({
    title: '',
    videoUrl: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Access control
  useEffect(() => {
    if (user && !user.roles?.includes('admin')) {
      router.push('/dashboard');
      return;
    }
    
    if (courseId) {
      fetchCourseData();
    }
  }, [user, courseId]);

  // Show success message for newly created courses
  useEffect(() => {
    if (justCreated) {
      // Auto-expand the first module form
      setShowModuleForm(true);
    }
  }, [justCreated]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch course details
      const courseData = await getCourse(courseId);
      setCourse(courseData);
      
      // Fetch modules
      const modulesData = await getModulesByCourse(courseId);
      
      // Fetch lectures for each module
      const modulesWithLectures = await Promise.all(
        modulesData.map(async (module) => {
          try {
            const lectures = await getLecturesByModule(module._id);
            return { ...module, lectures };
          } catch (error) {
            console.error(`Failed to fetch lectures for module ${module._id}:`, error);
            return { ...module, lectures: [] };
          }
        })
      );
      
      setModules(modulesWithLectures);
      
      // Auto-expand first module if it has content
      if (modulesWithLectures.length > 0) {
        setExpandedModule(modulesWithLectures[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load course data');
    } finally {
      setIsLoading(false);
    }
  };

  const validateModuleForm = () => {
    const errors: Record<string, string> = {};
    
    if (!moduleForm.title.trim()) {
      errors.title = 'Module title is required';
    } else if (moduleForm.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLectureForm = () => {
    const errors: Record<string, string> = {};
    
    if (!lectureForm.title.trim()) {
      errors.title = 'Lecture title is required';
    } else if (lectureForm.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!lectureForm.videoUrl.trim()) {
      errors.videoUrl = 'Video URL is required';
    } else {
      try {
        new URL(lectureForm.videoUrl);
      } catch {
        errors.videoUrl = 'Please enter a valid URL';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateModuleForm()) return;

    try {
      await createModule({
        title: moduleForm.title.trim(),
        courseId
      });
      
      setModuleForm({ title: '' });
      setShowModuleForm(false);
      setFormErrors({});
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Failed to create module' });
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !validateModuleForm()) return;
    
    try {
      await updateModule(editingModule._id, { title: moduleForm.title.trim() });
      setEditingModule(null);
      setModuleForm({ title: '' });
      setFormErrors({});
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Failed to update module' });
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    const singleModule = modules.find(m => m._id === moduleId);
    if (!singleModule) return;

    if (!confirm(`Are you sure you want to delete "${singleModule.title}"? This will delete all lectures in this module.`)) return;
    
    try {
      await deleteModule(moduleId);
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to delete module');
    }
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showLectureForm || !validateLectureForm()) return;
    
    try {
      await createLecture({
        title: lectureForm.title.trim(),
        videoUrl: lectureForm.videoUrl.trim(),
        moduleId: showLectureForm
      });
      
      setLectureForm({ title: '', videoUrl: '' });
      setShowLectureForm(null);
      setFormErrors({});
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Failed to create lecture' });
    }
  };

  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture || !validateLectureForm()) return;
    
    try {
      await updateLecture(editingLecture._id, {
        title: lectureForm.title.trim(),
        videoUrl: lectureForm.videoUrl.trim()
      });
      setEditingLecture(null);
      setLectureForm({ title: '', videoUrl: '' });
      setFormErrors({});
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Failed to update lecture' });
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    const lecture = modules
      .flatMap(m => m.lectures)
      .find(l => l._id === lectureId);
      
    if (!lecture) return;

    if (!confirm(`Are you sure you want to delete "${lecture.title}"?`)) return;
    
    try {
      await deleteLecture(lectureId);
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to delete lecture');
    }
  };

  // Access control render
  if (user && !user.roles?.includes('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don&apos;t have permission to manage course content.</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Course</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => fetchCourseData()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <Link
                href="/dashboard/admin/courses"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard/admin/courses"
              className="flex items-center text-blue-600 hover:text-blue-800
                            transition-colors"
            >
              ← Back to Courses
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">Manage modules and lectures</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/dashboard/admin/courses/${courseId}/edit`}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Edit Course
              </Link>
              <button
                onClick={() => setShowModuleForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Module
              </button>
            </div>
          </div>
        </div>

        {/* Module Form */}
        {(showModuleForm || editingModule) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </h3>
            {formErrors.general && (
              <p className="text-red-600 mb-2">{formErrors.general}</p>
            )}
            <form 
              onSubmit={editingModule ? handleUpdateModule : handleCreateModule} 
              className="space-y-4"
            >
              <input
                type="text"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ title: e.target.value })}
                placeholder="Module title..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                  formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.title && (
                <p className="text-red-600 text-sm">{formErrors.title}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingModule ? 'Update' : 'Create'} Module
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModuleForm(false);
                    setEditingModule(null);
                    setModuleForm({ title: '' });
                    setFormErrors({});
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modules */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Modules Yet</h3>
              <p className="text-gray-500 mb-4">Create your first module to start building course content.</p>
              <button
                onClick={() => setShowModuleForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Module
              </button>
            </div>
          ) : (
            modules.map((module) => (
              <div key={module._id} className="bg-white rounded-xl shadow-md">
                <div 
                  className="p-6 border-b border-gray-200 cursor-pointer flex justify-between items-center"
                  onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{module.lectures.length} lectures</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingModule(module);
                        setModuleForm({ title: module.title });
                      }}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLectureForm(module._id);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      + Add Lecture
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(module._id);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded Module Content */}
                {expandedModule === module._id && (
                  <div className="p-6 space-y-4">
                    {/* Add Lecture Form */}
                    {showLectureForm === module._id && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Add New Lecture</h4>
                        {formErrors.general && (
                          <p className="text-red-600 mb-2">{formErrors.general}</p>
                        )}
                        <form onSubmit={handleCreateLecture} className="space-y-4">
                          <input
                            type="text"
                            value={lectureForm.title}
                            onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                            placeholder="Lecture title..."
                            className={`w-full px-4 py-2 border rounded-lg ${
                              formErrors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.title && <p className="text-red-600 text-sm">{formErrors.title}</p>}
                          <input
                            type="url"
                            value={lectureForm.videoUrl}
                            onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                            placeholder="Video URL (YouTube, Vimeo, etc.)"
                            className={`w-full px-4 py-2 border rounded-lg ${
                              formErrors.videoUrl ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.videoUrl && <p className="text-red-600 text-sm">{formErrors.videoUrl}</p>}
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Create Lecture
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowLectureForm(null);
                                setLectureForm({ title: '', videoUrl: '' });
                                setFormErrors({});
                              }}
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Lectures List */}
                    {module.lectures.length === 0 ? (
                      <p className="text-gray-500 italic">No lectures yet</p>
                    ) : (
                      <div className="space-y-3">
                        {module.lectures.map((lecture) => (
                          <div 
                            key={lecture._id} 
                            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium text-gray-900">{lecture.title}</h5>
                              {lecture.videoUrl && (
                                <a 
                                  href={lecture.videoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  View Video →
                                </a>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingLecture(lecture);
                                  setLectureForm({
                                    title: lecture.title,
                                    videoUrl: lecture.videoUrl || ''
                                  });
                                }}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteLecture(lecture._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Edit Lecture Form */}
                    {editingLecture && editingLecture.moduleId === module._id && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Edit Lecture</h4>
                        {formErrors.general && (
                          <p className="text-red-600 mb-2">{formErrors.general}</p>
                        )}
                        <form onSubmit={handleUpdateLecture} className="space-y-4">
                          <input
                            type="text"
                            value={lectureForm.title}
                            onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                            placeholder="Lecture title..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="url"
                            value={lectureForm.videoUrl}
                            onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                            placeholder="Video URL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Update Lecture
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLecture(null);
                                setLectureForm({ title: '', videoUrl: '' });
                              }}
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <SessionAuth>
      <CourseContentPage />
    </SessionAuth>
  );
}
