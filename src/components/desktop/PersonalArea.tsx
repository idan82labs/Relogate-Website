"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, Card } from "@/components/shared";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts";

/**
 * PersonalArea - Desktop personal area dashboard
 * Shows user profile and questionnaire status
 */
export const PersonalArea = () => {
  const router = useRouter();
  const { user, hasCompletedOnboarding, onboardingStatus, logout } = useAuth();
  const { personalAreaDashboard } = siteContent;

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
    <div className="min-h-screen bg-[#F9F6F1]">
      <Header />

      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-[#706F6F] text-[#706F6F] hover:bg-[#706F6F] hover:text-white"
            >
              {personalAreaDashboard.logout}
            </Button>
            <h1 className="text-3xl font-medium text-[#1D1D1B]">
              {personalAreaDashboard.greeting}, {user?.firstName || ""}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profile Card */}
            <Card padding="lg" className="bg-white">
              <div className="flex justify-between items-center mb-6">
                <button className="text-sm text-[#215388] hover:underline">
                  {personalAreaDashboard.sections.profile.edit}
                </button>
                <h2 className="text-xl font-medium text-[#1D1D1B]">
                  {personalAreaDashboard.sections.profile.title}
                </h2>
              </div>

              <div className="space-y-4 text-right">
                <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                  <span className="text-[#1D1D1B]">{fullName}</span>
                  <span className="text-[#706F6F] text-sm">
                    {personalAreaDashboard.fields.fullName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                  <span className="text-[#1D1D1B]" dir="ltr">{user?.email || personalAreaDashboard.notProvided}</span>
                  <span className="text-[#706F6F] text-sm">
                    {personalAreaDashboard.fields.email}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                  <span className="text-[#1D1D1B]" dir="ltr">{user?.phone || personalAreaDashboard.notProvided}</span>
                  <span className="text-[#706F6F] text-sm">
                    {personalAreaDashboard.fields.phone}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                  <span className="text-[#1D1D1B]">{formatDate(user?.birthDate)}</span>
                  <span className="text-[#706F6F] text-sm">
                    {personalAreaDashboard.fields.birthDate}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-[#1D1D1B]">{formatDate(user?.createdAt)}</span>
                  <span className="text-[#706F6F] text-sm">
                    {personalAreaDashboard.fields.memberSince}
                  </span>
                </div>
              </div>
            </Card>

            {/* Questionnaire Status Card */}
            <Card padding="lg" className="bg-white">
              <h2 className="text-xl font-medium text-[#1D1D1B] text-right mb-6">
                {personalAreaDashboard.sections.questionnaire.title}
              </h2>

              <div className="text-center py-8">
                <p className={`text-lg mb-6 ${questionnaireStatus.color}`}>
                  {questionnaireStatus.text}
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleQuestionnaireAction}
                >
                  {questionnaireStatus.buttonText}
                </Button>
              </div>
            </Card>

            {/* Results Card (only show if completed) */}
            {hasCompletedOnboarding && (
              <Card padding="lg" className="bg-white lg:col-span-2">
                <h2 className="text-xl font-medium text-[#1D1D1B] text-right mb-6">
                  {personalAreaDashboard.sections.results.title}
                </h2>

                <div className="text-center py-6">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => router.push("/questionnaire/results")}
                  >
                    {personalAreaDashboard.sections.results.viewReport}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PersonalArea;
