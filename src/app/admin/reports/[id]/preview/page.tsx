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
  type Report,
  type ReportCountryResponse,
  type CountryResponseContent,
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
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
            תצוגה מקדימה
          </span>
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

// User-facing preview components
function PreviewGreeting({ greeting, userName }: { greeting: string | null; userName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#215388] to-[#203170] text-white rounded-2xl p-8 mb-8"
    >
      <h1 className="text-2xl font-bold mb-4">שלום {userName}!</h1>
      {greeting ? (
        <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90">{greeting}</p>
      ) : (
        <p className="text-lg opacity-70 italic">אין הודעת פתיחה</p>
      )}
    </motion.div>
  );
}

function PreviewProfileSummary({ summary }: { summary: Report['profileSummary'] }) {
  const fields = [
    { label: 'אזרחות', value: summary?.citizenship },
    { label: 'מצב משפחתי', value: summary?.familyStatus },
    { label: 'מטרות הגירה', value: summary?.relocationGoals },
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

function PreviewCountryCard({
  response,
  index,
  onClick,
  isSelected,
}: {
  response: ReportCountryResponse;
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
          ? 'bg-[#215388] text-white shadow-lg'
          : 'bg-white shadow hover:shadow-lg'
      }`}
    >
      <div className="flex items-center gap-4">
        {response.countryFlagImage && (
          <img
            src={response.countryFlagImage}
            alt={response.countryName}
            className="w-16 h-12 object-cover rounded-lg shadow"
          />
        )}
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-[#1D1D1B]'}`}>
            {response.countryName}
          </h3>
          <p className={`text-sm ${isSelected ? 'text-white/70' : 'text-[#706F6F]'}`}>
            {response.countryCode}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            isSelected ? 'bg-white/20' : 'bg-[#215388]/10 text-[#215388]'
          }`}
        >
          {index + 1}
        </div>
      </div>
    </motion.button>
  );
}

function PreviewCountryDetail({ response }: { response: ReportCountryResponse }) {
  const responseContent = response.content as CountryResponseContent | undefined;

  const sections = [
    { key: 'introduction', label: 'הקדמה', icon: '📋' },
    { key: 'visaOptions', label: 'אפשרויות ויזה', icon: '🛂' },
    { key: 'costOfLiving', label: 'יוקר מחייה', icon: '💰' },
    { key: 'healthcare', label: 'מערכת בריאות', icon: '🏥' },
    { key: 'education', label: 'חינוך', icon: '🎓' },
    { key: 'employment', label: 'תעסוקה', icon: '💼' },
    { key: 'safety', label: 'ביטחון אישי', icon: '🛡️' },
    { key: 'community', label: 'קהילה ישראלית/יהודית', icon: '✡️' },
    { key: 'transportation', label: 'תחבורה', icon: '🚌' },
    { key: 'additionalNotes', label: 'הערות נוספות', icon: '📝' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#239083] to-[#215388] p-6 text-white">
        <div className="flex items-center gap-4">
          {response.countryFlagImage && (
            <img
              src={response.countryFlagImage}
              alt={response.countryName}
              className="w-20 h-14 object-cover rounded-lg shadow-lg"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{response.countryName}</h2>
            <p className="text-white/70">{response.countryCode}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {responseContent && Object.keys(responseContent).length > 0 ? (
          <div className="space-y-6">
            {sections.map(({ key, label, icon }) => {
              const value = responseContent[key];
              if (!value) return null;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-[#C6C6C6] pb-6 last:border-0 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-[#1D1D1B] mb-3 flex items-center gap-2">
                    <span>{icon}</span>
                    {label}
                  </h3>
                  <p className="text-[#1D1D1B] leading-relaxed whitespace-pre-wrap">{value}</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">אין תוכן מותאם אישית למדינה זו</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PreviewContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);

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

  const publishedResponses =
    report?.countryResponses?.filter((r) => r.status === 'published') || [];
  const selectedResponse = publishedResponses[selectedCountryIndex];

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />

      {/* Preview Actions Bar */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/reports/${resolvedParams.id}`}
              className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
            onClick={() => router.push(`/admin/reports/${resolvedParams.id}/edit`)}
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
            userName={report.profileSummary?.userName || report.user?.firstName || 'משתמש'}
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
            <h2 className="text-xl font-bold text-[#1D1D1B] mb-4">המדינות המומלצות עבורך</h2>

            {publishedResponses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Country List */}
                <div className="space-y-4">
                  {publishedResponses.map((response, index) => (
                    <PreviewCountryCard
                      key={response.id}
                      response={response}
                      index={index}
                      onClick={() => setSelectedCountryIndex(index)}
                      isSelected={index === selectedCountryIndex}
                    />
                  ))}
                </div>

                {/* Country Detail */}
                <div className="lg:col-span-2">
                  {selectedResponse && <PreviewCountryDetail response={selectedResponse} />}
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
    </div>
  );
}

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminGuard>
      <PreviewContent params={params} />
    </AdminGuard>
  );
}
