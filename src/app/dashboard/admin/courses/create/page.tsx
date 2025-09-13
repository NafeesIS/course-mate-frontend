// src/app/dashboard/admin/courses/create/page.tsx
"use client";

import { useState } from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { useUser } from '@/context/userContext';
import { createCourse } from '@/services/course';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Enhanced Course Creation Page
 * Modern form design with validation and preview functionality
 */

function CreateCoursePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Access control
  if (user && !user.roles?.includes('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don&apos;t have permission to create courses.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Course price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Price must be a valid positive number';
      } else if (price > 10000) {
        newErrors.price = 'Price cannot exceed $10,000';
      }
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail URL is required';
    } else {
      try {
        new URL(formData.thumbnail);
      } catch {
        newErrors.thumbnail = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset image error when URL changes
    if (name === 'thumbnail') {
      setImagePreviewError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newCourse = await createCourse({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        thumbnail: formData.thumbnail.trim()
      });
      
      // Show success and redirect
      router.push(`/dashboard/admin/courses/${newCourse._id}?created=true`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to create course:', error);
      
      // Handle specific error types
      if (error.message.includes('already exists')) {
        setErrors({ title: 'A course with this title already exists' });
      } else if (error.message.includes('unauthorized')) {
        setErrors({ general: 'You are not authorized to create courses' });
      } else {
        setErrors({ 
          general: error.message || 'Failed to create course. Please try again.' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.description && formData.price && formData.thumbnail && Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard/admin/courses"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Courses
            </Link>
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-3xl">📚</div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          </div>
          <p className="text-gray-600">Fill in the details to create a new course for your students</p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-400 text-xl mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Error Creating Course</p>
                <p className="text-red-700 text-sm mt-1">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Course Information</h2>
                <p className="text-gray-600 text-sm mt-1">Provide the basic details about your course</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Course Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Complete React Development Bootcamp"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    maxLength={100}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
                </div>

                {/* Course Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn in this course. Include key topics, skills, and outcomes..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-colors ${
                      errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    maxLength={1000}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  <p className="mt-1 text-xs text-gray-500">{formData.description.length}/1000 characters</p>
                </div>

                {/* Course Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Price (USD) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="99.99"
                      min="0"
                      max="10000"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  <p className="mt-1 text-xs text-gray-500">Set to $0 for free courses</p>
                </div>

                {/* Course Thumbnail */}
                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    id="thumbnail"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.thumbnail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
                  <p className="mt-1 text-xs text-gray-500">Recommended size: 400x300px or 16:9 aspect ratio</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Link
                    href="/dashboard/admin/courses"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Creating Course...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Course</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Course Preview</h3>
                  <p className="text-gray-600 text-sm">How your course will appear to students</p>
                </div>

                <div className="p-4">
                  {/* Thumbnail Preview */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                    {formData.thumbnail && !imagePreviewError ? (
                      <Image
                        src={formData.thumbnail}
                        alt="Course thumbnail preview"
                        width={300}
                        height={160}
                        className="w-full h-full object-cover"
                        onError={() => setImagePreviewError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📚</div>
                          <p className="text-xs">Thumbnail Preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Info Preview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">
                      {formData.title || 'Course Title'}
                    </h4>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {formData.description || 'Course description will appear here...'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ${formData.price || '0.00'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formData.price === '0' ? 'Free Course' : 'Paid Course'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Course Creation Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Write a clear, compelling title that describes the outcome</li>
                  <li>• Include specific skills students will learn</li>
                  <li>• Use high-quality, relevant thumbnail images</li>
                  <li>• Price competitively based on course depth</li>
                  <li>• You can add modules and lectures after creation</li>
                </ul>
              </div>
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
      <CreateCoursePage />
    </SessionAuth>
  );
}