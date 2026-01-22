"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, Card, PaymentStatusCard, JourneyProgress, QuickActions } from "@/components/shared";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts";
import { getReportStatus, type UserReportStatus } from "@/services/userReports";
import { checkPaymentStatus, getUserPayments, type Payment } from "@/services";

type JourneyStepStatus = 'completed' | 'inProgress' | 'pending' | 'locked';

interface JourneyStep {
  key: 'questionnaire' | 'payment' | 'report' | 'planning';
  status: JourneyStepStatus;
}

/**
 * PersonalArea - Desktop personal area dashboard
 * Reorganized with journey progress, payment status, and quick actions
 */
export const PersonalArea = () => {
  const router = useRouter();
  const { user, hasCompletedOnboarding, onboardingStatus, logout } = useAuth();
  const { personalAreaDashboard } = siteContent;
  const [reportStatus, setReportStatus] = useState<UserReportStatus | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(true);

  // Fetch payment status
  const fetchPaymentStatus = useCallback(async () => {
    setIsLoadingPayment(true);
    try {
      // Check payment status for the relomatch_report product
      const result = await checkPaymentStatus('relomatch_report');
      const paid = result.success && result.data?.hasPaid === true;
      setHasPaid(paid);

      if (paid) {
        const { data } = await getUserPayments();
        if (data && data.payments.length > 0) {
          // Get the most recent completed payment
          const completedPayment = data.payments.find(p => p.status === 'completed');
          if (completedPayment) {
            setLatestPayment(completedPayment);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  }, []);

  // Fetch report status
  const fetchReportStatus = useCallback(async () => {
    if (!hasCompletedOnboarding) {
      setIsLoadingReport(false);
      return;
    }
    setIsLoadingReport(true);
    try {
      const { data } = await getReportStatus();
      if (data) {
        setReportStatus(data);
      }
    } catch (error) {
      console.error('Error fetching report status:', error);
    } finally {
      setIsLoadingReport(false);
    }
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    fetchPaymentStatus();
    fetchReportStatus();
  }, [fetchPaymentStatus, fetchReportStatus]);

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

  // Calculate journey steps
  const getJourneySteps = (): JourneyStep[] => {
    const questionnaireStatus: JourneyStepStatus = hasCompletedOnboarding
      ? 'completed'
      : onboardingStatus === 'in_progress'
        ? 'inProgress'
        : 'pending';

    const paymentStatus: JourneyStepStatus = hasPaid
      ? 'completed'
      : hasCompletedOnboarding
        ? 'pending'
        : 'locked';

    const reportStatusStep: JourneyStepStatus = reportStatus?.hasPublishedReport
      ? 'completed'
      : hasPaid && hasCompletedOnboarding
        ? 'inProgress'
        : 'locked';

    const planningStatus: JourneyStepStatus = reportStatus?.hasPublishedReport
      ? 'pending'
      : 'locked';

    return [
      { key: 'questionnaire', status: questionnaireStatus },
      { key: 'payment', status: paymentStatus },
      { key: 'report', status: reportStatusStep },
      { key: 'planning', status: planningStatus },
    ];
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

  const journeySteps = getJourneySteps();

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Header />

      <main className="container py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Header */}
          <div className="flex justify-between items-start mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-[#706F6F] text-[#706F6F] hover:bg-[#706F6F] hover:text-white"
            >
              {personalAreaDashboard.logout}
            </Button>
            <div className="text-right">
              <h1 className="text-2xl lg:text-3xl font-medium text-[#1D1D1B]">
                {personalAreaDashboard.greeting}, {user?.firstName || ""}
              </h1>
              <p className="text-[#706F6F] text-sm mt-1">
                {personalAreaDashboard.welcomeSubtitle}
              </p>
            </div>
          </div>

          {/* Journey Progress - Full Width */}
          <JourneyProgress
            steps={journeySteps}
            className="mb-8"
          />

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions
              variant="horizontal"
              actions={[
                { key: 'viewQuestionnaire', href: '/questionnaire/results', disabled: !hasCompletedOnboarding },
                { key: 'contactSupport', href: '/#contact' },
                { key: 'viewBlog', href: '/blog' },
              ]}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Payment Status Card - Show if not paid */}
            {!hasPaid && hasCompletedOnboarding && (
              <PaymentStatusCard
                hasPaid={false}
                isLoading={isLoadingPayment}
                className="lg:col-span-2"
              />
            )}

            {/* Questionnaire Status Card */}
            <Card padding="lg" className="bg-white">
              <h2 className="text-xl font-medium text-[#1D1D1B] text-right mb-4">
                {personalAreaDashboard.sections.questionnaire.title}
              </h2>

              <div className="text-right">
                <p className={`text-base mb-2 ${questionnaireStatus.color}`}>
                  {questionnaireStatus.text}
                </p>
                <p className="text-sm text-[#706F6F] mb-6">
                  {personalAreaDashboard.sections.questionnaire.description}
                </p>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleQuestionnaireAction}
                  className="w-full sm:w-auto"
                >
                  {questionnaireStatus.buttonText}
                </Button>
              </div>
            </Card>

            {/* Personalized Report Card */}
            <Card padding="lg" className="bg-white">
              <h2 className="text-xl font-medium text-[#1D1D1B] text-right mb-4">
                {personalAreaDashboard.sections.personalizedReport.title}
              </h2>

              <div className="text-right">
                {isLoadingReport ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 mr-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mr-auto" />
                  </div>
                ) : !hasCompletedOnboarding ? (
                  <>
                    <p className="text-[#706F6F] text-sm mb-2">
                      {personalAreaDashboard.sections.questionnaire.notStarted}
                    </p>
                    <p className="text-xs text-[#B2B2B2]">
                      מלא את השאלון תחילה כדי להתחיל בתהליך
                    </p>
                  </>
                ) : !hasPaid ? (
                  <>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <p className="text-[#215388] font-medium">
                        {personalAreaDashboard.sections.personalizedReport.awaitingPayment}
                      </p>
                      <div className="w-8 h-8 bg-[#215388]/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#215388]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-[#706F6F] mb-4">
                      {personalAreaDashboard.sections.personalizedReport.awaitingPaymentDescription}
                    </p>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => router.push('/checkout')}
                      className="w-full sm:w-auto"
                    >
                      {personalAreaDashboard.payment.notPaid.cta}
                    </Button>
                  </>
                ) : reportStatus?.hasPublishedReport ? (
                  <>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <p className="text-lg font-medium text-[#239083]">
                        {personalAreaDashboard.sections.personalizedReport.ready}
                      </p>
                      <div className="w-8 h-8 bg-[#239083]/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#239083]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[#706F6F] text-sm mb-2">
                      {personalAreaDashboard.sections.personalizedReport.readyDescription}
                    </p>
                    {reportStatus.publishedDestinationCount > 0 && (
                      <p className="text-sm text-[#215388] font-medium mb-4">
                        {reportStatus.publishedDestinationCount} {personalAreaDashboard.sections.personalizedReport.countriesCount}
                      </p>
                    )}
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => router.push("/questionnaire/results")}
                      className="w-full sm:w-auto"
                    >
                      {personalAreaDashboard.sections.personalizedReport.viewButton}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <p className="text-lg font-medium text-[#215388]">
                        {personalAreaDashboard.sections.personalizedReport.notReady}
                      </p>
                      <div className="w-8 h-8 bg-[#215388]/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#215388] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[#706F6F] text-sm">
                      {personalAreaDashboard.sections.personalizedReport.notReadyDescription}
                    </p>
                  </>
                )}
              </div>
            </Card>

            {/* Profile Card */}
            <Card padding="lg" className="bg-white lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <button className="text-sm text-[#215388] hover:underline">
                  {personalAreaDashboard.sections.profile.edit}
                </button>
                <h2 className="text-xl font-medium text-[#1D1D1B]">
                  {personalAreaDashboard.sections.profile.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-right">
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

                <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                  <span className="text-[#1D1D1B]">{formatDate(user?.createdAt)}</span>
                  <span className="text-[#706F6F] text-sm">
                    {personalAreaDashboard.fields.memberSince}
                  </span>
                </div>

                {/* Payment Status in Profile */}
                {hasPaid && latestPayment && (
                  <div className="flex justify-between items-center py-2 border-b border-[#F7F7F7]">
                    <span className="text-[#239083] font-medium">
                      {personalAreaDashboard.payment.completed.title}
                    </span>
                    <span className="text-[#706F6F] text-sm">
                      {personalAreaDashboard.payment.title}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
