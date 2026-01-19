"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, Card } from "@/components/shared";
import { MobileHeader } from "./MobileHeader";
import { MobileFooter } from "./MobileFooter";
import { useAuth } from "@/contexts";
import { getReportStatus, type UserReportStatus } from "@/services/userReports";

/**
 * MobilePersonalArea - Mobile personal area dashboard
 * Shows user profile and questionnaire status
 */
export const MobilePersonalArea = () => {
  const router = useRouter();
  const { user, hasCompletedOnboarding, onboardingStatus, logout } = useAuth();
  const { personalAreaDashboard } = siteContent;
  const [reportStatus, setReportStatus] = useState<UserReportStatus | null>(null);

  // Fetch report status on mount
  useEffect(() => {
    async function fetchReportStatus() {
      if (!hasCompletedOnboarding) return;
      const { data } = await getReportStatus();
      if (data) {
        setReportStatus(data);
      }
    }
    fetchReportStatus();
  }, [hasCompletedOnboarding]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleQuestionnaireAction = () => {
    if (hasCompletedOnboarding) {
      router.push("/questionnaire/results");
    } else if (onboardingStatus === "in_progress") {
      router.push("/questionnaire");
    } else {
      router.push("/questionnaire");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return personalAreaDashboard.notProvided;
    try {
      return new Date(dateString).toLocaleDateString("he-IL");
    } catch {
      return personalAreaDashboard.notProvided;
    }
  };

  const getQuestionnaireStatus = () => {
    if (hasCompletedOnboarding) {
      return {
        text: personalAreaDashboard.sections.questionnaire.completed,
        buttonText: personalAreaDashboard.sections.questionnaire.viewResultsButton,
        color: "text-[#239083]",
      };
    }
    if (onboardingStatus === "in_progress") {
      return {
        text: personalAreaDashboard.sections.questionnaire.inProgress,
        buttonText: personalAreaDashboard.sections.questionnaire.continueButton,
        color: "text-[#215388]",
      };
    }
    return {
      text: personalAreaDashboard.sections.questionnaire.notStarted,
      buttonText: personalAreaDashboard.sections.questionnaire.startButton,
      color: "text-[#706F6F]",
    };
  };

  const questionnaireStatus = getQuestionnaireStatus();
  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : personalAreaDashboard.notProvided;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F9F6F1]"
    >
      <MobileHeader />

      <main className="pt-[52px] px-4 py-6">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-[#706F6F] text-[#706F6F] hover:bg-[#706F6F] hover:text-white text-xs px-3 py-1.5"
          >
            {personalAreaDashboard.logout}
          </Button>
          <h1 className="text-xl font-medium text-[#1D1D1B]">
            {personalAreaDashboard.greeting}, {user?.firstName || ""}
          </h1>
        </div>

        <div className="space-y-4">
          {/* Profile Card */}
          <Card padding="md" className="bg-white">
            <div className="flex justify-between items-center mb-4">
              <button className="text-xs text-[#215388] hover:underline">
                {personalAreaDashboard.sections.profile.edit}
              </button>
              <h2 className="text-lg font-medium text-[#1D1D1B]">
                {personalAreaDashboard.sections.profile.title}
              </h2>
            </div>

            <div className="space-y-3 text-right">
              <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                <span className="text-sm text-[#1D1D1B]">{fullName}</span>
                <span className="text-xs text-[#706F6F]">
                  {personalAreaDashboard.fields.fullName}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                <span className="text-sm text-[#1D1D1B]" dir="ltr">{user?.email || personalAreaDashboard.notProvided}</span>
                <span className="text-xs text-[#706F6F]">
                  {personalAreaDashboard.fields.email}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                <span className="text-sm text-[#1D1D1B]" dir="ltr">{user?.phone || personalAreaDashboard.notProvided}</span>
                <span className="text-xs text-[#706F6F]">
                  {personalAreaDashboard.fields.phone}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                <span className="text-sm text-[#1D1D1B]">{formatDate(user?.birthDate)}</span>
                <span className="text-xs text-[#706F6F]">
                  {personalAreaDashboard.fields.birthDate}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[#1D1D1B]">{formatDate(user?.createdAt)}</span>
                <span className="text-xs text-[#706F6F]">
                  {personalAreaDashboard.fields.memberSince}
                </span>
              </div>
            </div>
          </Card>

          {/* Questionnaire Status Card */}
          <Card padding="md" className="bg-white">
            <h2 className="text-lg font-medium text-[#1D1D1B] text-right mb-4">
              {personalAreaDashboard.sections.questionnaire.title}
            </h2>

            <div className="text-center py-6">
              <p className={`text-base mb-4 ${questionnaireStatus.color}`}>
                {questionnaireStatus.text}
              </p>

              <Button
                variant="primary"
                size="md"
                onClick={handleQuestionnaireAction}
              >
                {questionnaireStatus.buttonText}
              </Button>
            </div>
          </Card>

          {/* Personalized Report Card (only show if questionnaire completed and has report) */}
          {hasCompletedOnboarding && reportStatus?.hasReport && (
            <Card padding="md" className="bg-white">
              <h2 className="text-lg font-medium text-[#1D1D1B] text-right mb-4">
                {personalAreaDashboard.sections.personalizedReport.title}
              </h2>

              <div className="text-center py-4">
                {reportStatus.hasPublishedReport && reportStatus.publishedDestinationCount > 0 ? (
                  <>
                    <div className="w-12 h-12 mx-auto mb-3 bg-[#239083]/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#239083]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-base font-medium text-[#239083] mb-2">
                      {personalAreaDashboard.sections.personalizedReport.ready}
                    </p>
                    <p className="text-sm text-[#706F6F] mb-2">
                      {personalAreaDashboard.sections.personalizedReport.readyDescription}
                    </p>
                    {reportStatus.publishedDestinationCount > 0 && (
                      <p className="text-xs text-[#215388] font-medium mb-4">
                        {reportStatus.publishedDestinationCount} {personalAreaDashboard.sections.personalizedReport.countriesCount}
                      </p>
                    )}
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => router.push("/personal-area/report")}
                    >
                      {personalAreaDashboard.sections.personalizedReport.viewButton}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 mx-auto mb-3 bg-[#215388]/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#215388] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-base font-medium text-[#215388] mb-2">
                      {personalAreaDashboard.sections.personalizedReport.notReady}
                    </p>
                    <p className="text-sm text-[#706F6F]">
                      {personalAreaDashboard.sections.personalizedReport.notReadyDescription}
                    </p>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>

      <MobileFooter />
    </motion.div>
  );
};

