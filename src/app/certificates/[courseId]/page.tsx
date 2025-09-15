// src/app/certificates/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { getCourse, getUserProgress, type Course, type UserProgress } from "@/services/course";

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const sessionContext = useSessionContext();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !sessionContext.loading && sessionContext.doesSessionExist;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (courseId) {
      fetchCertificateData();
    }
  }, [courseId, isAuthenticated, router]);

  const fetchCertificateData = async () => {
    try {
      setLoading(true);
      const [courseData, progress] = await Promise.all([
        getCourse(courseId),
        getUserProgress(courseId)
      ]);

      setCourse(courseData);
      setUserProgress(progress);

      // Check if course is completed
      if (progress.progressPercentage !== 100) {
        router.push(`/learn/${courseId}`);
        return;
      }
    } catch (error) {
      console.error("Failed to fetch certificate data:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF certificate
    alert("Certificate download functionality would be implemented here!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${course?.title}`,
        text: `I just completed ${course?.title} on Course Mate!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Certificate link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course || !userProgress) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 mb-4">This certificate may not exist or you haven&apos;t completed the course.</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getUserDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    return user?.email.split('@')[0] || 'Student';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            You have successfully completed the course and earned your certificate!
          </p>
        </div>

        {/* Certificate */}
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-8 border-gradient-to-r from-blue-500 to-purple-600">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-8 text-center">
            <div className="text-4xl font-bold mb-2">CERTIFICATE</div>
            <div className="text-xl">OF COMPLETION</div>
          </div>

          {/* Certificate Body */}
          <div className="p-12 text-center">
            <div className="mb-8">
              <div className="text-lg text-gray-600 mb-4">This is to certify that</div>
              <div className="text-4xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
                {getUserDisplayName()}
              </div>
              <div className="text-lg text-gray-600 mb-8">has successfully completed the course</div>
            </div>

            <div className="mb-8">
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {course.title}
              </div>
              <div className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {course.description}
              </div>
            </div>

            <div className="flex justify-between items-end mt-12">
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-1">Completion Date</div>
                <div className="font-semibold text-gray-900">{completionDate}</div>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2">
                  📚
                </div>
                <div className="text-sm font-semibold text-gray-700">Course Mate</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Certificate ID</div>
                <div className="font-mono text-sm text-gray-900">
                  {courseId && courseId?.slice(-8).toUpperCase()}-{userProgress._id.slice(-4).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Course Completion:</span> 100%
              </div>
              <div>
                <span className="font-semibold">Lectures Completed:</span> {userProgress.completedLectures.length}
              </div>
              <div>
                <span className="font-semibold">Grade:</span> Pass
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <span>📄</span>
            Download Certificate
          </button>
          <button
            onClick={handleShare}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
          >
            <span>🔗</span>
            Share Certificate
          </button>
        </div>

        {/* Additional Actions */}
        <div className="text-center mt-8 space-y-4">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 font-medium mr-8"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => router.push('/courses')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore More Courses →
            </button>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Ready for the Next Challenge?
            </h3>
            <p className="text-blue-700 mb-4">
              Continue your learning journey with more courses and expand your skillset!
            </p>
            <button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}