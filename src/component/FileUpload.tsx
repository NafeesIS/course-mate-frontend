// src/components/ui/FileUpload.tsx
"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  accept: string;
  maxSize: number; // in MB
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  preview?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  disabled?: boolean;
}

/**
 * Professional File Upload Component
 * Features:
 * - Drag and drop support
 * - File validation (type, size)
 * - Preview functionality
 * - Progress indication
 * - Error handling
 * - Accessible design
 */
export default function FileUpload({
  accept,
  maxSize,
  onFileSelect,
  onFileRemove,
  preview,
  isUploading = false,
  uploadProgress = 0,
  error,
  placeholder = "Drag and drop files here, or click to browse",
  className = "",
  multiple = false,
  disabled = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type);
    });

    if (!isValidType) {
      return `Invalid file type. Accepted types: ${accept}`;
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    return null;
  }, [accept, maxSize]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);
    
    if (validationError) {
      // Handle validation error through parent component
      return;
    }

    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="File upload input"
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload area"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-lg">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-gray-700 mb-2">Uploading...</p>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {/* Preview or upload prompt */}
        {preview ? (
          <div className="relative">
            {accept.includes('image') ? (
              <div className="relative inline-block">
                <Image
                  src={preview}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="max-w-full h-32 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Remove file"
                  disabled={disabled || isUploading}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <div className="text-3xl">📄</div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">File selected</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove();
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                    disabled={disabled || isUploading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4 text-gray-400">
              {accept.includes('image') ? '🖼️' : '📁'}
            </div>
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {placeholder}
            </p>
            <p className={`text-xs ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              Max size: {maxSize}MB • Accepted: {accept}
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}