"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { renderMarkdown } from "@/lib/markdown";
import type {
  DestinationInfo,
  MatchInfo,
  DestinationNarrative,
  DestinationSection,
} from "@/services/reports";

interface ResponsePreviewProps {
  destination: DestinationInfo;
  match: MatchInfo;
  narrative: DestinationNarrative;
  sections: DestinationSection[];
}

export function ResponsePreview({
  destination,
  match,
  narrative,
  sections,
}: ResponsePreviewProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const hasNarrativeContent =
    narrative.introduction ||
    narrative.pathway ||
    narrative.fit ||
    narrative.benefits ||
    (narrative.highlights && narrative.highlights.length > 0);

  // Sort sections by position
  const sortedSections = [...sections].sort((a, b) => a.position - b.position);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#239083] to-[#215388] p-6 text-white">
        <div className="flex items-center gap-4">
          {destination.image && (
            // eslint-disable-next-line @next/next/no-img-element -- Dynamic image URL from API
            <img
              src={destination.image}
              alt={destination.name}
              className="w-20 h-14 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{destination.name || "שם היעד"}</h2>
            {destination.subtitle && (
              <p className="text-white/70">{destination.subtitle}</p>
            )}
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{match.score}%</div>
            <div className="text-sm text-white/70">ציון התאמה</div>
          </div>
        </div>

        {/* Badge */}
        {destination.badge && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
            <span className="text-sm">✨</span>
            <span className="text-sm font-medium">{destination.badge}</span>
          </div>
        )}

        {/* Visa Type */}
        {match.visaType && (
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mr-2">
            <span className="text-sm">🛂</span>
            <span className="text-sm font-medium">{match.visaType}</span>
          </div>
        )}

        {/* Match Reasons */}
        {match.reasons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {match.reasons.map((reason, index) => (
              <span
                key={index}
                className="bg-white/10 rounded-full px-3 py-1 text-xs"
              >
                {reason}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Narrative Content */}
      {hasNarrativeContent && (
        <div className="p-6 border-b border-[#F7F7F7]">
          <h3 className="text-lg font-bold text-[#1D1D1B] mb-4">
            למה {destination.name || "היעד"} מתאים לכם
          </h3>

          <div className="space-y-4">
            {/* Introduction */}
            {narrative.introduction && (
              <NarrativeSection
                icon="🌍"
                title="הקדמה"
                content={narrative.introduction}
              />
            )}

            {/* Pathway */}
            {narrative.pathway && (
              <NarrativeSection
                icon="🛤️"
                title="המסלול"
                content={narrative.pathway}
              />
            )}

            {/* Fit */}
            {narrative.fit && (
              <NarrativeSection
                icon="✓"
                title="איך אתם מתאימים"
                content={narrative.fit}
              />
            )}

            {/* Benefits */}
            {narrative.benefits && (
              <NarrativeSection
                icon="💎"
                title="יתרונות"
                content={narrative.benefits}
              />
            )}

            {/* Highlights */}
            {narrative.highlights && narrative.highlights.length > 0 && (
              <div className="bg-[#F9F6F1] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span>⭐</span>
                  <h4 className="font-semibold text-[#1D1D1B]">
                    נקודות מרכזיות
                  </h4>
                </div>
                <ul className="space-y-2">
                  {narrative.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[#1D1D1B]"
                    >
                      <span className="text-[#239083] mt-1">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Sections */}
      {sortedSections.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#1D1D1B] mb-4">
            מידע מפורט
          </h3>

          {/* Section Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {sortedSections.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  expandedSection === section.id
                    ? "bg-[#215388] text-white"
                    : "bg-[#F7F7F7] text-[#1D1D1B] hover:bg-[#215388]/10"
                }`}
              >
                <span>{section.icon || "📝"}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>

          {/* Expanded Section Content */}
          <AnimatePresence mode="wait">
            {expandedSection && (
              <motion.div
                key={expandedSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#F9F6F1] rounded-xl p-4"
              >
                {renderMarkdown(
                  sortedSections.find((s) => s.id === expandedSection)?.content || ""
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt to click */}
          {!expandedSection && (
            <p className="text-sm text-[#706F6F] text-center">
              לחצו על קטגוריה לצפייה במידע מפורט
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasNarrativeContent && sortedSections.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-[#706F6F]">אין תוכן מותאם אישית להצגה</p>
          <p className="text-sm text-[#B2B2B2] mt-1">
            התחל להוסיף תוכן בעורך כדי לראות תצוגה מקדימה
          </p>
        </div>
      )}
    </div>
  );
}

// Narrative Section Component
interface NarrativeSectionProps {
  icon: string;
  title: string;
  content: string;
}

function NarrativeSection({ icon, title, content }: NarrativeSectionProps) {
  return (
    <div className="bg-[#F9F6F1] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <h4 className="font-semibold text-[#1D1D1B]">{title}</h4>
      </div>
      <div className="text-[#1D1D1B] leading-relaxed">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

ResponsePreview.displayName = "ResponsePreview";

