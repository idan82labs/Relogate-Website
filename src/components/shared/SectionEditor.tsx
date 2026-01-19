"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarkdownEditor } from "./MarkdownEditor";
import type { DestinationSection } from "@/services/reports";

// Common section presets
const SECTION_PRESETS: { key: string; title: string; icon: string }[] = [
  { key: "visa", title: "ויזה ותהליך", icon: "🛂" },
  { key: "safety", title: "ביטחון אישי", icon: "🛡️" },
  { key: "healthcare", title: "מערכת בריאות", icon: "🏥" },
  { key: "education", title: "חינוך", icon: "🎓" },
  { key: "employment", title: "תעסוקה", icon: "💼" },
  { key: "cost", title: "יוקר מחייה", icon: "💰" },
  { key: "jewish", title: "קהילה יהודית", icon: "✡️" },
  { key: "family", title: "חיי משפחה", icon: "👨‍👩‍👧‍👦" },
  { key: "housing", title: "דיור", icon: "🏠" },
  { key: "lifestyle", title: "אורח חיים", icon: "🌴" },
];

interface SectionEditorProps {
  section: DestinationSection;
  index: number;
  totalSections: number;
  onUpdate: (section: DestinationSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled?: boolean;
}

export function SectionEditor({
  section,
  index,
  totalSections,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  disabled = false,
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasContent = section.content && section.content.trim().length > 0;

  const handleFieldChange = useCallback(
    (field: keyof DestinationSection, value: string | number) => {
      onUpdate({
        ...section,
        [field]: value,
      });
    },
    [section, onUpdate]
  );

  const handlePresetSelect = useCallback(
    (preset: { key: string; title: string; icon: string }) => {
      onUpdate({
        ...section,
        key: preset.key,
        title: preset.title,
        icon: preset.icon,
      });
    },
    [section, onUpdate]
  );

  return (
    <div className="border border-[#E5E5E5] rounded-lg overflow-hidden bg-white">
      {/* Section Header */}
      <div
        className={`flex items-center gap-2 px-3 py-2 ${
          hasContent ? "bg-[#215388]/5" : "bg-[#F7F7F7]"
        }`}
      >
        {/* Drag Handle / Position Indicator */}
        <span className="text-sm font-medium text-[#706F6F] w-6 text-center">
          {index + 1}
        </span>

        {/* Icon */}
        <span className="text-lg">{section.icon || "📝"}</span>

        {/* Title */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-right font-medium text-[#1D1D1B] hover:text-[#215388] transition-colors"
        >
          {section.title || "סעיף חדש"}
        </button>

        {/* Status Badge */}
        {hasContent && (
          <span className="text-xs text-[#215388] font-medium bg-[#215388]/10 px-2 py-0.5 rounded">
            יש תוכן
          </span>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={disabled || index === 0}
            className="p-1 text-[#706F6F] hover:text-[#1D1D1B] disabled:opacity-30 disabled:cursor-not-allowed"
            title="העלה"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={disabled || index === totalSections - 1}
            className="p-1 text-[#706F6F] hover:text-[#1D1D1B] disabled:opacity-30 disabled:cursor-not-allowed"
            title="הורד"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="מחק"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#706F6F] hover:text-[#1D1D1B]"
          >
            <motion.svg
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Section Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Key */}
                <div>
                  <label className="block text-xs font-medium text-[#706F6F] mb-1">
                    מפתח (key)
                  </label>
                  <input
                    type="text"
                    value={section.key}
                    onChange={(e) => handleFieldChange("key", e.target.value)}
                    placeholder="visa, safety, custom..."
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
                    dir="ltr"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-[#706F6F] mb-1">
                    כותרת
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="כותרת הסעיף"
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
                    dir="rtl"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-xs font-medium text-[#706F6F] mb-1">
                    אייקון
                  </label>
                  <input
                    type="text"
                    value={section.icon || ""}
                    onChange={(e) => handleFieldChange("icon", e.target.value)}
                    placeholder="🛂 או שם אייקון"
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-medium text-[#706F6F] mb-2">
                  בחירה מהירה:
                </label>
                <div className="flex flex-wrap gap-1">
                  {SECTION_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      disabled={disabled}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                        section.key === preset.key
                          ? "bg-[#215388] text-white"
                          : "bg-[#F7F7F7] text-[#1D1D1B] hover:bg-[#215388]/10"
                      } disabled:opacity-50`}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-xs font-medium text-[#706F6F] mb-1">
                  תוכן (Markdown)
                </label>
                <MarkdownEditor
                  value={section.content}
                  onChange={(value) => handleFieldChange("content", value)}
                  placeholder="תוכן הסעיף (תומך Markdown)..."
                  disabled={disabled}
                  minRows={6}
                  showPreview={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Section List Manager
interface SectionListEditorProps {
  sections: DestinationSection[];
  onChange: (sections: DestinationSection[]) => void;
  disabled?: boolean;
}

export function SectionListEditor({
  sections,
  onChange,
  disabled = false,
}: SectionListEditorProps) {
  const handleAdd = useCallback(() => {
    const newSection: DestinationSection = {
      id: crypto.randomUUID(),
      key: "",
      title: "",
      icon: "📝",
      content: "",
      position: sections.length,
    };
    onChange([...sections, newSection]);
  }, [sections, onChange]);

  const handleUpdate = useCallback(
    (index: number, section: DestinationSection) => {
      const updated = [...sections];
      updated[index] = section;
      onChange(updated);
    },
    [sections, onChange]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const updated = sections.filter((_, i) => i !== index);
      // Update positions
      updated.forEach((s, i) => (s.position = i));
      onChange(updated);
    },
    [sections, onChange]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const updated = [...sections];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      // Update positions
      updated.forEach((s, i) => (s.position = i));
      onChange(updated);
    },
    [sections, onChange]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === sections.length - 1) return;
      const updated = [...sections];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      // Update positions
      updated.forEach((s, i) => (s.position = i));
      onChange(updated);
    },
    [sections, onChange]
  );

  return (
    <div className="space-y-3">
      {sections.length === 0 ? (
        <div className="text-center py-8 bg-[#F7F7F7] rounded-lg">
          <p className="text-[#706F6F]">אין סעיפים</p>
          <p className="text-sm text-[#B2B2B2] mt-1">
            הוסף סעיפים עם תוכן מפורט על היעד
          </p>
        </div>
      ) : (
        sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            totalSections={sections.length}
            onUpdate={(updated) => handleUpdate(index, updated)}
            onDelete={() => handleDelete(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            disabled={disabled}
          />
        ))
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#215388] bg-[#215388]/5 hover:bg-[#215388]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        הוסף סעיף
      </button>
    </div>
  );
}

SectionEditor.displayName = "SectionEditor";
SectionListEditor.displayName = "SectionListEditor";

