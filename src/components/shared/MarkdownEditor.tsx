"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { renderMarkdown, insertMarkdown } from "@/lib/markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  showPreview?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  label?: string;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "הזן תוכן בפורמט Markdown...",
  disabled = false,
  minRows = 6,
  maxRows = 20,
  showPreview = true,
  onImageUpload,
  label,
  error,
}: MarkdownEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lineHeight = 24;
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;

    textarea.style.height = "auto";
    const scrollHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${scrollHeight}px`;
  }, [value, minRows, maxRows]);

  // Handle toolbar button clicks
  const handleFormat = useCallback(
    (type: "bold" | "italic" | "link" | "image" | "bullet" | "heading") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const { newText, newCursorPos } = insertMarkdown(
        value,
        selectionStart,
        selectionEnd,
        type
      );

      onChange(newText);

      // Restore focus and cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            handleFormat("bold");
            break;
          case "i":
            e.preventDefault();
            handleFormat("italic");
            break;
          case "k":
            e.preventDefault();
            handleFormat("link");
            break;
        }
      }
    },
    [handleFormat]
  );

  // Handle image upload
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);

      try {
        let imageUrl: string;

        if (onImageUpload) {
          imageUrl = await onImageUpload(file);
        } else {
          // Default upload to API
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", "reports");

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

          imageUrl = data.data.url.startsWith("http")
            ? data.data.url
            : `${API_BASE_URL}${data.data.url}`;
        }

        // Insert markdown image syntax
        const textarea = textareaRef.current;
        if (textarea) {
          const { selectionStart } = textarea;
          const before = value.slice(0, selectionStart);
          const after = value.slice(selectionStart);
          const imageMarkdown = `\n![תמונה](${imageUrl})\n`;
          onChange(before + imageMarkdown + after);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("שגיאה בהעלאת התמונה");
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  }, [value, onChange, onImageUpload]);

  // Handle drag and drop
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) return;

      setIsUploading(true);

      try {
        let imageUrl: string;

        if (onImageUpload) {
          imageUrl = await onImageUpload(file);
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", "reports");

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

          imageUrl = data.data.url.startsWith("http")
            ? data.data.url
            : `${API_BASE_URL}${data.data.url}`;
        }

        const textarea = textareaRef.current;
        if (textarea) {
          const { selectionStart } = textarea;
          const before = value.slice(0, selectionStart);
          const after = value.slice(selectionStart);
          const imageMarkdown = `\n![תמונה](${imageUrl})\n`;
          onChange(before + imageMarkdown + after);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("שגיאה בהעלאת התמונה");
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, onImageUpload]
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
          {label}
        </label>
      )}

      <div
        className={`border rounded-lg overflow-hidden ${
          error ? "border-red-500" : "border-[#C6C6C6]"
        } ${disabled ? "opacity-50" : ""}`}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5 bg-[#F7F7F7] border-b border-[#C6C6C6]">
          <ToolbarButton
            icon="B"
            title="מודגש (Ctrl+B)"
            onClick={() => handleFormat("bold")}
            disabled={disabled || isPreviewMode}
            bold
          />
          <ToolbarButton
            icon="I"
            title="נטוי (Ctrl+I)"
            onClick={() => handleFormat("italic")}
            disabled={disabled || isPreviewMode}
            italic
          />
          <div className="w-px h-5 bg-[#C6C6C6] mx-1" />
          <ToolbarButton
            icon="H"
            title="כותרת"
            onClick={() => handleFormat("heading")}
            disabled={disabled || isPreviewMode}
          />
          <ToolbarButton
            icon="•"
            title="רשימה"
            onClick={() => handleFormat("bullet")}
            disabled={disabled || isPreviewMode}
          />
          <ToolbarButton
            icon="🔗"
            title="קישור (Ctrl+K)"
            onClick={() => handleFormat("link")}
            disabled={disabled || isPreviewMode}
          />
          <div className="w-px h-5 bg-[#C6C6C6] mx-1" />
          <ToolbarButton
            icon={isUploading ? "⏳" : "🖼️"}
            title="העלאת תמונה"
            onClick={handleImageUpload}
            disabled={disabled || isPreviewMode || isUploading}
          />

          {showPreview && (
            <>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  isPreviewMode
                    ? "bg-[#215388] text-white"
                    : "bg-white text-[#706F6F] hover:bg-gray-100"
                }`}
              >
                {isPreviewMode ? "עריכה" : "תצוגה מקדימה"}
              </button>
            </>
          )}
        </div>

        {/* Editor / Preview */}
        <div className="relative">
          {isPreviewMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 min-h-[150px] bg-white"
              dir="rtl"
            >
              {value ? (
                renderMarkdown(value)
              ) : (
                <p className="text-[#B2B2B2] italic">אין תוכן להצגה</p>
              )}
            </motion.div>
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                w-full p-4 text-[#1D1D1B] bg-white resize-none
                focus:outline-none focus:ring-2 focus:ring-[#215388] focus:ring-inset
                placeholder:text-[#B2B2B2]
                font-mono text-sm leading-6
              `}
              style={{ minHeight: `${minRows * 24}px` }}
              dir="rtl"
            />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="flex items-center gap-2 text-[#215388]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-[#215388] border-t-transparent rounded-full"
                />
                <span className="text-sm">מעלה תמונה...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      <div className="mt-1 flex items-center justify-between text-xs text-[#B2B2B2]">
        <span>
          תומך ב-Markdown: **מודגש**, *נטוי*, - רשימה, [קישור](url), ![תמונה](url)
        </span>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Toolbar button component
interface ToolbarButtonProps {
  icon: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  bold?: boolean;
  italic?: boolean;
}

function ToolbarButton({
  icon,
  title,
  onClick,
  disabled,
  bold,
  italic,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        w-8 h-8 flex items-center justify-center rounded
        text-[#1D1D1B] hover:bg-white hover:shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none
        transition-all
        ${bold ? "font-bold" : ""}
        ${italic ? "italic" : ""}
      `}
    >
      {icon}
    </button>
  );
}

MarkdownEditor.displayName = "MarkdownEditor";

