"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts";
import { Button } from "@/components/shared";

// Desktop component
import { ResultsPage } from "@/components/desktop/ResultsPage";

// Mobile component
import { MobileResultsPage } from "@/components/mobile/MobileResultsPage";

// Services
import {
  getUserReport,
  getReportStatus,
  type UserReport,
  type UserDestinationResponse,
} from "@/services/userReports";

// Content for various states
const pageContent = {
  loading: "טוען את הדוח שלך...",
  notAuthenticated: {
    title: "התחברות נדרשת",
    description: "על מנת לצפות בתוצאות האישיות שלך, יש להתחבר למערכת.",
    cta: "התחבר",
  },
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
};

/**
 * Section data structure for country details
 */
interface CountrySection {
  key: string;
  title: string;
  icon?: string;
  content: string;
  position: number;
}

/**
 * Transform UserDestinationResponse to the Country format expected by ResultsPage components
 */
function transformDestinationsToCountries(
  destinations: UserDestinationResponse[]
): Array<{
  id: string;
  name: string;
  englishName: string;
  matchScore: number;
  visaType: string;
  image: string;
  matchReasons: string[];
  description: string;
  visaInfo: string;
  sections: CountrySection[];
}> {
  return destinations.map((dest) => ({
    id: dest.id,
    name: dest.destination.name,
    englishName: dest.destination.subtitle || "",
    matchScore: dest.match.score,
    visaType: dest.match.visaType || "",
    image: dest.destination.image || "/countries/default.jpg",
    matchReasons: dest.match.reasons,
    description: dest.narrative.introduction || dest.narrative.fit || "",
    visaInfo:
      dest.sections.find((s) => s.key === "visa")?.content ||
      dest.narrative.pathway ||
      "",
    sections: dest.sections.map((s) => ({
      key: s.key,
      title: s.title,
      icon: s.icon || undefined,
      content: s.content,
      position: s.position,
    })),
  }));
}

/**
 * Transform UserReport to the userData format expected by ResultsPage components
 */
function transformReportToUserData(report: UserReport): {
  userName: string;
  profile: {
    citizenship: string;
    age: string;
    profession: string;
    familyStatus: string;
    netIncome: string;
    passiveIncome: string;
    relocationGoals: string;
  };
} {
  const summary = report.profileSummary;
  return {
    userName: summary.userName || "משתמש",
    profile: {
      citizenship: summary.citizenship || "",
      age: summary.age || "",
      profession: summary.profession || "",
      familyStatus: summary.familyStatus || "",
      netIncome: summary.netIncome || "",
      passiveIncome: summary.passiveIncome || "",
      relocationGoals: summary.relocationGoals || "",
    },
  };
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-12 h-12 border-4 border-[#215388] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#706F6F]">{pageContent.loading}</p>
      </motion.div>
    </div>
  );
}

function SimpleHeader() {
  return (
    <header className="bg-white border-b border-[#C6C6C6] sticky top-0 z-40">
      <div className="container h-[88px] lg:h-[88px] flex items-center justify-between">
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

function NotAuthenticatedState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <SimpleHeader />
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1D1D1B] mb-4">
              {pageContent.notAuthenticated.title}
            </h1>
            <p className="text-[#706F6F] mb-8">
              {pageContent.notAuthenticated.description}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                sessionStorage.setItem("redirectAfterLogin", "/questionnaire/results");
                router.push("/login");
              }}
            >
              {pageContent.notAuthenticated.cta}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ReportNotReadyState() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <SimpleHeader />
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
            <p className="text-[#706F6F] mb-8">{pageContent.notReady.description}</p>
            <p className="text-sm text-[#B2B2B2]">{pageContent.notReady.tip}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function NoReportState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <SimpleHeader />
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
            <p className="text-[#706F6F] mb-8">{pageContent.noReport.description}</p>
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

/**
 * Results Page - Shows personalized relocation recommendations
 * This page displays after completing the questionnaire
 */
export default function ResultsPageRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasReport, setHasReport] = useState<boolean | null>(null);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [report, setReport] = useState<UserReport | null>(null);

  // Detect viewport and set mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch report data
  useEffect(() => {
    async function loadReport() {
      if (authLoading) return;

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
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
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load report:", error);
        setLoading(false);
      }
    }

    loadReport();
  }, [isAuthenticated, authLoading]);

  // Show loading while detecting viewport or loading auth
  if (isMobile === null || authLoading || loading) {
    return <LoadingState />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return <NotAuthenticatedState />;
  }

  // No report exists
  if (hasReport === false) {
    return <NoReportState />;
  }

  // Report exists but not published yet
  if (isPublished === false) {
    return <ReportNotReadyState />;
  }

  // Report is ready - show the results
  if (report && report.destinations.length > 0) {
    const userData = transformReportToUserData(report);
    const countries = transformDestinationsToCountries(report.destinations);

    // Render appropriate component based on viewport
    return isMobile ? (
      <MobileResultsPage userData={userData} countries={countries} />
    ) : (
      <ResultsPage userData={userData} countries={countries} />
    );
  }

  // Fallback to no report state if something went wrong
  return <NoReportState />;
}
