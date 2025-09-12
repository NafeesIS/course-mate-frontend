// src/app/admin/courses/create/page.tsx
"use client";

import { useState } from 'react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { useUser } from '@/context/userContext';
import { createCourse } from '@/services/course';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function CreateCoursePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.thumbnail) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCourse({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        thumbnail: formData.thumbnail
      });
      
      alert('Course created successfully!');
      router.push('/admin/courses');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to create course:', error);
      alert(error.message || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.description && formData.price && formData.thumbnail;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new course</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                placeholder="Enter course title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
                placeholder="Enter detailed course description..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                required
              />
            </div>

            {/* Course Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {formData.thumbnail && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <Image
                    src={formData.thumbnail} 
                    alt="Thumbnail preview" 
                    width={200}
                    height={150}
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </button>
              
              <Link
                href="/admin/courses"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Creating Great Courses</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Write a clear, compelling title that describes what students will learn</li>
            <li>• Include detailed course objectives and outcomes in the description</li>
            <li>• Use high-quality thumbnail images that represent your course content</li>
            <li>• Price your course competitively based on the value and depth of content</li>
            <li>• After creating the course, add modules and lectures to structure your content</li>
          </ul>
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