"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Button,
  AdminLayout,
  ResponseEditor,
  ResponsePreview,
} from "@/components/shared";
import { siteContent } from "@/content/he";
import {
  getDestinationResponseById,
  updateDestinationResponse,
  publishDestinationResponse,
  type DestinationResponseFull,
  type DestinationInfo,
  type MatchInfo,
  type DestinationNarrative,
  type DestinationSection,
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

function EditResponseContent({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<DestinationResponseFull | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state - new structure
  const [destination, setDestination] = useState<DestinationInfo>({
    name: "",
    subtitle: null,
    image: null,
    badge: null,
  });
  const [match, setMatch] = useState<MatchInfo>({
    score: 0,
    reasons: [],
    visaType: null,
  });
  const [narrative, setNarrative] = useState<DestinationNarrative>({});
  const [sections, setSections] = useState<DestinationSection[]>([]);
  const [status, setStatus] = useState<ReportStatus>("draft");

  useEffect(() => {
    async function init() {
      const { response: fetchedResponse, error: fetchError } =
        await getDestinationResponseById(resolvedParams.responseId);

      if (fetchError) {
        setError(fetchError);
      } else if (fetchedResponse) {
        setResponse(fetchedResponse);
        setDestination(fetchedResponse.destination);
        setMatch(fetchedResponse.match);
        setNarrative(fetchedResponse.narrative);
        setSections(fetchedResponse.sections);
        setStatus(fetchedResponse.status);
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.responseId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");

    const { response: updatedResponse, error: updateError } =
      await updateDestinationResponse(resolvedParams.responseId, {
        destination: {
          name: destination.name,
          subtitle: destination.subtitle,
          image: destination.image,
          badge: destination.badge,
        },
        match: {
          score: match.score,
          reasons: match.reasons.filter((r) => r.trim()),
          visaType: match.visaType,
        },
        narrative,
        sections: sections.map(({ id: _id, ...rest }) => rest),
      });

    if (updateError) {
      setError(updateError);
    } else if (updatedResponse) {
      setResponse(updatedResponse);
    }
    setSaving(false);
  }, [
    resolvedParams.responseId,
    destination,
    match,
    narrative,
    sections,
  ]);

  const handlePublish = useCallback(async () => {
    // Save first
    await handleSave();

    setSaving(true);
    const { response: publishedResponse, error: publishError } =
      await publishDestinationResponse(resolvedParams.responseId, true);

    if (publishError) {
      setError(publishError);
    } else if (publishedResponse) {
      setResponse(publishedResponse);
      setStatus("published");
    }
    setSaving(false);
  }, [handleSave, resolvedParams.responseId]);

  const handleUnpublish = useCallback(async () => {
    setSaving(true);
    const { response: unpublishedResponse, error: unpublishError } =
      await publishDestinationResponse(resolvedParams.responseId, false);

    if (unpublishError) {
      setError(unpublishError);
    } else if (unpublishedResponse) {
      setResponse(unpublishedResponse);
      setStatus("draft");
    }
    setSaving(false);
  }, [resolvedParams.responseId]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/admin/reports/${resolvedParams.id}/edit`}
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
            {content.countryResponseEditor?.backToReport || "חזרה לדוח"}
          </Link>
          <h1 className="text-2xl font-bold text-[#1D1D1B]">
            {content.countryResponseEditor?.title || "עריכת המלצת יעד"}
          </h1>
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
            {/* Destination Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center gap-4">
                {destination.image && (
                  /* eslint-disable-next-line @next/next/no-img-element -- Dynamic image from API */
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-16 h-12 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#1D1D1B]">
                    {destination.name || "יעד חדש"}
                  </h2>
                  {destination.subtitle && (
                    <p className="text-[#706F6F]">{destination.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <ReportStatusBadge status={status} />
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showPreview
                        ? "bg-[#215388] text-white"
                        : "bg-gray-100 text-[#1D1D1B] hover:bg-gray-200"
                    }`}
                  >
                    {showPreview ? "עריכה" : "תצוגה מקדימה"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Editor / Preview Toggle */}
            {showPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="preview"
              >
                <ResponsePreview
                  destination={destination}
                  match={match}
                  narrative={narrative}
                  sections={sections}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="editor"
              >
                <ResponseEditor
                  destination={destination}
                  match={match}
                  narrative={narrative}
                  sections={sections}
                  onDestinationChange={setDestination}
                  onMatchChange={setMatch}
                  onNarrativeChange={setNarrative}
                  onSectionsChange={setSections}
                  disabled={saving}
                />
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg"
            >
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/admin/reports/${resolvedParams.id}/edit`)
                }
              >
                ביטול
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "שומר..." : "שמור טיוטה"}
              </Button>
              {status === "draft" ? (
                <Button
                  variant="primary"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  {saving ? "מפרסם..." : "פרסם"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleUnpublish}
                  disabled={saving}
                >
                  {saving ? "מבטל פרסום..." : "בטל פרסום"}
                </Button>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">יעד לא נמצא</p>
          </div>
        )}
      </main>
    </>
  );
}

export default function EditResponsePage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  return (
    <AdminLayout>
      <EditResponseContent params={params} />
    </AdminLayout>
  );
}
