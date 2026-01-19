"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts";
import { Button } from "@/components/shared";
import { renderMarkdown } from "@/lib/markdown";
import {
  getUserReport,
  getReportStatus,
  type UserReport,
  type UserDestinationResponse,
} from "@/services/userReports";

// Content
const pageContent = {
  loading: "טוען את הדוח שלך...",
  notReady: {
    title: "הדוח שלך בהכנה",
    description:
      "צוות Relogate עובד על הכנת הדוח האישי שלך. נעדכן אותך ברגע שהוא יהיה מוכן!",
    tip: "בינתיים, תוכל לעיין באזור האישי שלך ולעדכן את הפרטים שלך.",
  },
  noReport: {
    title: "אין דוח זמין",
    description:
      "נראה שטרם מילאת את השאלון. מלא את השאלון כדי לקבל דוח מותאם אישית.",
    cta: "מלא שאלון",
  },
  backToPersonalArea: "חזרה לאזור האישי",
  recommendedDestinations: "היעדים המומלצים עבורך",
  viewDetails: "צפה בפרטים",
  matchScore: "ציון התאמה",
  whyFits: "למה מתאים לכם",
  detailedInfo: "מידע מפורט",
  clickToExpand: "לחצו על קטגוריה לצפייה במידע מפורט",
  noContent: "אין תוכן זמין",
};

// Narrative section labels
const narrativeLabels = {
  introduction: { title: "הקדמה", icon: "🌍" },
  pathway: { title: "המסלול", icon: "🛤️" },
  fit: { title: "איך אתם מתאימים", icon: "✓" },
  benefits: { title: "יתרונות", icon: "💎" },
  highlights: { title: "נקודות מרכזיות", icon: "⭐" },
};

function ReportHeader() {
  return (
    <header className="bg-white border-b border-[#C6C6C6] sticky top-0 z-40">
      <div className="container h-[88px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo-header.svg" alt="Relogate" width={167} height={36} />
        </Link>
        <Link
          href="/personal-area"
          className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
        >
          {pageContent.backToPersonalArea}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}

function ReportNotReady() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <ReportHeader />
      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#215388]/10 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#215388]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1D1D1B] mb-4">
              {pageContent.notReady.title}
            </h1>
            <p className="text-[#706F6F] mb-8">
              {pageContent.notReady.description}
            </p>
            <p className="text-sm text-[#B2B2B2]">{pageContent.notReady.tip}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function NoReport() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <ReportHeader />
      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#239083]/10 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#239083]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1D1D1B] mb-4">
              {pageContent.noReport.title}
            </h1>
            <p className="text-[#706F6F] mb-8">
              {pageContent.noReport.description}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/questionnaire")}
            >
              {pageContent.noReport.cta}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function GreetingSection({
  greeting,
  userName,
}: {
  greeting: string | null;
  userName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#215388] to-[#203170] text-white rounded-2xl p-8 mb-8"
    >
      <h1 className="text-3xl font-bold mb-4">שלום {userName}!</h1>
      {greeting && (
        <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90">
          {greeting}
        </p>
      )}
    </motion.div>
  );
}

function ProfileSummary({ summary }: { summary: UserReport["profileSummary"] }) {
  const fields = [
    { label: "אזרחות", value: summary?.citizenship },
    { label: "מצב משפחתי", value: summary?.familyStatus },
    { label: "מטרות הגירה", value: summary?.relocationGoals },
  ];

  const hasContent = fields.some((f) => f.value);
  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-[#1D1D1B] mb-4">הפרופיל שלך</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(
          ({ label, value }) =>
            value && (
              <div key={label} className="bg-[#F9F6F1] rounded-xl p-4">
                <p className="text-sm text-[#706F6F] mb-1">{label}</p>
                <p className="font-medium text-[#1D1D1B]">{value}</p>
              </div>
            )
        )}
      </div>
    </motion.div>
  );
}

