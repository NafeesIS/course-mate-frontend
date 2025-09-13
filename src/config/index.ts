/**
 * Application Configuration
 * Handles environment-specific settings for development and production
 */

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000",
  
  // SuperTokens Configuration
  SUPERTOKENS_CONNECTION_URI: process.env.NEXT_PUBLIC_SUPERTOKENS_CONNECTION_URI || "http://localhost:4000",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Course Mate",
  
  // Environment
  IS_PRODUCTION: isProduction,
  IS_DEVELOPMENT: !isProduction,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      ME: "/auth/me",
      UPDATE_PROFILE: "/auth/me",
      USERS: "/auth/users",
    },
    COURSES: {
      LIST: "/courses",
      CREATE: "/courses",
      DETAIL: (id: string) => `/courses/${id}`,
      UPDATE: (id: string) => `/courses/${id}`,
      DELETE: (id: string) => `/courses/${id}`,
      ENROLL: (id: string) => `/courses/${id}/enroll`,
      ENROLLED: "/courses/user/enrolled",
    },
    MODULES: {
      BY_COURSE: (courseId: string) => `/modules/courses/${courseId}`,
      CREATE: (courseId: string) => `/modules/courses/${courseId}`,
      UPDATE: (id: string) => `/modules/${id}`,
      DELETE: (id: string) => `/modules/${id}`,
    },
    LECTURES: {
      BY_MODULE: (moduleId: string) => `/lectures/modules/${moduleId}`,
      CREATE: (moduleId: string) => `/lectures/modules/${moduleId}`,
      UPDATE: (id: string) => `/lectures/${id}`,
      DELETE: (id: string) => `/lectures/${id}`,
      COMPLETE: (id: string) => `/lectures/${id}/complete`,
      PROGRESS: (courseId: string) => `/lectures/courses/${courseId}/progress`,
    }
  }
};

// Validation function to ensure all required config is present
export const validateConfig = () => {
  const requiredFields = ['API_URL', 'WEBSITE_URL'];
  const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};

// Initialize configuration validation in development
if (config.IS_DEVELOPMENT) {
  try {
    validateConfig();
    console.log('✅ Configuration validated successfully');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
  }
}