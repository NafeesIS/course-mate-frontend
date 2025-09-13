// src/services/fileUpload.ts
import { config } from '@/config';

/**
 * Professional File Upload Service
 * Handles file uploads to backend with proper error handling,
 * progress tracking, and retry mechanisms
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onError?: (error: Error) => void;
  abortController?: AbortController;
}

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  };
  message: string;
}

/**
 * Upload file to backend with progress tracking
 */
export async function uploadFile(
  file: File,
  endpoint: string,
  options: FileUploadOptions = {}
): Promise<UploadResponse> {
  const { onProgress, onError, abortController } = options;

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress: UploadProgress = {
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100)
          };
          onProgress(progress);
        }
      });
    }

    // Handle successful response
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          const parseError = new Error('Failed to parse server response');
          onError?.(parseError);
          reject(parseError);
        }
      } else {
        const error = new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`);
        onError?.(error);
        reject(error);
      }
    });

    // Handle network errors
    xhr.addEventListener('error', () => {
      const error = new Error('Network error during file upload');
      onError?.(error);
      reject(error);
    });

    // Handle request timeout
    xhr.addEventListener('timeout', () => {
      const error = new Error('Upload request timed out');
      onError?.(error);
      reject(error);
    });

    // Handle abort
    xhr.addEventListener('abort', () => {
      const error = new Error('Upload was cancelled');
      onError?.(error);
      reject(error);
    });

    // Configure request
    xhr.timeout = 300000; // 5 minutes timeout
    xhr.withCredentials = true; // Include cookies for authentication

    // Handle abort controller
    if (abortController) {
      abortController.signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    // Start upload
    xhr.open('POST', `${config.API_URL}${endpoint}`);
    xhr.send(formData);
  });
}

/**
 * Upload course thumbnail image
 */
export async function uploadCourseThumbnail(
  file: File,
  options: FileUploadOptions = {}
): Promise<UploadResponse> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed for thumbnails');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 5MB');
  }

  return uploadFile(file, '/upload/thumbnail', options);
}

/**
 * Upload lecture PDF notes
 */
export async function uploadLecturePDF(
  file: File,
  options: FileUploadOptions = {}
): Promise<UploadResponse> {
  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed for lecture notes');
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('PDF file size must be less than 10MB');
  }

  return uploadFile(file, '/upload/pdf', options);
}

/**
 * Upload lecture video file
 */
export async function uploadLectureVideo(
  file: File,
  options: FileUploadOptions = {}
): Promise<UploadResponse> {
  // Validate file type
  const allowedVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv'
  ];

  if (!allowedVideoTypes.includes(file.type)) {
    throw new Error('Unsupported video format. Please use MP4, WebM, or other supported formats.');
  }

  // Validate file size (100MB limit)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error('Video file size must be less than 100MB');
  }

  return uploadFile(file, '/upload/video', options);
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  try {
    const response = await fetch(`${config.API_URL}/upload/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, type: 'image' | 'pdf' | 'video'): string | null {
  const validations = {
    image: {
      types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
      errorMessage: 'Please select a valid image file (JPEG, PNG, GIF, WebP) under 5MB'
    },
    pdf: {
      types: ['application/pdf'],
      maxSize: 10 * 1024 * 1024, // 10MB
      errorMessage: 'Please select a valid PDF file under 10MB'
    },
    video: {
      types: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
      maxSize: 100 * 1024 * 1024, // 100MB
      errorMessage: 'Please select a valid video file (MP4, WebM, OGG, AVI, MOV) under 100MB'
    }
  };

  const config = validations[type];
  
  // Check file type
  if (!config.types.includes(file.type)) {
    return config.errorMessage;
  }

  // Check file size
  if (file.size > config.maxSize) {
    return config.errorMessage;
  }

  return null;
}

/**
 * Generate unique filename to prevent conflicts
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split('.').pop();
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
  
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type icon
 */
export function getFileTypeIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, string> = {
    // Images
    'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'webp': '🖼️',
    // Documents
    'pdf': '📄', 'doc': '📝', 'docx': '📝', 'txt': '📝',
    // Videos
    'mp4': '🎥', 'avi': '🎥', 'mov': '🎥', 'wmv': '🎥', 'webm': '🎥',
    // Audio
    'mp3': '🎵', 'wav': '🎵', 'ogg': '🎵',
    // Archives
    'zip': '📦', 'rar': '📦', '7z': '📦',
    // Default
    'default': '📁'
  };

  return iconMap[extension || 'default'] || iconMap['default'];
}