function DestinationCard({
  response,
  index,
  isSelected,
  onClick,
}: {
  response: UserDestinationResponse;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { destination, match } = response;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      onClick={onClick}
      className={`w-full text-right rounded-2xl p-6 transition-all ${
        isSelected
          ? "bg-[#215388] text-white shadow-lg scale-[1.02]"
          : "bg-white shadow hover:shadow-lg hover:scale-[1.01]"
      }`}
    >
      <div className="flex items-center gap-4">
        {destination.image && (
          /* eslint-disable-next-line @next/next/no-img-element -- Dynamic image from API */
          <img
            src={destination.image}
            alt={destination.name}
            className="w-16 h-12 object-cover rounded-lg shadow"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-xl font-bold truncate ${
              isSelected ? "text-white" : "text-[#1D1D1B]"
            }`}
          >
            {destination.name}
          </h3>
          {destination.subtitle && (
            <p
              className={`text-sm truncate ${
                isSelected ? "text-white/70" : "text-[#706F6F]"
              }`}
            >
              {destination.subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
              isSelected ? "bg-white/20" : "bg-[#239083]/10 text-[#239083]"
            }`}
          >
            {match.score}%
          </div>
        </div>
      </div>

      {/* Badge */}
      {destination.badge && (
        <div
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
            isSelected ? "bg-white/20" : "bg-[#F9F6F1] text-[#1D1D1B]"
          }`}
        >
          <span>✨</span>
          <span>{destination.badge}</span>
        </div>
      )}
    </motion.button>
  );
}

function NarrativeSection({
  icon,
  title,
  content,
}: {
  icon: string;
  title: string;
  content: string;
}) {
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

function DestinationDetail({
  response,
}: {
  response: UserDestinationResponse;
}) {
  const { destination, match, narrative, sections } = response;
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
    <motion.div
      key={response.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#239083] to-[#215388] p-6 text-white">
        <div className="flex items-center gap-4">
          {destination.image && (
            /* eslint-disable-next-line @next/next/no-img-element -- Dynamic image from API */
            <img
              src={destination.image}
              alt={destination.name}
              className="w-20 h-14 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{destination.name}</h2>
            {destination.subtitle && (
              <p className="text-white/70">{destination.subtitle}</p>
            )}
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{match.score}%</div>
            <div className="text-sm text-white/70">
              {pageContent.matchScore}
            </div>
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
            {pageContent.whyFits.replace("מתאים", `${destination.name} מתאים`)}
          </h3>

          <div className="space-y-4">
            {narrative.introduction && (
              <NarrativeSection
                icon={narrativeLabels.introduction.icon}
                title={narrativeLabels.introduction.title}
                content={narrative.introduction}
              />
            )}

            {narrative.pathway && (
              <NarrativeSection
                icon={narrativeLabels.pathway.icon}
                title={narrativeLabels.pathway.title}
                content={narrative.pathway}
              />
            )}

            {narrative.fit && (
              <NarrativeSection
                icon={narrativeLabels.fit.icon}
                title={narrativeLabels.fit.title}
                content={narrative.fit}
              />
            )}

            {narrative.benefits && (
              <NarrativeSection
                icon={narrativeLabels.benefits.icon}
                title={narrativeLabels.benefits.title}
                content={narrative.benefits}
              />
            )}

            {narrative.highlights && narrative.highlights.length > 0 && (
              <div className="bg-[#F9F6F1] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span>{narrativeLabels.highlights.icon}</span>
                  <h4 className="font-semibold text-[#1D1D1B]">
                    {narrativeLabels.highlights.title}
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
            {pageContent.detailedInfo}
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
                  sortedSections.find((s) => s.id === expandedSection)
                    ?.content || ""
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt to click */}
          {!expandedSection && (
            <p className="text-sm text-[#706F6F] text-center">
              {pageContent.clickToExpand}
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasNarrativeContent && sortedSections.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-[#706F6F]">{pageContent.noContent}</p>
        </div>
      )}
    </motion.div>
  );
}

function UserReportContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [report, setReport] = useState<UserReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasReport, setHasReport] = useState<boolean | null>(null);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);

  useEffect(() => {
    async function loadReport() {
      // First check status
      const { data: statusData } = await getReportStatus();

      if (!statusData?.hasReport) {
        setHasReport(false);
        setLoading(false);
        return;
      }

      setHasReport(true);

      if (
        !statusData.hasPublishedReport ||
        statusData.publishedDestinationCount === 0
      ) {
        setIsPublished(false);
        setLoading(false);
        return;
      }

      setIsPublished(true);

      // Fetch full report
      const { report: reportData } = await getUserReport();
      if (reportData) {
        setReport(reportData);

        // Check if URL has specific destination selected
        const destinationParam = searchParams.get("destination");
        if (destinationParam) {
          const idx = reportData.destinations.findIndex(
            (r) => r.id === destinationParam
          );
          if (idx >= 0) {
            setSelectedDestinationIndex(idx);
          }
        }
      }
      setLoading(false);
    }

    loadReport();
  }, [searchParams]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#F7F7F7] flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#215388] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[#706F6F]">{pageContent.loading}</p>
        </div>
      </div>
    );
  }

  if (!hasReport) {
    return <NoReport />;
  }

  if (!isPublished) {
    return <ReportNotReady />;
  }

  if (!report) {
    return <NoReport />;
  }

  const userName =
    report.profileSummary?.userName || user?.firstName || "משתמש";
  const selectedResponse = report.destinations[selectedDestinationIndex];

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <ReportHeader />

      <main className="container py-8">
        {/* Greeting */}
        <GreetingSection greeting={report.greeting} userName={userName} />

        {/* Profile Summary */}
        <ProfileSummary summary={report.profileSummary} />

        {/* Destinations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#1D1D1B] mb-6">
            {pageContent.recommendedDestinations}
          </h2>

          {report.destinations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Destination List */}
              <div className="space-y-4">
                {report.destinations.map((response, index) => (
                  <DestinationCard
                    key={response.id}
                    response={response}
                    index={index}
                    isSelected={index === selectedDestinationIndex}
                    onClick={() => setSelectedDestinationIndex(index)}
                  />
                ))}
              </div>

              {/* Destination Detail */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedResponse && (
                    <DestinationDetail response={selectedResponse} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <p className="text-[#706F6F] text-lg">אין יעדים מומלצים זמינים</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default function UserReportPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    async function checkAuth() {
      if (isLoading) return;

      if (!isAuthenticated) {
        sessionStorage.setItem("redirectAfterLogin", "/personal-area/report");
        router.replace("/login");
      }
    }
    checkAuth();
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <UserReportContent />;
}
