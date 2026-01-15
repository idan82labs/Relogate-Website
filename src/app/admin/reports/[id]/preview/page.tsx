"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, AdminLayout, ResponsePreview } from "@/components/shared";
import {
  getReportById,
  type Report,
  type DestinationResponseListItem,
} from "@/services/reports";

// User-facing preview components
function PreviewGreeting({
  greeting,
  userName,
}: {
  greeting: string | null;
  userName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#215388] to-[#203170] text-white rounded-2xl p-8 mb-8"
    >
      <h1 className="text-2xl font-bold mb-4">שלום {userName}!</h1>
      {greeting ? (
        <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90">
          {greeting}
        </p>
      ) : (
        <p className="text-lg opacity-70 italic">אין הודעת פתיחה</p>
      )}
    </motion.div>
  );
}

function PreviewProfileSummary({
  summary,
}: {
  summary: Report["profileSummary"];
}) {
  const fields = [
    { label: "אזרחות", value: summary?.citizenship },
    { label: "מצב משפחתי", value: summary?.familyStatus },
    { label: "מטרות הגירה", value: summary?.relocationGoals },
  ];

  const hasContent = fields.some((f) => f.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-[#1D1D1B] mb-4">הפרופיל שלך</h2>
      {hasContent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.map(
            ({ label, value }) =>
              value && (
                <div key={label} className="bg-[#F9F6F1] rounded-xl p-4">
                  <p className="text-sm text-[#706F6F] mb-1">{label}</p>
                  <p className="font-medium text-[#1D1D1B]">{value}</p>
                </div>
              )
          )}
        </div>
      ) : (
        <p className="text-[#706F6F] italic">אין מידע פרופיל</p>
      )}
    </motion.div>
  );
}

function PreviewDestinationCard({
  response,
  index,
  onClick,
  isSelected,
}: {
  response: DestinationResponseListItem;
  index: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      onClick={onClick}
      className={`w-full text-right rounded-2xl p-6 transition-all ${
        isSelected
          ? "bg-[#215388] text-white shadow-lg"
          : "bg-white shadow hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-4">
        {response.destination.image && (
          <img
            src={response.destination.image}
            alt={response.destination.name}
            className="w-16 h-12 object-cover rounded-lg shadow"
          />
        )}
        <div className="flex-1">
          <h3
            className={`text-xl font-bold ${isSelected ? "text-white" : "text-[#1D1D1B]"}`}
          >
            {response.destination.name}
          </h3>
          <p
            className={`text-sm ${isSelected ? "text-white/70" : "text-[#706F6F]"}`}
          >
            {response.match.score}% התאמה
            {response.match.visaType && ` • ${response.match.visaType}`}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            isSelected ? "bg-white/20" : "bg-[#215388]/10 text-[#215388]"
          }`}
        >
          {index + 1}
        </div>
      </div>
    </motion.button>
  );
}

function PreviewContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);

  useEffect(() => {
    async function init() {
      const { report: fetchedReport, error: fetchError } = await getReportById(
        resolvedParams.id
      );
      if (fetchError) {
        setError(fetchError);
      } else if (fetchedReport) {
        setReport(fetchedReport);
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id]);

  const publishedResponses =
    report?.destinations?.filter((r) => r.status === "published") || [];
  const selectedResponse = publishedResponses[selectedCountryIndex];

  return (
    <>
      {/* Preview Actions Bar */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <span className="text-[#706F6F]">|</span>
            <span className="text-yellow-800 font-medium">
              תצוגה מקדימה - כך המשתמש יראה את הדוח
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/admin/reports/${resolvedParams.id}/edit`)
            }
          >
            ערוך דוח
          </Button>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
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
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Greeting */}
          <PreviewGreeting
            greeting={report.greeting}
            userName={
              report.profileSummary?.userName ||
              report.user?.firstName ||
              "משתמש"
            }
          />

          {/* Profile Summary */}
          <PreviewProfileSummary summary={report.profileSummary} />

          {/* Countries Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-[#1D1D1B] mb-4">
              המדינות המומלצות עבורך
            </h2>

            {publishedResponses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Destination List */}
                <div className="space-y-4">
                  {publishedResponses.map((response, index) => (
                    <PreviewDestinationCard
                      key={response.id}
                      response={response}
                      index={index}
                      onClick={() => setSelectedCountryIndex(index)}
                      isSelected={index === selectedCountryIndex}
                    />
                  ))}
                </div>

                {/* Destination Detail - using ResponsePreview */}
                <div className="lg:col-span-2">
                  {selectedResponse && (
                    <ResponsePreview
                      destination={selectedResponse.destination}
                      match={selectedResponse.match}
                      narrative={selectedResponse.narrative || {}}
                      sections={selectedResponse.sections || []}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <p className="text-[#706F6F] text-lg">
                  אין מדינות מפורסמות בדוח זה
                </p>
                <p className="text-[#B2B2B2] mt-2">
                  רק מדינות עם סטטוס &quot;פורסם&quot; יופיעו בתצוגה המקדימה
                </p>
              </div>
            )}
          </motion.div>
        </main>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#706F6F]">דוח לא נמצא</p>
        </div>
      )}
    </>
  );
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AdminLayout>
      <PreviewContent params={params} />
    </AdminLayout>
  );
}
