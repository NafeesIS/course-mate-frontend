"use client";

import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { useUser } from "@/context/userContext";
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
  type Lecture,
} from "@/services/course";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Upload,
  FileText,
  ExternalLink,
  Save,
  X,
  BookOpen,
  Video,
  Clock,
} from "lucide-react";
import { config } from "@/config";

interface ModuleWithLectures extends Module {
  lectures: Lecture[];
}

interface LectureFormData {
  title: string;
  videoUrl: string;
  pdfNotes: File[];
}

function CourseContentPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const justCreated = searchParams.get("created") === "true";

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
    title: "",
  });

  const [lectureForm, setLectureForm] = useState<LectureFormData>({
    title: "",
    videoUrl: "",
    pdfNotes: [],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Access control
  useEffect(() => {
    if (user && !user.roles?.includes("admin")) {
      router.push("/dashboard");
      return;
    }

    if (courseId) {
      fetchCourseData();
    }
  }, [user, courseId]);

  // Show success message for newly created courses
  useEffect(() => {
    if (justCreated) {
      setShowModuleForm(true);
    }
  }, [justCreated]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const courseData = await getCourse(courseId);
      setCourse(courseData);

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

      if (modulesWithLectures.length > 0) {
        setExpandedModule(modulesWithLectures[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch course data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load course data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateModuleForm = () => {
    const errors: Record<string, string> = {};

    if (!moduleForm.title.trim()) {
      errors.title = "Module title is required";
    } else if (moduleForm.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLectureForm = () => {
    const errors: Record<string, string> = {};

    if (!lectureForm.title.trim()) {
      errors.title = "Lecture title is required";
    } else if (lectureForm.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!lectureForm.videoUrl.trim()) {
      errors.videoUrl = "Video URL is required";
    } else {
      try {
        new URL(lectureForm.videoUrl);
      } catch {
        errors.videoUrl = "Please enter a valid URL";
      }
    }

    // Validate PDF files
    if (lectureForm.pdfNotes.length > 10) {
      errors.pdfNotes = "Maximum 10 PDF files allowed";
    }

    for (const file of lectureForm.pdfNotes) {
      if (file.type !== "application/pdf") {
        errors.pdfNotes = "Only PDF files are allowed";
        break;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        errors.pdfNotes = "Each PDF file must be less than 10MB";
        break;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLectureForm((prev) => ({
      ...prev,
      pdfNotes: files,
    }));
  };

  const removePdfFile = (index: number) => {
    setLectureForm((prev) => ({
      ...prev,
      pdfNotes: prev.pdfNotes.filter((_, i) => i !== index),
    }));
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateModuleForm()) return;

    setIsSubmitting(true);
    try {
      await createModule({
        title: moduleForm.title.trim(),
        courseId,
      });

      setModuleForm({ title: "" });
      setShowModuleForm(false);
      setFormErrors({});
      await fetchCourseData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || "Failed to create module" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !validateModuleForm()) return;

    setIsSubmitting(true);
    try {
      await updateModule(editingModule._id, { title: moduleForm.title.trim() });
      setEditingModule(null);
      setModuleForm({ title: "" });
      setFormErrors({});
      await fetchCourseData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || "Failed to update module" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    const singleModule = modules.find((m) => m._id === moduleId);
    if (!singleModule) return;

    if (
      !confirm(
        `Are you sure you want to delete "${singleModule.title}"? This will delete all lectures in this module.`
      )
    )
      return;

    try {
      await deleteModule(moduleId);
      await fetchCourseData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "Failed to delete module");
    }
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showLectureForm || !validateLectureForm()) return;

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", lectureForm.title.trim());
      formData.append("videoUrl", lectureForm.videoUrl.trim());
      formData.append("moduleId", showLectureForm);

      // Append PDF files
      lectureForm.pdfNotes.forEach((file) => {
        formData.append("pdfNotes", file);
      });

      // Use fetch directly for file upload
      const response = await fetch(
        `${config.API_URL}/lectures/modules/${showLectureForm}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create lecture");
      }

      setLectureForm({ title: "", videoUrl: "", pdfNotes: [] });
      setShowLectureForm(null);
      setFormErrors({});
      await fetchCourseData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || "Failed to create lecture" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLecture || !validateLectureForm()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", lectureForm.title.trim());
      formData.append("videoUrl", lectureForm.videoUrl.trim());

      // Append PDF files if any
      lectureForm.pdfNotes.forEach((file) => {
        formData.append("pdfNotes", file);
      });

      const response = await fetch(
        `${config.API_URL}/lectures/${editingLecture._id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lecture");
      }

      setEditingLecture(null);
      setLectureForm({ title: "", videoUrl: "", pdfNotes: [] });
      setFormErrors({});
      await fetchCourseData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormErrors({ general: error.message || "Failed to update lecture" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    const lecture = modules
      .flatMap((m) => m.lectures)
      .find((l) => l._id === lectureId);

    if (!lecture) return;

    if (!confirm(`Are you sure you want to delete "${lecture.title}"?`)) return;

    try {
      await deleteLecture(lectureId);
      await fetchCourseData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message || "Failed to delete lecture");
    }
  };

  const startEditingLecture = (lecture: Lecture,id:string) => {
    setShowLectureForm(id);
    setExpandedModule(id);
    setLectureForm({
      title: lecture.title,
      videoUrl: lecture.videoUrl || "",
      pdfNotes: [], // Reset files for editing
    });
  };

  const cancelForm = () => {
    setShowModuleForm(false);
    setShowLectureForm(null);
    setEditingModule(null);
    setEditingLecture(null);
    setModuleForm({ title: "" });
    setLectureForm({ title: "", videoUrl: "", pdfNotes: [] });
    setFormErrors({});
  };

  // Access control render
  if (user && !user.roles?.includes("admin")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-6">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to manage course content.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-8 shadow-sm">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Course
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => fetchCourseData()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <Link
              href="/dashboard/admin/courses"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/dashboard/admin/courses"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              ← Back to Courses
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {course.title}
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Manage modules and lectures for your course
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {modules.length} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {modules.reduce(
                      (sum, mod) => sum + mod.lectures.length,
                      0
                    )}{" "}
                    lectures
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/dashboard/admin/courses/${courseId}/edit`}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Course
                </Link>
                <button
                  onClick={() => setShowModuleForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Module
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Module Form */}
        {(showModuleForm || editingModule) && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingModule ? "Edit Module" : "Create New Module"}
            </h3>
            {formErrors.general && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                {formErrors.general}
              </div>
            )}
            <form
              onSubmit={editingModule ? handleUpdateModule : handleCreateModule}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title
                </label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ title: e.target.value })}
                  placeholder="Enter module title..."
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                    formErrors.title
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {formErrors.title && (
                  <p className="text-red-600 text-sm mt-2">
                    {formErrors.title}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting
                    ? "Saving..."
                    : editingModule
                    ? "Update Module"
                    : "Create Module"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modules */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No Modules Yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first module to start building course content. Each
                module can contain multiple lectures.
              </p>
              <button
                onClick={() => setShowModuleForm(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Create First Module
              </button>
            </div>
          ) : (
            modules.map((module, index) => (
              <div
                key={module._id}
                className="bg-white rounded-2xl shadow-sm border overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedModule(
                      expandedModule === module._id ? null : module._id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {expandedModule === module._id ? (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Module {index + 1}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {module.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {module.lectures.length} lectures
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingModule(module);
                          setModuleForm({ title: module.title });
                        }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLectureForm(module._id);
                          setExpandedModule(module._id);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Lecture
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module._id);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Module Content */}
                {expandedModule === module._id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Add Lecture Form */}
                    {showLectureForm === module._id && (
                      <div className="bg-white rounded-xl border p-6 mb-6">
                        <h4 className="font-semibold mb-6 text-gray-900 flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Add New Lecture
                        </h4>
                        {formErrors.general && (
                          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                            {formErrors.general}
                          </div>
                        )}
                        <form
                          onSubmit={handleCreateLecture}
                          className="space-y-6"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lecture Title
                              </label>
                              <input
                                type="text"
                                value={lectureForm.title}
                                onChange={(e) =>
                                  setLectureForm({
                                    ...lectureForm,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Enter lecture title..."
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none ${
                                  formErrors.title
                                    ? "border-red-300 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                              />
                              {formErrors.title && (
                                <p className="text-red-600 text-sm mt-1">
                                  {formErrors.title}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video URL
                              </label>
                              <input
                                type="url"
                                value={lectureForm.videoUrl}
                                onChange={(e) =>
                                  setLectureForm({
                                    ...lectureForm,
                                    videoUrl: e.target.value,
                                  })
                                }
                                placeholder="https://youtube.com/watch?v=..."
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none ${
                                  formErrors.videoUrl
                                    ? "border-red-300 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                              />
                              {formErrors.videoUrl && (
                                <p className="text-red-600 text-sm mt-1">
                                  {formErrors.videoUrl}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PDF Notes (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <label
                                htmlFor="pdfUpload"
                                className="cursor-pointer"
                              >
                                <span className="text-blue-600 hover:text-blue-700 font-medium">
                                  Choose PDF files
                                </span>
                                <span className="text-gray-500">
                                  {" "}
                                  or drag and drop
                                </span>
                              </label>
                              <input
                                id="pdfUpload"
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Up to 10 files, 10MB each
                              </p>
                            </div>
                            {formErrors.pdfNotes && (
                              <p className="text-red-600 text-sm mt-1">
                                {formErrors.pdfNotes}
                              </p>
                            )}

                            {/* Selected Files */}
                            {lectureForm.pdfNotes.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                  Selected Files:
                                </p>
                                {lectureForm.pdfNotes.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-red-500" />
                                      <span className="text-sm text-gray-700">
                                        {file.name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(1)}
                                        MB)
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removePdfFile(index)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              {isSubmitting ? "Creating..." : "Create Lecture"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelForm}
                              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Edit Lecture Form */}
                    {editingLecture &&
                      editingLecture.moduleId === module._id && (
                        <div className="bg-white rounded-xl border p-6 mb-6">
                          <h4 className="font-semibold mb-6 text-gray-900 flex items-center gap-2">
                            <Edit3 className="w-5 h-5" />
                            Edit Lecture
                          </h4>
                          {formErrors.general && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                              {formErrors.general}
                            </div>
                          )}
                          <form
                            onSubmit={handleUpdateLecture}
                            className="space-y-6"
                          >
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Lecture Title
                                </label>
                                <input
                                  type="text"
                                  value={lectureForm.title}
                                  onChange={(e) =>
                                    setLectureForm({
                                      ...lectureForm,
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Enter lecture title..."
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Video URL
                                </label>
                                <input
                                  type="url"
                                  value={lectureForm.videoUrl}
                                  onChange={(e) =>
                                    setLectureForm({
                                      ...lectureForm,
                                      videoUrl: e.target.value,
                                    })
                                  }
                                  placeholder="https://youtube.com/watch?v=..."
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Update PDF Notes (Optional)
                              </label>
                              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <label
                                  htmlFor="pdfUploadEdit"
                                  className="cursor-pointer"
                                >
                                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                                    Choose new PDF files
                                  </span>
                                  <span className="text-gray-500">
                                    {" "}
                                    to replace existing ones
                                  </span>
                                </label>
                                <input
                                  id="pdfUploadEdit"
                                  type="file"
                                  multiple
                                  accept=".pdf"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Up to 10 files, 10MB each
                                </p>
                              </div>

                              {/* Selected Files for Edit */}
                              {lectureForm.pdfNotes.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    New Files to Upload:
                                  </p>
                                  {lectureForm.pdfNotes.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-red-500" />
                                        <span className="text-sm text-gray-700">
                                          {file.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          (
                                          {(file.size / 1024 / 1024).toFixed(1)}
                                          MB)
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removePdfFile(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Existing PDF Notes */}
                              {editingLecture &&
                                editingLecture.pdfNotes &&
                                editingLecture.pdfNotes.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                      Existing PDF Files:
                                    </p>
                                    {editingLecture.pdfNotes.map(
                                      (pdfUrl, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                                        >
                                          <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm text-gray-700">
                                              PDF {index + 1}
                                            </span>
                                          </div>
                                          <a
                                            href={pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                          >
                                            <ExternalLink className="w-4 h-4" />
                                            View
                                          </a>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                {isSubmitting
                                  ? "Updating..."
                                  : "Update Lecture"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelForm}
                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                    {/* Lectures List */}
                    {module.lectures.length === 0 ? (
                      <div className="text-center py-12">
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">
                          No lectures in this module yet
                        </p>
                        <button
                          onClick={() => {
                            setShowLectureForm(module._id);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Add your first lecture
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {module.lectures.map((lecture, lectureIndex) => (
                          <div
                            key={lecture._id}
                            className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                    Lecture {lectureIndex + 1}
                                  </span>
                                  <h5 className="font-semibold text-gray-900 text-lg">
                                    {lecture.title}
                                  </h5>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600">
                                  {lecture.videoUrl && (
                                    <a
                                      href={lecture.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      Watch Video
                                    </a>
                                  )}

                                  {lecture.pdfNotes &&
                                    lecture.pdfNotes.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4 text-red-500" />
                                        <span>
                                          {lecture.pdfNotes.length} PDF
                                          {lecture.pdfNotes.length > 1
                                            ? "s"
                                            : ""}
                                        </span>
                                      </div>
                                    )}

                                  {lecture.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{lecture.duration} min</span>
                                    </div>
                                  )}
                                </div>

                                {/* PDF Files Display */}
                                {lecture.pdfNotes &&
                                  lecture.pdfNotes.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                      <p className="text-sm font-medium text-gray-700">
                                        PDF Resources:
                                      </p>
                                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {lecture.pdfNotes.map(
                                          (pdfUrl, pdfIndex) => (
                                            <a
                                              key={pdfIndex}
                                              href={pdfUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                            >
                                              <FileText className="w-4 h-4" />
                                              <span>PDF {pdfIndex + 1}</span>
                                              <ExternalLink className="w-3 h-3 ml-auto" />
                                            </a>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() =>
                                    startEditingLecture(lecture, module._id)
                                  }
                                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteLecture(lecture._id)
                                  }
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
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
