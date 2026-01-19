"use client";

import { useState, use, useCallback } from "react";
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
  createDestinationResponse,
  type DestinationInfo,
  type MatchInfo,
  type DestinationNarrative,
  type DestinationSection,
} from "@/services/reports";

const content = siteContent.admin;

function NewResponseContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Form state - new structure
  const [destination, setDestination] = useState<DestinationInfo>({
    name: "",
    subtitle: null,
    image: null,
    badge: null,
  });
  const [match, setMatch] = useState<MatchInfo>({
    score: 85,
    reasons: [],
    visaType: null,
  });
  const [narrative, setNarrative] = useState<DestinationNarrative>({});
  const [sections, setSections] = useState<DestinationSection[]>([]);

  const handleSubmit = useCallback(async () => {
    if (!destination.name.trim()) {
      setError("נא להזין שם יעד");
      return;
    }

    setSaving(true);
    setError("");

    const { response, error: createError } = await createDestinationResponse({
      reportId: resolvedParams.id,
      destination: {
        name: destination.name,
        subtitle: destination.subtitle || null,
        image: destination.image || null,
        badge: destination.badge || null,
      },
      match: {
        score: match.score,
        reasons: match.reasons.filter((r) => r.trim()),
        visaType: match.visaType || null,
      },
      narrative,
      sections: sections.map(({ id: _id, ...rest }) => rest),
    });

    if (createError) {
      setError(createError);
      setSaving(false);
    } else if (response) {
      router.push(
        `/admin/reports/${resolvedParams.id}/responses/${response.id}/edit`
      );
    }
  }, [resolvedParams.id, destination, match, narrative, sections, router]);

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
          <h1 className="text-2xl font-bold text-[#1D1D1B]">הוספת יעד לדוח</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Preview Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
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
          </motion.div>

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
            transition={{ delay: 0.1 }}
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
              variant="primary"
              onClick={handleSubmit}
              disabled={saving || !destination.name.trim()}
            >
              {saving ? "יוצר..." : "צור והמשך לעריכה"}
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default function NewResponsePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AdminLayout>
      <NewResponseContent params={params} />
    </AdminLayout>
  );
}
