"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AspectRatio = "square" | "wide" | "flag";
type UploadCategory = "countries" | "users" | "reports";

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  category?: UploadCategory;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  aspectRatio?: AspectRatio;
  maxSizeMB?: number;
}

const aspectRatioClasses: Record<AspectRatio, string> = {
  square: "aspect-square",
  wide: "aspect-video",
  flag: "aspect-[3/2]",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function ImageUpload({
  label,
  value,
  onChange,
  category = "countries",
  placeholder = "גרור תמונה או לחץ לבחירה",
  error,
  disabled = false,
  aspectRatio = "wide",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection (from input or drop)
  const handleFile = useCallback(
    async (file: File) => {
      setUploadError(null);

      // Client-side validation - file type
      if (!file.type.startsWith("image/")) {
        setUploadError("יש לבחור קובץ תמונה");
        return;
      }

      // Client-side validation - file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`גודל הקובץ המקסימלי הוא ${maxSizeMB}MB`);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const token = localStorage.getItem("relogate_access_token");
        const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        // Construct full URL for the uploaded image
        const imageUrl = data.data.url.startsWith("http")
          ? data.data.url
          : `${API_BASE_URL}${data.data.url}`;

        onChange(imageUrl);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "שגיאה בהעלאה");
      } finally {
        setIsUploading(false);
      }
    },
    [category, maxSizeMB, onChange]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !isUploading) {
        setIsDragging(true);
      }
    },
    [disabled, isUploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, isUploading, handleFile]
  );

  // Click to select
  const handleClick = useCallback(() => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isUploading]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // Reset input to allow selecting same file again
      e.target.value = "";
    },
    [handleFile]
  );

  // Remove image
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
      setUploadError(null);
    },
    [onChange]
  );

  // Replace image
  const handleReplace = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    },
    []
  );

  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
        {label}
      </label>

      {/* Upload Area / Preview */}
      <div
        onClick={!value ? handleClick : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed
          transition-colors duration-200
          ${aspectRatioClasses[aspectRatio]}
          ${disabled ? "opacity-50 cursor-not-allowed bg-[#F7F7F7]" : ""}
          ${!value && !disabled && !isUploading ? "cursor-pointer hover:border-[#215388] hover:bg-[#215388]/5" : ""}
          ${isDragging ? "border-[#215388] bg-[#215388]/10" : "border-[#C6C6C6]"}
          ${displayError ? "border-red-500" : ""}
        `}
      >
        <AnimatePresence mode="wait">
          {value ? (
            // Preview Mode
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full group"
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              {/* Actions Overlay */}
              {!disabled && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReplace}
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1D1D1B] hover:bg-gray-100 transition-colors"
                  >
                    החלף
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-4 py-2 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-colors"
                  >
                    הסר
                  </button>
                </div>
              )}
            </motion.div>
          ) : isUploading ? (
            // Uploading State
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-3 border-[#215388] border-t-transparent rounded-full"
              />
              <span className="mt-2 text-sm text-[#706F6F]">מעלה...</span>
            </motion.div>
          ) : (
            // Empty State
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full p-4"
            >
              {/* Upload Icon */}
              <svg
                className="w-10 h-10 text-[#C6C6C6] mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-[#706F6F] text-center">
                {placeholder}
              </span>
              <span className="text-xs text-[#B2B2B2] mt-1">
                PNG, JPG, WEBP עד {maxSizeMB}MB
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Error Message */}
      {displayError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {displayError}
        </motion.p>
      )}
    </div>
  );
}

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
