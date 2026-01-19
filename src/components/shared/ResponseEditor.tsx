"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarkdownEditor } from "./MarkdownEditor";
import { SectionListEditor } from "./SectionEditor";
import { ImageUpload } from "./ImageUpload";
import type {
  DestinationInfo,
  MatchInfo,
  DestinationNarrative,
  DestinationSection,
} from "@/services/reports";

// Accordion Section Component
interface AccordionSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({
  title,
  subtitle,
  icon,
  isExpanded,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-xl">{icon}</span>
        <div className="flex-1 text-right">
          <h3 className="font-semibold text-[#1D1D1B]">{title}</h3>
          {subtitle && (
            <p className="text-sm text-[#706F6F]">{subtitle}</p>
          )}
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-5 h-5 text-[#706F6F]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-[#F7F7F7]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// List Editor for highlights
interface ListEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  addButtonText?: string;
}

function ListEditor({
  value,
  onChange,
  placeholder = "הזן פריט",
  disabled,
  addButtonText = "הוסף פריט",
}: ListEditorProps) {
  const handleAdd = useCallback(() => {
    onChange([...value, ""]);
  }, [value, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const handleChange = useCallback(
    (index: number, newValue: string) => {
      const updated = [...value];
      updated[index] = newValue;
      onChange(updated);
    },
    [value, onChange]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const updated = [...value];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      onChange(updated);
    },
    [value, onChange]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === value.length - 1) return;
      const updated = [...value];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      onChange(updated);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-[#706F6F] text-sm w-4">{index + 1}.</span>
          <input
            type="text"
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 px-3 py-2 border border-[#C6C6C6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
            dir="rtl"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMoveUp(index)}
              disabled={disabled || index === 0}
              className="p-1 text-[#706F6F] hover:text-[#1D1D1B] disabled:opacity-30"
              title="העלה"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleMoveDown(index)}
              disabled={disabled || index === value.length - 1}
              className="p-1 text-[#706F6F] hover:text-[#1D1D1B] disabled:opacity-30"
              title="הורד"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30"
              title="הסר"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm text-[#215388] hover:bg-[#215388]/5 rounded-lg transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {addButtonText}
      </button>
    </div>
  );
}

interface ResponseEditorProps {
  destination: DestinationInfo;
  match: MatchInfo;
  narrative: DestinationNarrative;
  sections: DestinationSection[];
  onDestinationChange: (destination: DestinationInfo) => void;
  onMatchChange: (match: MatchInfo) => void;
  onNarrativeChange: (narrative: DestinationNarrative) => void;
  onSectionsChange: (sections: DestinationSection[]) => void;
  disabled?: boolean;
  showImportExport?: boolean;
}

export function ResponseEditor({
  destination,
  match,
  narrative,
  sections,
  onDestinationChange,
  onMatchChange,
  onNarrativeChange,
  onSectionsChange,
  disabled = false,
  showImportExport = true,
}: ResponseEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["destination", "narrative"])
  );
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // Handle destination field change
  const handleDestinationFieldChange = useCallback(
    (field: keyof DestinationInfo, value: string | null) => {
      onDestinationChange({
        ...destination,
        [field]: value,
      });
    },
    [destination, onDestinationChange]
  );

  // Handle match field change
  const handleMatchFieldChange = useCallback(
    (field: keyof MatchInfo, value: number | string | string[] | null) => {
      onMatchChange({
        ...match,
        [field]: value,
      });
    },
    [match, onMatchChange]
  );

  // Handle narrative field change
  const handleNarrativeFieldChange = useCallback(
    (field: keyof DestinationNarrative, value: string | string[] | undefined) => {
      onNarrativeChange({
        ...narrative,
        [field]: value,
      });
    },
    [narrative, onNarrativeChange]
  );

  // Import handler
  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate and apply v2 format
      if (data.destination) {
        onDestinationChange({
          name: data.destination.name || "",
          subtitle: data.destination.subtitle || null,
          image: data.destination.image || null,
          badge: data.destination.badge || null,
        });
      }

      if (data.match) {
        onMatchChange({
          score: data.match.score ?? 0,
          reasons: data.match.reasons || [],
          visaType: data.match.visaType || null,
        });
      }

      if (data.narrative) {
        onNarrativeChange(data.narrative);
      }

      if (data.sections && Array.isArray(data.sections)) {
        // Add IDs if missing
        const sectionsWithIds = data.sections.map((s: DestinationSection, i: number) => ({
          ...s,
          id: s.id || crypto.randomUUID(),
          position: s.position ?? i,
        }));
        onSectionsChange(sectionsWithIds);
      }

      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch {
      setImportError("שגיאה בקריאת הקובץ - וודא שזהו קובץ JSON תקין");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onDestinationChange, onMatchChange, onNarrativeChange, onSectionsChange]);

  // Export handler
  const handleExport = useCallback(() => {
    const exportData = {
      version: "2.0",
      destination,
      match,
      narrative,
      sections: sections.map(({ id: _id, ...rest }) => rest), // Remove IDs for export
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${destination.name || "destination"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [destination, match, narrative, sections]);

  return (
    <div className="space-y-4">
      {/* Import/Export Bar */}
      {showImportExport && (
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Import Button */}
              <label
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#215388]/10 text-[#215388] hover:bg-[#215388]/20"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                ייבוא מקובץ
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={disabled}
                  className="hidden"
                />
              </label>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExport}
                disabled={disabled}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-[#1D1D1B] hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                ייצוא לקובץ
              </button>
            </div>

            {/* Status Messages */}
            <div className="flex-1 text-left">
              <AnimatePresence mode="wait">
                {importError && (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-600"
                  >
                    {importError}
                  </motion.span>
                )}
                {importSuccess && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-green-600"
                  >
                    הייבוא הושלם בהצלחה!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Destination Info Section */}
      <AccordionSection
        id="destination"
        title="פרטי היעד"
        subtitle="שם, תמונה ותיאור היעד"
        icon="📍"
        isExpanded={expandedSections.has("destination")}
        onToggle={() => toggleSection("destination")}
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
              שם היעד *
            </label>
            <input
              type="text"
              value={destination.name}
              onChange={(e) => handleDestinationFieldChange("name", e.target.value)}
              placeholder="לונדון, פורטוגל, קנדה..."
              disabled={disabled}
              className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
              dir="rtl"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
              תת-כותרת (אופציונלי)
            </label>
            <input
              type="text"
              value={destination.subtitle || ""}
              onChange={(e) => handleDestinationFieldChange("subtitle", e.target.value || null)}
              placeholder="בריטניה, דרום אירופה..."
              disabled={disabled}
              className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
              dir="rtl"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
              תג (badge)
            </label>
            <input
              type="text"
              value={destination.badge || ""}
              onChange={(e) => handleDestinationFieldChange("badge", e.target.value || null)}
              placeholder="מומלץ במיוחד, הכי פופולרי..."
              disabled={disabled}
              className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
              dir="rtl"
            />
          </div>

          {/* Image */}
          <div>
            <ImageUpload
              label="תמונה"
              value={destination.image}
              onChange={(url) => handleDestinationFieldChange("image", url)}
              disabled={disabled}
              placeholder="URL לתמונת היעד"
            />
          </div>
        </div>
      </AccordionSection>

      {/* Match Info Section */}
      <AccordionSection
        id="match"
        title="התאמה"
        subtitle="ציון, סיבות וסוג ויזה"
        icon="🎯"
        isExpanded={expandedSections.has("match")}
        onToggle={() => toggleSection("match")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Match Score */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                ציון התאמה (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={match.score}
                onChange={(e) => handleMatchFieldChange("score", Number(e.target.value))}
                disabled={disabled}
                className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
              />
            </div>

            {/* Visa Type */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                סוג ויזה
              </label>
              <input
                type="text"
                value={match.visaType || ""}
                onChange={(e) => handleMatchFieldChange("visaType", e.target.value || null)}
                placeholder="נוודים דיגיטליים D8, Skilled Worker..."
                disabled={disabled}
                className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Match Reasons */}
          <div>
            <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
              סיבות להתאמה (שורה לכל סיבה)
            </label>
            <textarea
              value={match.reasons.join("\n")}
              onChange={(e) =>
                handleMatchFieldChange(
                  "reasons",
                  e.target.value.split("\n").filter((r) => r.trim())
                )
              }
              placeholder="שוק עבודה חזק&#10;קהילה ישראלית&#10;מחיר סביר"
              rows={3}
              disabled={disabled}
              className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] resize-y disabled:opacity-50"
              dir="rtl"
            />
          </div>
        </div>
      </AccordionSection>

      {/* Narrative Section */}
      <AccordionSection
        id="narrative"
        title="סיפור אישי"
        subtitle="התוכן המותאם אישית שיוצג בכרטיס"
        icon="📖"
        isExpanded={expandedSections.has("narrative")}
        onToggle={() => toggleSection("narrative")}
      >
        <div className="space-y-6">
          {/* Introduction */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>🌍</span>
              <span className="font-medium text-[#1D1D1B]">הקדמה</span>
            </div>
            <MarkdownEditor
              value={narrative.introduction || ""}
              onChange={(value) => handleNarrativeFieldChange("introduction", value || undefined)}
              placeholder="פתיחה אישית - למה היעד הזה מתאים לכם..."
              disabled={disabled}
              minRows={3}
              showPreview={false}
            />
          </div>

          {/* Pathway */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>🛤️</span>
              <span className="font-medium text-[#1D1D1B]">המסלול</span>
            </div>
            <MarkdownEditor
              value={narrative.pathway || ""}
              onChange={(value) => handleNarrativeFieldChange("pathway", value || undefined)}
              placeholder="תיאור מסלול הויזה המומלץ..."
              disabled={disabled}
              minRows={3}
              showPreview={false}
            />
          </div>

          {/* Fit */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>✓</span>
              <span className="font-medium text-[#1D1D1B]">איך אתם מתאימים</span>
            </div>
            <MarkdownEditor
              value={narrative.fit || ""}
              onChange={(value) => handleNarrativeFieldChange("fit", value || undefined)}
              placeholder="הסבר איך הפרופיל שלהם מתאים לדרישות..."
              disabled={disabled}
              minRows={3}
              showPreview={false}
            />
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>💎</span>
              <span className="font-medium text-[#1D1D1B]">יתרונות</span>
            </div>
            <MarkdownEditor
              value={narrative.benefits || ""}
              onChange={(value) => handleNarrativeFieldChange("benefits", value || undefined)}
              placeholder="יתרונות ספציפיים עבורם..."
              disabled={disabled}
              minRows={3}
              showPreview={false}
            />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>⭐</span>
              <span className="font-medium text-[#1D1D1B]">נקודות מרכזיות</span>
            </div>
            <ListEditor
              value={narrative.highlights || []}
              onChange={(value) => handleNarrativeFieldChange("highlights", value.length > 0 ? value : undefined)}
              placeholder="נקודה מרכזית"
              disabled={disabled}
              addButtonText="הוסף נקודה"
            />
          </div>
        </div>
      </AccordionSection>

      {/* Sections (Dynamic) */}
      <AccordionSection
        id="sections"
        title="מידע מפורט"
        subtitle="סעיפים גמישים עם תוכן מותאם אישית"
        icon="📑"
        isExpanded={expandedSections.has("sections")}
        onToggle={() => toggleSection("sections")}
      >
        <SectionListEditor
          sections={sections}
          onChange={onSectionsChange}
          disabled={disabled}
        />
      </AccordionSection>
    </div>
  );
}

ResponseEditor.displayName = "ResponseEditor";

