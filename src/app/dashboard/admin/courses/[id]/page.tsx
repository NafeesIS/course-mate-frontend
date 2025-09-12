// src/app/admin/courses/[id]/page.tsx
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
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ModuleWithLectures extends Module {
  lectures: Lecture[];
}

function CourseContentPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLectures[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  const [moduleForm, setModuleForm] = useState({
    title: '',
    moduleNumber: 1
  });

  const [lectureForm, setLectureForm] = useState({
    title: '',
    content: '',
    videoUrl: '',
    lectureNumber: 1
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    if (courseId) {
      fetchCourseData();
    }
  }, [user, courseId]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      
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
    } catch (error) {
      console.error('Failed to fetch course data:', error);
      alert('Failed to load course data');
      router.push('/admin/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nextModuleNumber = Math.max(...modules.map(m => m.moduleNumber), 0) + 1;
      await createModule({
        title: moduleForm.title,
        courseId,
        moduleNumber: nextModuleNumber
      });
      setModuleForm({ title: '', moduleNumber: 1 });
      setShowModuleForm(false);
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to create module');
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    
    try {
      await updateModule(editingModule._id, { title: moduleForm.title });
      setEditingModule(null);
      setModuleForm({ title: '', moduleNumber: 1 });
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to update module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure? This will delete all lectures in this module.')) return;
    
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
    if (!showLectureForm) return;
    
    try {
      const specificModule = modules.find(m => m._id === showLectureForm);
      if (!specificModule) return;
      
      const nextLectureNumber = Math.max(...specificModule.lectures.map(l => l.lectureNumber), 0) + 1;
      await createLecture({
        ...lectureForm,
        moduleId: showLectureForm,
        lectureNumber: nextLectureNumber
      });
      
      setLectureForm({ title: '', content: '', videoUrl: '', lectureNumber: 1 });
      setShowLectureForm(null);
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to create lecture');
    }
  };

  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture) return;
    
    try {
      await updateLecture(editingLecture._id, {
        title: lectureForm.title,
        content: lectureForm.content,
        videoUrl: lectureForm.videoUrl
      });
      setEditingLecture(null);
      setLectureForm({ title: '', content: '', videoUrl: '', lectureNumber: 1 });
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to update lecture');
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;
    
    try {
      await deleteLecture(lectureId);
      await fetchCourseData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || 'Failed to delete lecture');
    }
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h1>
          <Link 
            href="/admin/courses"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin/courses"
              className="text-blue-600 hover:text-blue-800 transition-colors"
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
                href={`/admin/courses/${courseId}/edit`}
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

        {/* Module Creation Form */}
        {(showModuleForm || editingModule) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </h3>
            <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule} className="space-y-4">
              <input
                type="text"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="Module title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
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
                    setModuleForm({ title: '', moduleNumber: 1 });
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modules List */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Modules Yet</h3>
              <p className="text-gray-500 mb-4">Create your first module to start organizing your course content</p>
              <button
                onClick={() => setShowModuleForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Module
              </button>
            </div>
          ) : (
            modules.map((module) => (
              <div key={module._id} className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Module {module.moduleNumber}: {module.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{module.lectures.length} lectures</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingModule(module);
                          setModuleForm({ title: module.title, moduleNumber: module.moduleNumber });
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowLectureForm(module._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        + Add Lecture
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Lecture Creation Form */}
                  {showLectureForm === module._id && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-4">Add New Lecture</h4>
                      <form onSubmit={handleCreateLecture} className="space-y-4">
                        <input
                          type="text"
                          value={lectureForm.title}
                          onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                          placeholder="Lecture title..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        <textarea
                          value={lectureForm.content}
                          onChange={(e) => setLectureForm({ ...lectureForm, content: e.target.value })}
                          placeholder="Lecture content/description..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
                          required
                        />
                        <input
                          type="url"
                          value={lectureForm.videoUrl}
                          onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                          placeholder="Video URL (YouTube, Vimeo, etc.)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
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
                              setLectureForm({ title: '', content: '', videoUrl: '', lectureNumber: 1 });
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Edit Lecture Form */}
                  {editingLecture && editingLecture.moduleId === module._id && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-4">Edit Lecture</h4>
                      <form onSubmit={handleUpdateLecture} className="space-y-4">
                        <input
                          type="text"
                          value={lectureForm.title}
                          onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                          placeholder="Lecture title..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                        <textarea
                          value={lectureForm.content}
                          onChange={(e) => setLectureForm({ ...lectureForm, content: e.target.value })}
                          placeholder="Lecture content/description..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
                          required
                        />
                        <input
                          type="url"
                          value={lectureForm.videoUrl}
                          onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                          placeholder="Video URL (YouTube, Vimeo, etc.)"
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
                              setLectureForm({ title: '', content: '', videoUrl: '', lectureNumber: 1 });
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

                {/* Lectures List */}
                <div className="p-6">
                  {module.lectures.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No lectures in this module</p>
                  ) : (
                    <div className="space-y-3">
                      {module.lectures.map((lecture) => (
                        <div key={lecture._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              Lecture {lecture.lectureNumber}: {lecture.title}
                            </h5>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{lecture.content}</p>
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
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingLecture(lecture);
                                setLectureForm({
                                  title: lecture.title,
                                  content: lecture.content,
                                  videoUrl: lecture.videoUrl || '',
                                  lectureNumber: lecture.lectureNumber
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
                </div>
              </div>
            ))
          )}
        </div>

        {/* Course Summary */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Course Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800">
            <div>
              <span className="text-2xl font-bold">{modules.length}</span>
              <p className="text-sm">Modules</p>
            </div>
            <div>
              <span className="text-2xl font-bold">
                {modules.reduce((total, module) => total + module.lectures.length, 0)}
              </span>
              <p className="text-sm">Total Lectures</p>
            </div>
            <div>
              <span className="text-2xl font-bold">${course.price}</span>
              <p className="text-sm">Course Price</p>
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
      <CourseContentPage />
    </SessionAuth>
  );
}