"use client";

import { useEffect, useState } from "react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "@/config/supertokens";
import { UserProvider } from "@/context/userContext";
import { config } from "@/config";
import "./globals.css";
import Navbar from "@/component/navbar";

/**
 * Root Layout Component
 * Initializes SuperTokens, provides global context, and renders the navbar
 * Handles loading states and error boundaries
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Validate configuration before initializing
        if (!config.API_URL || !config.WEBSITE_URL) {
          throw new Error('Missing required configuration');
        }

        SuperTokens.init(frontendConfig());
        setInitialized(true);

        if (config.IS_DEVELOPMENT) {
          console.log('✅ SuperTokens initialized successfully');
          console.log('🔧 Configuration:', {
            API_URL: config.API_URL,
            WEBSITE_URL: config.WEBSITE_URL,
            IS_PRODUCTION: config.IS_PRODUCTION,
          });
        }
      } catch (error) {
        console.error('❌ SuperTokens initialization failed:', error);
        setInitError(error instanceof Error ? error.message : 'Initialization failed');
      }
    }
  }, []);

  // Show loading state during initialization
  if (!initialized && !initError) {
    return (
      <html lang="en">
        <head>
          <title>Course Mate - Loading...</title>
          <meta name="description" content="Your gateway to unlimited learning opportunities" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-gray-50">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-gray-800 mb-2">Course Mate</h1>
              <p className="text-gray-600">Initializing application...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <html lang="en">
        <head>
          <title>Course Mate - Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="bg-gray-50">
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Initialization Error
                </h1>
                <p className="text-gray-600 mb-6">
                  Failed to initialize the application. Please check your configuration.
                </p>
                {config.IS_DEVELOPMENT && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800 font-mono">{initError}</p>
                  </div>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Render the app with all providers
  return (
    <html lang="en">
      <head>
        <title>Course Mate - Learn, Grow, Excel</title>
        <meta name="description" content="Your gateway to unlimited learning opportunities. Join thousands of students advancing their careers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Course Mate - Learn, Grow, Excel" />
        <meta property="og:description" content="Your gateway to unlimited learning opportunities" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={config.WEBSITE_URL} />
        
        {/* Additional meta tags for better SEO */}
        <meta name="keywords" content="online learning, courses, education, skill development, career growth" />
        <meta name="author" content="Course Mate" />
        
        {/* Preload important fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <SuperTokensWrapper>
          <UserProvider>
            {/* Global Navigation */}
            <Navbar />
            
            {/* Main Content */}
            <main className="min-h-screen">
              {children}
            </main>
            
            {/* Global Footer (if needed) */}
            <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <div className="text-2xl">📚</div>
                    <span className="text-xl font-bold text-white">Course Mate</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    © 2024 Course Mate. All rights reserved.
                  </div>
                </div>
              </div>
            </footer>
          </UserProvider>
        </SuperTokensWrapper>

        {/* Global Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global error handler
              window.addEventListener('error', function(e) {
                console.error('Global error:', e.error);
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                console.error('Unhandled promise rejection:', e.reason);
              });
              
              // Performance monitoring in development
              if (${config.IS_DEVELOPMENT}) {
                window.addEventListener('load', function() {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('🚀 Page load time:', Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms');
                    }
                  }, 0);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}