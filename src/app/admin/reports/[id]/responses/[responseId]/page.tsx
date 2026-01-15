"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, AdminLayout } from "@/components/shared";
import { siteContent } from "@/content/he";
import { renderMarkdown } from "@/lib/markdown";
import {
  getReportById,
  deleteDestinationResponse,
  publishDestinationResponse,
  type DestinationResponseListItem,
  type ReportStatus,
} from "@/services/reports";

const content = siteContent.admin;

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const colors: Record<ReportStatus, string> = {
    draft: "bg-blue-100 text-blue-800",
    published: "bg-green-100 text-green-800",
  };

  const labels: Record<ReportStatus, string> = {
    draft: content.reports.status.draft,
    published: content.reports.status.published,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  const buttonClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-[#215388] hover:bg-[#1a4270] text-white";

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

function NarrativeSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="border-b border-[#C6C6C6] pb-4">
      <h4 className="text-sm font-medium text-[#706F6F] mb-2">{title}</h4>
      <div className="text-[#1D1D1B]">{renderMarkdown(content)}</div>
    </div>
  );
}

function ViewResponseContent({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<DestinationResponseListItem | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  useEffect(() => {
    async function init() {
      const { report, error: fetchError } = await getReportById(
        resolvedParams.id
      );
      if (fetchError) {
        setError(fetchError);
      } else if (report) {
        const foundResponse = report.destinations?.find(
          (r) => r.id === resolvedParams.responseId
        );
        if (foundResponse) {
          setResponse(foundResponse);
        } else {
          setError("יעד לא נמצא");
        }
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id, resolvedParams.responseId]);

  const handleEdit = () => {
    router.push(
      `/admin/reports/${resolvedParams.id}/responses/${resolvedParams.responseId}/edit`
    );
  };

  const handleDelete = async () => {
    const { success, error: deleteError } = await deleteDestinationResponse(
      resolvedParams.responseId
    );
    if (success) {
      router.push(`/admin/reports/${resolvedParams.id}/edit`);
    } else {
      setError(deleteError || "Failed to delete response");
    }
    setShowDeleteConfirm(false);
  };

  const handlePublish = async () => {
    const { response: updatedResponse, error: updateError } =
      await publishDestinationResponse(resolvedParams.responseId, true);
    if (updatedResponse) {
      setResponse(updatedResponse);
    } else {
      setError(updateError || "Failed to publish response");
    }
    setShowPublishConfirm(false);
  };

  const handleUnpublish = async () => {
    const { response: updatedResponse, error: updateError } =
      await publishDestinationResponse(resolvedParams.responseId, false);
    if (updatedResponse) {
      setResponse(updatedResponse);
    } else {
      setError(updateError || "Failed to unpublish response");
    }
  };

  const hasNarrativeContent =
    response?.narrative?.introduction ||
    response?.narrative?.pathway ||
    response?.narrative?.fit ||
    response?.narrative?.benefits ||
    (response?.narrative?.highlights &&
      response.narrative.highlights.length > 0);

  const sortedSections = response?.sections
    ? [...response.sections].sort((a, b) => a.position - b.position)
    : [];

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/admin/reports/${resolvedParams.id}`}
            className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            חזרה לדוח
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              {content.reports.actions.edit}
            </Button>
            {response?.status === "draft" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPublishConfirm(true)}
              >
                {content.reports.actions.publish}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleUnpublish}>
                בטל פרסום
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
            {/* Destination Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center gap-4">
                {response.destination.image && (
                  <img
                    src={response.destination.image}
                    alt={response.destination.name}
                    className="w-20 h-14 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-[#1D1D1B]">
                      {response.destination.name}
                    </h1>
                    {response.destination.subtitle && (
                      <span className="text-lg text-[#706F6F]">
                        ({response.destination.subtitle})
                      </span>
                    )}
                    <ReportStatusBadge status={response.status} />
                  </div>
                  {response.destination.badge && (
                    <span className="inline-flex items-center gap-1.5 bg-[#F9F6F1] rounded-full px-3 py-1 text-xs text-[#1D1D1B]">
                      <span>✨</span>
                      <span>{response.destination.badge}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Match Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-lg font-semibold text-[#1D1D1B] mb-4">
                נתוני התאמה
              </h2>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-[#706F6F] mb-1">ציון התאמה</p>
                  <p className="text-2xl font-bold text-[#239083]">
                    {response.match.score}%
                  </p>
                </div>
                {response.match.visaType && (
                  <div>
                    <p className="text-sm text-[#706F6F] mb-1">סוג ויזה</p>
                    <p className="font-medium text-[#1D1D1B]">
                      {response.match.visaType}
                    </p>
                  </div>
                )}
              </div>
              {response.match.reasons.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-[#706F6F] mb-2">סיבות להתאמה</p>
                  <div className="flex flex-wrap gap-2">
                    {response.match.reasons.map((reason, index) => (
                      <span
                        key={index}
                        className="bg-[#215388]/10 text-[#215388] rounded-full px-3 py-1 text-sm"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Narrative Content */}
            {hasNarrativeContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-semibold text-[#1D1D1B] mb-6">
                  תוכן נרטיבי
                </h2>
                <div className="space-y-6">
                  {response.narrative?.introduction && (
                    <NarrativeSection
                      title="הקדמה"
                      content={response.narrative.introduction}
                    />
                  )}
                  {response.narrative?.pathway && (
                    <NarrativeSection
                      title="המסלול"
                      content={response.narrative.pathway}
                    />
                  )}
                  {response.narrative?.fit && (
                    <NarrativeSection
                      title="איך אתם מתאימים"
                      content={response.narrative.fit}
                    />
                  )}
                  {response.narrative?.benefits && (
                    <NarrativeSection
                      title="יתרונות"
                      content={response.narrative.benefits}
                    />
                  )}
                  {response.narrative?.highlights &&
                    response.narrative.highlights.length > 0 && (
                      <div className="border-b border-[#C6C6C6] pb-4 last:border-0">
                        <h4 className="text-sm font-medium text-[#706F6F] mb-2">
                          נקודות מרכזיות
                        </h4>
                        <ul className="space-y-1">
                          {response.narrative.highlights.map(
                            (highlight, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-[#1D1D1B]"
                              >
                                <span className="text-[#239083]">✓</span>
                                <span>{highlight}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </motion.div>
            )}

            {/* Sections */}
            {sortedSections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-semibold text-[#1D1D1B] mb-6">
                  מידע מפורט ({sortedSections.length} סקשנים)
                </h2>
                <div className="space-y-6">
                  {sortedSections.map((section) => (
                    <div
                      key={section.id}
                      className="border-b border-[#C6C6C6] pb-4 last:border-0"
                    >
                      <h4 className="text-sm font-medium text-[#706F6F] mb-2 flex items-center gap-2">
                        {section.icon && <span>{section.icon}</span>}
                        {section.title}
                      </h4>
                      <div className="text-[#1D1D1B]">
                        {renderMarkdown(section.content)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {!hasNarrativeContent && sortedSections.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-12 text-center"
              >
                <p className="text-[#706F6F]">אין תוכן מותאם אישית</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEdit}
                  className="mt-4"
                >
                  הוסף תוכן
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">יעד לא נמצא</p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="מחיקת יעד מהדוח"
        message="האם אתה בטוח שברצונך למחוק את היעד הזה מהדוח?"
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
    </>
  );
}

export default function ViewResponsePage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  return (
    <AdminLayout>
      <ViewResponseContent params={params} />
    </AdminLayout>
  );
}
