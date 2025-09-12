// src/app/page.tsx
"use client";

import Link from "next/link";
import { useUser } from "@/context/userContext";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useState, useEffect } from "react";
import { getCourses, type Course } from "@/services/course";
import Image from "next/image";

export default function HomePage() {
  const { user } = useUser();
  const sessionContext = useSessionContext();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const response = await getCourses({ limit: 6, sort: "-createdAt" });
      setFeaturedCourses(response.result);
    } catch (error) {
      console.error("Failed to fetch featured courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !sessionContext.loading && sessionContext.doesSessionExist;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Learn Without
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Limits</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Master new skills, advance your career, and unlock your potential with our comprehensive 
              learning management system. Join thousands of learners worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <div className="flex gap-4">
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Continue Learning
                  </Link>
                  <Link
                    href="/courses"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-blue-600"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/auth"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Start Learning Today
                  </Link>
                  <Link
                    href="/courses"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-blue-600"
                  >
                    Explore Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Course Mate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to provide the best learning experience with cutting-edge features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Video Lessons</h3>
              <p className="text-gray-600">
                Learn through high-quality video content with interactive elements and progress tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and completion certificates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🔓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sequential Learning</h3>
              <p className="text-gray-600">
                Unlock lectures progressively as you complete previous ones for structured learning.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Responsive</h3>
              <p className="text-gray-600">
                Learn anywhere, anytime with our fully responsive design that works on all devices.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Content</h3>
              <p className="text-gray-600">
                Access comprehensive course materials including videos, PDFs, and interactive content.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certificates</h3>
              <p className="text-gray-600">
                Earn completion certificates to showcase your achievements and boost your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular courses and start your learning journey
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <Image
                      src={course.thumbnail || "/api/placeholder/400/240"}
                      alt={course.title}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${course.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/courses/${course._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Available Yet</h3>
              <p className="text-gray-500">Check back soon for amazing learning content!</p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center gap-2"
            >
              View All Courses
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with your learning journey in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Course</h3>
              <p className="text-gray-600">
                Browse our extensive catalog and find the perfect course that matches your goals and interests.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Learn at Your Pace</h3>
              <p className="text-gray-600">
                Follow structured modules and unlock lectures sequentially as you progress through the content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Certified</h3>
              <p className="text-gray-600">
                Complete your course and receive a certificate to showcase your new skills and knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                The courses are well-structured and easy to follow. I&apos;ve learned more in 3 months than I did in years of self-study.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Miller</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                The sequential learning system kept me motivated and on track. I finally completed a course from start to finish!
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Mike Johnson</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                Great platform with excellent video quality and comprehensive materials. Highly recommended!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and unlock your potential with our comprehensive courses
          </p>
          
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center gap-2"
            >
              Go to Dashboard
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center gap-2"
            >
              Get Started Now - It&apos;s Free!
              <span>→</span>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl">📚</div>
                <span className="text-xl font-bold">Course Mate</span>
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education and innovative learning experiences.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses?category=programming" className="hover:text-white transition-colors">Programming</Link></li>
                <li><Link href="/courses?category=design" className="hover:text-white transition-colors">Design</Link></li>
                <li><Link href="/courses?category=business" className="hover:text-white transition-colors">Business</Link></li>
                <li><Link href="/courses?category=marketing" className="hover:text-white transition-colors">Marketing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Course Mate. All rights reserved. Built with ❤️ for learners worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}