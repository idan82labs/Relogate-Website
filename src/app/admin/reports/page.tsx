"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, AdminLayout } from '@/components/shared';
import { siteContent } from '@/content/he';
import {
  listReports,
  getPendingQuestionnaires,
  createReport,
  deleteReport,
  publishReport,
  type ReportListItem,
  type ListReportsParams,
  type ReportStatus,
  type PendingQuestionnaire,
} from '@/services/reports';

const content = siteContent.admin;

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

function PendingQuestionnairesCard({
  questionnaires,
  onCreateReport,
}: {
  questionnaires: PendingQuestionnaire[];
  onCreateReport: (q: PendingQuestionnaire) => void;
}) {
  if (questionnaires.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-[#1D1D1B] mb-4">{content.reports.pendingTitle}</h3>
        <p className="text-[#706F6F]">{content.reports.noPending}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#1D1D1B] mb-4">
        {content.reports.pendingTitle}
        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          {questionnaires.length}
        </span>
      </h3>
      <div className="space-y-3">
        {questionnaires.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-[#F9F6F1] rounded-lg"
          >
            <div>
              <p className="font-medium text-[#1D1D1B]">
                {q.user.firstName} {q.user.lastName}
              </p>
              <p className="text-sm text-[#706F6F]">
                הושלם: {q.submittedAt ? new Date(q.submittedAt).toLocaleDateString('he-IL') : '-'}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCreateReport(q)}
            >
              {content.reports.actions.createReport}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportsTable({
  reports,
  onView,
  onEdit,
  onPublish,
  onDelete,
}: {
  reports: ReportListItem[];
  onView: (report: ReportListItem) => void;
  onEdit: (report: ReportListItem) => void;
  onPublish: (report: ReportListItem) => void;
  onDelete: (report: ReportListItem) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-[#C6C6C6]">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.reports.table.user}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.reports.table.status}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.reports.table.countries}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.reports.table.createdAt}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.reports.table.publishedAt}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.reports.table.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#C6C6C6]">
          {reports.map((report, index) => (
            <motion.tr
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-[#F9F6F1]"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[#1D1D1B]">
                  {report.user?.firstName} {report.user?.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ReportStatusBadge status={report.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {report.destinationCount || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {new Date(report.createdAt).toLocaleDateString('he-IL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {report.publishedAt ? new Date(report.publishedAt).toLocaleDateString('he-IL') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onView(report)}
                    className="text-[#215388] hover:text-[#215388]/80"
                  >
                    {content.reports.actions.view}
                  </button>
                  <button
                    onClick={() => onEdit(report)}
                    className="text-[#239083] hover:text-[#239083]/80"
                  >
                    {content.reports.actions.edit}
                  </button>
                  {report.status === 'draft' && (
                    <button
                      onClick={() => onPublish(report)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      {content.reports.actions.publish}
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(report)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {content.reports.actions.delete}
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        {content.reports.pagination.prev}
      </Button>
      <span className="text-sm text-[#706F6F]">
        {page} {content.reports.pagination.of} {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {content.reports.pagination.next}
      </Button>
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

type TabFilter = 'all' | 'draft' | 'published';

function ReportsContent() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [pendingQuestionnaires, setPendingQuestionnaires] = useState<PendingQuestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [deleteTarget, setDeleteTarget] = useState<ReportListItem | null>(null);
  const [publishTarget, setPublishTarget] = useState<ReportListItem | null>(null);
  const [error, setError] = useState('');

  const loadReports = useCallback(async (params: ListReportsParams = {}) => {
    setLoading(true);
    const { data, error: fetchError } = await listReports({
      ...params,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    if (data) {
      setReports(data.reports);
      setTotalPages(data.pagination.totalPages);
    } else if (fetchError) {
      setError(fetchError);
    }
    setLoading(false);
  }, []);

  const loadPendingQuestionnaires = useCallback(async () => {
    const { data, error: fetchError } = await getPendingQuestionnaires();
    if (data) {
      // Filter out questionnaires that already have reports
      const pending = data.questionnaires.filter(q => !q.reportExists);
      setPendingQuestionnaires(pending);
    } else if (fetchError) {
      console.error('Failed to fetch pending questionnaires:', fetchError);
    }
  }, []);

  useEffect(() => {
    async function init() {
      await Promise.all([
        loadReports({ page: 1, limit: 20 }),
        loadPendingQuestionnaires(),
      ]);
    }
    init();
  }, [loadReports, loadPendingQuestionnaires]);

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setPage(1);
    const status = tab === 'all' ? undefined : tab;
    loadReports({ page: 1, limit: 20, status: status as ReportStatus | undefined });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const status = activeTab === 'all' ? undefined : activeTab;
    loadReports({ page: newPage, limit: 20, status: status as ReportStatus | undefined });
  };

  const handleView = (report: ReportListItem) => {
    router.push(`/admin/reports/${report.id}`);
  };

  const handleEdit = (report: ReportListItem) => {
    router.push(`/admin/reports/${report.id}/edit`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { success, error: deleteError } = await deleteReport(deleteTarget.id);
    if (success) {
      setDeleteTarget(null);
      loadReports({ page, limit: 20, status: activeTab === 'all' ? undefined : activeTab as ReportStatus });
    } else {
      setError(deleteError || 'Failed to delete report');
    }
  };

  const handlePublish = async () => {
    if (!publishTarget) return;
    const { report, error: publishError } = await publishReport(publishTarget.id, true);
    if (report) {
      setPublishTarget(null);
      loadReports({ page, limit: 20, status: activeTab === 'all' ? undefined : activeTab as ReportStatus });
    } else {
      setError(publishError || 'Failed to publish report');
    }
  };

  const handleCreateReport = async (questionnaire: PendingQuestionnaire) => {
    const { report, error: createError } = await createReport({
      questionnaireId: questionnaire.id,
    });
    if (report) {
      router.push(`/admin/reports/${report.id}/edit`);
    } else {
      setError(createError || 'Failed to create report');
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-[#1D1D1B] mb-6">{content.reports.title}</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button onClick={() => setError('')} className="float-left text-red-800 hover:text-red-900">
              ✕
            </button>
          </div>
        )}

        {/* Pending Questionnaires */}
        <PendingQuestionnairesCard
          questionnaires={pendingQuestionnaires}
          onCreateReport={handleCreateReport}
        />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-[#C6C6C6] px-6">
            <div className="flex gap-8">
              <button
                onClick={() => handleTabChange('all')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'all'
                    ? 'border-[#215388] text-[#215388] font-medium'
                    : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
                }`}
              >
                {content.reports.tabs.all}
              </button>
              <button
                onClick={() => handleTabChange('draft')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'draft'
                    ? 'border-[#215388] text-[#215388] font-medium'
                    : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
                }`}
              >
                {content.reports.tabs.pending}
              </button>
              <button
                onClick={() => handleTabChange('published')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'published'
                    ? 'border-[#215388] text-[#215388] font-medium'
                    : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
                }`}
              >
                {content.reports.tabs.published}
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full"
            />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">{content.reports.empty}</p>
          </div>
        ) : (
          <>
            <ReportsTable
              reports={reports}
              onView={handleView}
              onEdit={handleEdit}
              onPublish={(report) => setPublishTarget(report)}
              onDelete={(report) => setDeleteTarget(report)}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            isOpen={true}
            title="מחיקת דוח"
            message={content.reports.confirmDelete}
            confirmText="מחק"
            confirmVariant="danger"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
        {publishTarget && (
          <ConfirmDialog
            isOpen={true}
            title="פרסום דוח"
            message={content.reports.confirmPublish}
            confirmText="פרסם"
            confirmVariant="primary"
            onConfirm={handlePublish}
            onCancel={() => setPublishTarget(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function ReportsPage() {
  return (
    <AdminLayout>
      <ReportsContent />
    </AdminLayout>
  );
}
