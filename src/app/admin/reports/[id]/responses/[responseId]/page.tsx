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
  deleteCountryResponse,
  updateCountryResponse,
  type ReportCountryResponse,
  type CountryResponseContent,
  type ReportStatus,
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

function ContentSection({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;

  return (
    <div className="border-b border-[#C6C6C6] pb-4">
      <h4 className="text-sm font-medium text-[#706F6F] mb-2">{label}</h4>
      <p className="text-[#1D1D1B] whitespace-pre-wrap">{value}</p>
    </div>
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

const contentLabels: Record<keyof CountryResponseContent, string> = {
  introduction: 'הקדמה',
  visaOptions: 'אפשרויות ויזה',
  costOfLiving: 'יוקר מחייה',
  healthcare: 'מערכת בריאות',
  education: 'חינוך',
  employment: 'תעסוקה',
  safety: 'ביטחון אישי',
  community: 'קהילה ישראלית/יהודית',
  transportation: 'תחבורה',
  additionalNotes: 'הערות נוספות',
};

function ViewResponseContent({ params }: { params: Promise<{ id: string; responseId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<ReportCountryResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      if (user) {
        const name = user.user_metadata?.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }

      // Fetch report and find the specific response
      const { report, error: fetchError } = await getReportById(resolvedParams.id);
      if (fetchError) {
        setError(fetchError);
      } else if (report) {
        const foundResponse = report.countryResponses?.find(
          (r) => r.id === resolvedParams.responseId
        );
        if (foundResponse) {
          setResponse(foundResponse);
        } else {
          setError('תגובה לא נמצאה');
        }
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id, resolvedParams.responseId]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleEdit = () => {
    router.push(`/admin/reports/${resolvedParams.id}/responses/${resolvedParams.responseId}/edit`);
  };

  const handleDelete = async () => {
    const { success, error: deleteError } = await deleteCountryResponse(
      resolvedParams.id,
      resolvedParams.responseId
    );
    if (success) {
      router.push(`/admin/reports/${resolvedParams.id}/edit`);
    } else {
      setError(deleteError || 'Failed to delete response');
    }
    setShowDeleteConfirm(false);
  };

  const handlePublish = async () => {
    const { response: updatedResponse, error: updateError } = await updateCountryResponse(
      resolvedParams.id,
      resolvedParams.responseId,
      { status: 'published' }
    );
    if (updatedResponse) {
      setResponse(updatedResponse);
    } else {
      setError(updateError || 'Failed to publish response');
    }
    setShowPublishConfirm(false);
  };

  const responseContent = response?.content as CountryResponseContent | undefined;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/admin/reports/${resolvedParams.id}`}
            className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            חזרה לדוח
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              {content.reports.actions.edit}
            </Button>
            {response?.status === 'draft' && (
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
        ) : response ? (
          <div className="space-y-6">
            {/* Country Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center gap-4">
                {response.countryFlagImage && (
                  <img
                    src={response.countryFlagImage}
                    alt={response.countryName}
                    className="w-20 h-14 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-[#1D1D1B]">{response.countryName}</h1>
                    <span className="text-lg text-[#706F6F]">({response.countryCode})</span>
                    <ReportStatusBadge status={response.status} />
                  </div>
                  <p className="text-sm text-[#B2B2B2]">
                    נוצר: {new Date(response.createdAt).toLocaleDateString('he-IL')}
                    {' | '}
                    עודכן: {new Date(response.updatedAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-[#1D1D1B] mb-6">תוכן מותאם אישית</h2>
              {responseContent && Object.keys(responseContent).length > 0 ? (
                <div className="space-y-6">
                  {(Object.keys(contentLabels) as Array<keyof CountryResponseContent>).map((key) => (
                    <ContentSection
                      key={key}
                      label={contentLabels[key]}
                      value={responseContent[key]}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#706F6F] text-center py-8">אין תוכן מותאם אישית</p>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">תגובה לא נמצאה</p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="מחיקת מדינה מהדוח"
        message="האם אתה בטוח שברצונך למחוק את המדינה הזו מהדוח?"
        confirmText="מחק"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showPublishConfirm}
        title="פרסום המלצה"
        message="האם אתה בטוח שברצונך לפרסם המלצה זו?"
        confirmText="פרסם"
        confirmVariant="primary"
        onConfirm={handlePublish}
        onCancel={() => setShowPublishConfirm(false)}
      />
    </div>
  );
}

export default function ViewResponsePage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  return (
    <AdminGuard>
      <ViewResponseContent params={params} />
    </AdminGuard>
  );
}
