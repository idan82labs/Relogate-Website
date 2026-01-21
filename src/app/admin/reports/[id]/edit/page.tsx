"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, AdminLayout, QuestionnaireAnswersDisplay } from '@/components/shared';
import { siteContent } from '@/content/he';
import {
  getReportById,
  updateReport,
  publishReport,
  deleteDestinationResponse,
  getQuestionnaireResponses,
  type Report,
  type ReportProfileSummary,
  type ReportStatus,
  type DestinationResponseListItem,
  type QuestionnaireResponsesData,
} from '@/services/reports';

const content = siteContent.admin;

type TabId = 'questionnaire' | 'greeting' | 'profile' | 'countries';

function TabButton({
  id,
  label,
  activeTab,
  onClick,
}: {
  id: TabId;
  label: string;
  activeTab: TabId;
  onClick: (id: TabId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`py-3 px-6 border-b-2 font-medium transition-colors ${
        activeTab === id
          ? 'border-[#215388] text-[#215388]'
          : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
      }`}
    >
      {label}
    </button>
  );
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const colors: Record<ReportStatus, string> = {
    draft: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
  };

  const labels: Record<ReportStatus, string> = {
    draft: content.reports.status.draft,
    published: content.reports.status.published,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function DestinationResponseCard({
  response,
  onEdit,
  onDelete,
}: {
  response: DestinationResponseListItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#C6C6C6] rounded-lg p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        {response.destination.image && (
          /* eslint-disable-next-line @next/next/no-img-element -- Dynamic image from API */
          <img
            src={response.destination.image}
            alt={response.destination.name}
            className="w-8 h-6 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium text-[#1D1D1B]">{response.destination.name}</h4>
          {response.destination.subtitle && (
            <span className="text-xs text-[#706F6F]">{response.destination.subtitle}</span>
          )}
        </div>
        <ReportStatusBadge status={response.status} />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onEdit}
          className="text-sm text-[#215388] hover:text-[#1a4270] font-medium"
        >
          {content.reports.actions.edit}
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          {content.reports.actions.delete}
        </button>
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

interface FormData {
  greeting: string;
  profileSummary: Partial<ReportProfileSummary>;
}

function ReportEditContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponsesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('questionnaire');
  const [deleteResponseTarget, setDeleteResponseTarget] = useState<DestinationResponseListItem | null>(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    greeting: '',
    profileSummary: {},
  });

  useEffect(() => {
    async function init() {
      const { report: fetchedReport, error: fetchError } = await getReportById(resolvedParams.id);
      if (fetchError) {
        setError(fetchError);
      } else if (fetchedReport) {
        setReport(fetchedReport);
        setFormData({
          greeting: fetchedReport.greeting || '',
          profileSummary: fetchedReport.profileSummary || {},
        });

        // Fetch questionnaire responses for admin reference
        if (fetchedReport.questionnaireId) {
          const { questionnaire: fetchedQuestionnaire } = await getQuestionnaireResponses(
            fetchedReport.questionnaireId
          );
          if (fetchedQuestionnaire) {
            setQuestionnaire(fetchedQuestionnaire);
          }
        }
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id]);

  const handleGreetingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, greeting: value }));
  };

  const handleProfileChange = (field: keyof ReportProfileSummary, value: string) => {
    setFormData((prev) => ({
      ...prev,
      profileSummary: { ...prev.profileSummary, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const { report: updatedReport, error: updateError } = await updateReport(resolvedParams.id, {
      greeting: formData.greeting || undefined,
      profileSummary: formData.profileSummary,
    });

    if (updateError) {
      setError(updateError);
    } else if (updatedReport) {
      setReport(updatedReport);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setSaving(true);
    setError('');

    // First save any pending changes
    await updateReport(resolvedParams.id, {
      greeting: formData.greeting || undefined,
      profileSummary: formData.profileSummary,
    });

    // Then publish the report
    const { report: updatedReport, error: publishError } = await publishReport(resolvedParams.id, true);

    if (publishError) {
      setError(publishError);
    } else if (updatedReport) {
      setReport(updatedReport);
      router.push(`/admin/reports/${resolvedParams.id}`);
    }
    setSaving(false);
    setShowPublishConfirm(false);
  };

  const handleDeleteResponse = async () => {
    if (!deleteResponseTarget) return;

    const { success, error: deleteError } = await deleteDestinationResponse(
      deleteResponseTarget.id
    );

    if (success) {
      // Refresh report data
      const { report: refreshedReport } = await getReportById(resolvedParams.id);
      if (refreshedReport) {
        setReport(refreshedReport);
      }
    } else {
      setError(deleteError || 'Failed to delete country response');
    }
    setDeleteResponseTarget(null);
  };

  const handleEditResponse = (responseId: string) => {
    router.push(`/admin/reports/${resolvedParams.id}/responses/${responseId}/edit`);
  };

  return (
    <>
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
          <h1 className="text-2xl font-bold text-[#1D1D1B]">{content.reportEditor.title}</h1>
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
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-[#C6C6C6] flex overflow-x-auto">
              <TabButton
                id="questionnaire"
                label="תשובות השאלון"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="greeting"
                label={content.reportEditor.tabs.greeting}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="profile"
                label={content.reportEditor.tabs.profile}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="countries"
                label={content.reportEditor.tabs.countries}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            </div>

            <div className="p-6">
              {/* Questionnaire Tab */}
              {activeTab === 'questionnaire' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {questionnaire ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#1D1D1B]">
                            תשובות השאלון
                          </h3>
                          <p className="text-sm text-[#706F6F]">
                            הושלם: {questionnaire.completedAt ? new Date(questionnaire.completedAt).toLocaleDateString('he-IL') : '-'}
                          </p>
                        </div>
                        {questionnaire.userName && (
                          <div className="text-left">
                            <p className="text-sm text-[#706F6F]">משתמש:</p>
                            <p className="font-medium text-[#1D1D1B]">{questionnaire.userName}</p>
                          </div>
                        )}
                      </div>
                      <QuestionnaireAnswersDisplay
                        responses={questionnaire.responses}
                        defaultExpanded={true}
                      />
                    </>
                  ) : (
                    <div className="text-center py-12 text-[#706F6F]">
                      לא נמצאו נתוני שאלון
                    </div>
                  )}
                </motion.div>
              )}

              {/* Greeting Tab */}
              {activeTab === 'greeting' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                      {content.reportEditor.greeting.title}
                    </label>
                    <textarea
                      value={formData.greeting}
                      onChange={(e) => handleGreetingChange(e.target.value)}
                      placeholder={content.reportEditor.greeting.placeholder}
                      rows={8}
                      className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] resize-y"
                    />
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.reportEditor.profile.fields.userName}
                      </label>
                      <input
                        type="text"
                        value={formData.profileSummary.userName || ''}
                        onChange={(e) => handleProfileChange('userName', e.target.value)}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.reportEditor.profile.fields.citizenship}
                      </label>
                      <input
                        type="text"
                        value={formData.profileSummary.citizenship || ''}
                        onChange={(e) => handleProfileChange('citizenship', e.target.value)}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.reportEditor.profile.fields.familyStatus}
                      </label>
                      <input
                        type="text"
                        value={formData.profileSummary.familyStatus || ''}
                        onChange={(e) => handleProfileChange('familyStatus', e.target.value)}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.reportEditor.profile.fields.relocationGoals}
                      </label>
                      <input
                        type="text"
                        value={formData.profileSummary.relocationGoals || ''}
                        onChange={(e) => handleProfileChange('relocationGoals', e.target.value)}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Countries Tab */}
              {activeTab === 'countries' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#1D1D1B]">
                      {content.reportEditor.countries.title}
                    </h3>
                    <Link
                      href={`/admin/reports/${resolvedParams.id}/responses/new`}
                      className="text-[#215388] hover:text-[#1a4270] font-medium text-sm"
                    >
                      + {content.reportEditor.countries.addCountry}
                    </Link>
                  </div>

                  {report.destinations && report.destinations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.destinations.map((response) => (
                        <DestinationResponseCard
                          key={response.id}
                          response={response}
                          onEdit={() => handleEditResponse(response.id)}
                          onDelete={() => setDeleteResponseTarget(response)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#706F6F] mb-4">
                        {content.reportEditor.countries.noCountries}
                      </p>
                      <Link
                        href={`/admin/reports/${resolvedParams.id}/responses/new`}
                        className="inline-flex items-center px-4 py-2 bg-[#215388] text-white rounded-lg hover:bg-[#1a4270] transition-colors"
                      >
                        + {content.reportEditor.countries.addCountry}
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-[#C6C6C6] px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.push(`/admin/reports/${resolvedParams.id}`)}>
                ביטול
              </Button>
              <Button variant="outline" onClick={handleSave} disabled={saving}>
                {saving ? 'שומר...' : content.reportEditor.actions.save}
              </Button>
              {report.status === 'draft' && (
                <Button
                  variant="primary"
                  onClick={() => setShowPublishConfirm(true)}
                  disabled={saving}
                >
                  {content.reportEditor.actions.publish}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">דוח לא נמצא</p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={!!deleteResponseTarget}
        title="מחיקת מדינה מהדוח"
        message="האם אתה בטוח שברצונך למחוק את המדינה הזו מהדוח?"
        confirmText="מחק"
        confirmVariant="danger"
        onConfirm={handleDeleteResponse}
        onCancel={() => setDeleteResponseTarget(null)}
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
    </>
  );
}

export default function ReportEditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminLayout>
      <ReportEditContent params={params} />
    </AdminLayout>
  );
}
