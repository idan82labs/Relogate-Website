"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, AdminGuard } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';
import {
  getReportById,
  deleteReport,
  updateReport,
  type Report,
  type ReportStatus,
  type ReportCountryResponse,
} from '@/services/reports';

const content = siteContent.admin;

function AdminHeader({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-[#C6C6C6] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-[#215388]">Relogate</h1>
          <span className="text-[#706F6F]">|</span>
          <span className="text-[#1D1D1B] font-medium">{content.dashboard.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#706F6F]">
            {content.dashboard.welcome}, <span className="font-medium text-[#1D1D1B]">{userName}</span>
          </span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            {content.dashboard.logout}
          </Button>
        </div>
      </div>
    </header>
  );
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const colors: Record<ReportStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
  };

  const labels: Record<ReportStatus, string> = {
    pending: 'ממתין',
    draft: content.reports.status.draft,
    published: content.reports.status.published,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function CountryResponseCard({
  response,
  onView,
}: {
  response: ReportCountryResponse;
  onView: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#C6C6C6] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-center gap-3 mb-3">
        {response.countryFlagImage && (
          <img
            src={response.countryFlagImage}
            alt={response.countryName}
            className="w-8 h-6 object-cover rounded"
          />
        )}
        <div>
          <h4 className="font-medium text-[#1D1D1B]">{response.countryName}</h4>
          <span className="text-xs text-[#706F6F]">{response.countryCode}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ReportStatusBadge status={response.status} />
        <span className="text-sm text-[#215388] hover:underline">צפייה &rarr;</span>
      </div>
    </motion.div>
  );
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  const buttonClass = confirmVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-[#215388] hover:bg-[#1a4270] text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-lg font-medium text-[#1D1D1B] mb-2">{title}</h3>
        <p className="text-[#706F6F] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            ביטול
          </Button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ReportDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      if (user) {
        const name = user.user_metadata?.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }

      const { report: fetchedReport, error: fetchError } = await getReportById(resolvedParams.id);
      if (fetchError) {
        setError(fetchError);
      } else if (fetchedReport) {
        setReport(fetchedReport);
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleEdit = () => {
    router.push(`/admin/reports/${resolvedParams.id}/edit`);
  };

  const handleDelete = async () => {
    const { success, error: deleteError } = await deleteReport(resolvedParams.id);
    if (success) {
      router.push('/admin/reports');
    } else {
      setError(deleteError || 'Failed to delete report');
    }
    setShowDeleteConfirm(false);
  };

  const handlePublish = async () => {
    const { report: updatedReport, error: publishError } = await updateReport(resolvedParams.id, {
      status: 'published',
    });
    if (updatedReport) {
      setReport(updatedReport);
    } else {
      setError(publishError || 'Failed to publish report');
    }
    setShowPublishConfirm(false);
  };

  const handleViewCountryResponse = (responseId: string) => {
    router.push(`/admin/reports/${resolvedParams.id}/responses/${responseId}`);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/reports"
            className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {content.reportEditor.backToList}
          </Link>
          <div className="flex gap-3">
            <Link
              href={`/admin/reports/${resolvedParams.id}/preview`}
              className="px-3 py-1.5 text-sm font-medium border border-[#C6C6C6] rounded-lg text-[#1D1D1B] hover:bg-[#F7F7F7] transition-colors"
            >
              {content.reportEditor.actions.preview}
            </Link>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              {content.reports.actions.edit}
            </Button>
            {report?.status === 'draft' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPublishConfirm(true)}
              >
                {content.reports.actions.publish}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {content.reports.actions.delete}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full"
            />
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* Report Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1D1D1B] mb-2">
                    דוח עבור {report.user?.firstName} {report.user?.lastName}
                  </h1>
                  <ReportStatusBadge status={report.status} />
                </div>
                <div className="text-left text-sm text-[#706F6F]">
                  <p>נוצר: {new Date(report.createdAt).toLocaleDateString('he-IL')}</p>
                  {report.publishedAt && (
                    <p>פורסם: {new Date(report.publishedAt).toLocaleDateString('he-IL')}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-[#1D1D1B] mb-4">
                {content.reportEditor.greeting.title}
              </h2>
              {report.greeting ? (
                <p className="text-[#1D1D1B] whitespace-pre-wrap">{report.greeting}</p>
              ) : (
                <p className="text-[#706F6F] italic">לא הוגדרה הודעת פתיחה</p>
              )}
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-[#1D1D1B] mb-4">
                {content.reportEditor.profile.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#706F6F]">
                    {content.reportEditor.profile.fields.userName}
                  </label>
                  <p className="font-medium text-[#1D1D1B]">
                    {report.profileSummary?.userName || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-[#706F6F]">
                    {content.reportEditor.profile.fields.citizenship}
                  </label>
                  <p className="font-medium text-[#1D1D1B]">
                    {report.profileSummary?.citizenship || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-[#706F6F]">
                    {content.reportEditor.profile.fields.familyStatus}
                  </label>
                  <p className="font-medium text-[#1D1D1B]">
                    {report.profileSummary?.familyStatus || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-[#706F6F]">
                    {content.reportEditor.profile.fields.relocationGoals}
                  </label>
                  <p className="font-medium text-[#1D1D1B]">
                    {report.profileSummary?.relocationGoals || '-'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Country Responses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1D1D1B]">
                  {content.reportEditor.countries.title}
                </h2>
                <Link
                  href={`/admin/reports/${resolvedParams.id}/responses/new`}
                  className="text-[#215388] hover:text-[#1a4270] font-medium text-sm"
                >
                  + {content.reportEditor.countries.addCountry}
                </Link>
              </div>
              {report.countryResponses && report.countryResponses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.countryResponses.map((response) => (
                    <CountryResponseCard
                      key={response.id}
                      response={response}
                      onView={() => handleViewCountryResponse(response.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#706F6F] text-center py-8">
                  {content.reportEditor.countries.noCountries}
                </p>
              )}
            </motion.div>

            {/* Questionnaire Data */}
            {report.questionnaire && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-semibold text-[#1D1D1B] mb-4">
                  נתוני השאלון
                </h2>
                <div className="bg-[#F7F7F7] rounded-lg p-4">
                  <pre className="text-sm text-[#1D1D1B] whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(report.questionnaire.responses, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">דוח לא נמצא</p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="מחיקת דוח"
        message={content.reports.confirmDelete}
        confirmText="מחק"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showPublishConfirm}
        title="פרסום דוח"
        message={content.reports.confirmPublish}
        confirmText="פרסם"
        confirmVariant="primary"
        onConfirm={handlePublish}
        onCancel={() => setShowPublishConfirm(false)}
      />
    </div>
  );
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminGuard>
      <ReportDetailContent params={params} />
    </AdminGuard>
  );
}
