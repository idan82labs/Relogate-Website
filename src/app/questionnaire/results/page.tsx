"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts";
import { ResultsPage } from "@/components/desktop/ResultsPage";
import { MobileResultsPage } from "@/components/mobile/MobileResultsPage";
import {
  getReportStatus,
  getUserReport,
  UserReport,
  UserReportStatus,
} from "@/services/userReports";
import { listPosts } from "@/services/blog";
import type { BlogPostListItem } from "@/types/blog";

/**
 * Transform blog posts to Article format for ResultsPage
 */
function transformBlogPostsToArticles(posts: BlogPostListItem[]) {
  return posts.map((post) => ({
    title: post.title,
    date: new Date(post.publishedAt).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    image: post.featuredImageUrl || "/articles/article-1.jpg",
    url: `/blog/${post.slug}`,
  }));
}

/**
 * Transform API report data to component props format
 */
function transformReportToComponentProps(report: UserReport) {
  const userData = {
    userName: report.profileSummary.userName || "",
    profile: {
      citizenship: report.profileSummary.citizenship || "",
      age: report.profileSummary.age || "",
      profession: report.profileSummary.profession || "",
      familyStatus: report.profileSummary.familyStatus || "",
      netIncome: report.profileSummary.netIncome || "",
      passiveIncome: report.profileSummary.passiveIncome || "",
      relocationGoals: report.profileSummary.relocationGoals || "",
    },
  };

  const countries = report.destinations.map((dest) => ({
    id: dest.id,
    name: dest.destination.name,
    englishName: dest.destination.subtitle || "",
    matchScore: dest.match.score,
    visaType: dest.match.visaType || "",
    image: dest.destination.image || "/countries/default.jpg",
    matchReasons: dest.match.reasons,
    description: dest.narrative.introduction || "",
    visaInfo: dest.narrative.pathway || "",
    sections: dest.sections.map((section) => ({
      key: section.key,
      title: section.title,
      icon: section.icon,
      content: section.content,
      position: section.position,
    })),
  }));

  return { userData, countries };
}

/**
 * Waiting for Report Component
 */
function WaitingForReport() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Animated spinner */}
        <div className="w-16 h-16 border-4 border-[#215388] border-t-transparent rounded-full animate-spin mx-auto mb-6" />

        <h1 className="text-[32px] font-medium text-[#215388] mb-4">
          הדוח שלך בהכנה
        </h1>

        <p className="text-[18px] text-[#706F6F] mb-6 leading-relaxed">
          צוות Relogate עובד על הכנת הדוח האישי שלך. נעדכן אותך ברגע שהדוח יהיה מוכן.
        </p>

        <div className="bg-[#F7F7F7] rounded-[20px] p-6">
          <p className="text-[16px] text-[#1D1D1B]">
            בינתיים, תוכל לחזור לאזור האישי שלך
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * No Report Component - questionnaire not completed
 */
function NoReport() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <h1 className="text-[32px] font-medium text-[#215388] mb-4">
          טרם מילאת את השאלון
        </h1>

        <p className="text-[18px] text-[#706F6F] mb-6 leading-relaxed">
          על מנת לקבל את הדוח האישי שלך, עליך למלא את השאלון תחילה.
        </p>

        <motion.button
          onClick={() => router.push("/questionnaire/v2")}
          className="bg-[#215388] text-white px-8 py-3 rounded-full text-[18px] font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          מלא שאלון
        </motion.button>
      </motion.div>
    </div>
  );
}

/**
 * Results Page Route - Shows personalized relocation recommendations
 * Handles different states: loading, waiting for report, no report, and full results
 */
export default function ResultsPageRoute() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [reportStatus, setReportStatus] = useState<UserReportStatus | null>(null);
  const [report, setReport] = useState<UserReport | null>(null);
  const [articles, setArticles] = useState<BlogPostListItem[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch report status and data
  useEffect(() => {
    async function fetchReportData() {
      if (authLoading || !user) return;

      setIsLoadingReport(true);
      setError(null);

      try {
        // First check report status
        const statusResult = await getReportStatus();

        if (statusResult.error) {
          setError(statusResult.error);
          setIsLoadingReport(false);
          return;
        }

        setReportStatus(statusResult.data);

        // If report is published, fetch the full report
        if (statusResult.data?.hasPublishedReport) {
          const reportResult = await getUserReport();

          if (reportResult.error) {
            setError(reportResult.error);
          } else if (reportResult.report) {
            setReport(reportResult.report);
          }
        }
      } catch {
        setError("Failed to load report");
      } finally {
        setIsLoadingReport(false);
      }
    }

    fetchReportData();
  }, [authLoading, user]);

  // Fetch blog articles for related articles section
  useEffect(() => {
    async function fetchArticles() {
      try {
        const result = await listPosts({ contentType: "blog", limit: 6 });
        if (result.data?.posts) {
          setArticles(result.data.posts);
        }
      } catch {
        // Silently fail - articles are not critical
      }
    }

    fetchArticles();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/questionnaire/results");
    }
  }, [authLoading, user, router]);

  // Loading state while detecting viewport or auth
  if (isMobile === null || authLoading || isLoadingReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-[#215388] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-[18px] text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#215388] underline"
          >
            נסה שוב
          </button>
        </motion.div>
      </div>
    );
  }

  // Questionnaire not completed - prompt user to fill it
  if (!reportStatus?.hasCompletedQuestionnaire) {
    return <NoReport />;
  }

  // Questionnaire completed but no report yet, or report not published
  // Show "waiting for report" message
  if (!reportStatus?.hasReport || !reportStatus?.hasPublishedReport || !report) {
    return <WaitingForReport />;
  }

  // Report is ready - show results
  const { userData, countries } = transformReportToComponentProps(report);
  const transformedArticles = articles.length > 0
    ? transformBlogPostsToArticles(articles).slice(0, 3)
    : undefined;

  return isMobile ? (
    <MobileResultsPage userData={userData} countries={countries} articles={transformedArticles} />
  ) : (
    <ResultsPage userData={userData} countries={countries} articles={transformedArticles} />
  );
}
