'use client';

/**
 * QuestionnaireAnswersDisplay Component
 *
 * Displays questionnaire answers in human-readable Hebrew format.
 * Used in admin dashboard when reviewing user submissions.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  questionnaireSections,
  getFieldLabel,
  translateValue,
  type QuestionnaireSection,
} from '@/lib/questionnaire-translations';
import type { ChildInfo } from '@/types/questionnaire';

interface QuestionnaireAnswersDisplayProps {
  /** Questionnaire responses data */
  responses: Record<string, unknown>;
  /** Whether to show all sections expanded by default */
  defaultExpanded?: boolean;
  /** Custom className */
  className?: string;
}

interface AnswerRowProps {
  label: string;
  value: string;
}

function AnswerRow({ label, value }: AnswerRowProps) {
  if (!value || value === '-') return null;

  return (
    <div className="flex justify-between items-start py-2 border-b border-[#F7F7F7] last:border-0">
      <span className="text-[#706F6F] text-sm">{label}</span>
      <span className="text-[#1D1D1B] text-sm font-medium text-left max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

interface SectionCardProps {
  section: QuestionnaireSection;
  responses: Record<string, unknown>;
  isExpanded: boolean;
  onToggle: () => void;
}

function SectionCard({ section, responses, isExpanded, onToggle }: SectionCardProps) {
  // Check if this section has any non-empty values
  const hasValues = section.fields.some((field) => {
    const value = responses[field];
    return value !== undefined && value !== null && value !== '';
  });

  if (!hasValues) return null;

  return (
    <div className="border border-[#C6C6C6] rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F7F7F7] hover:bg-[#EFEFEF] transition-colors"
      >
        <h4 className="font-semibold text-[#1D1D1B]">{section.title}</h4>
        <svg
          className={`w-5 h-5 text-[#706F6F] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Section Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3">
              {section.fields.map((field) => {
                const value = responses[field];
                if (value === undefined || value === null) return null;

                // Special handling for children array
                if (field === 'children' && Array.isArray(value)) {
                  const children = value as ChildInfo[];
                  if (children.length === 0) return null;
                  const childrenText = children
                    .map((child, i) => `${child.name || `ילד ${i + 1}`} (גיל ${child.age})`)
                    .join(', ');
                  return (
                    <AnswerRow
                      key={field}
                      label={getFieldLabel(field)}
                      value={childrenText}
                    />
                  );
                }

                const translatedValue = translateValue(field, value);
                return (
                  <AnswerRow
                    key={field}
                    label={getFieldLabel(field)}
                    value={translatedValue}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function QuestionnaireAnswersDisplay({
  responses,
  defaultExpanded = true,
  className = '',
}: QuestionnaireAnswersDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (defaultExpanded) {
      return new Set(questionnaireSections.map((s) => s.id));
    }
    return new Set();
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(questionnaireSections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  if (!responses || Object.keys(responses).length === 0) {
    return (
      <div className={`text-center py-8 text-[#706F6F] ${className}`}>
        אין נתוני שאלון זמינים
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Controls */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={expandAll}
          className="text-sm text-[#215388] hover:underline"
        >
          הרחב הכל
        </button>
        <span className="text-[#C6C6C6]">|</span>
        <button
          type="button"
          onClick={collapseAll}
          className="text-sm text-[#215388] hover:underline"
        >
          כווץ הכל
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {questionnaireSections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            responses={responses}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
}
