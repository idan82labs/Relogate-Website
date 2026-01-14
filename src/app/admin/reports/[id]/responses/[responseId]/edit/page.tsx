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

const contentFields: { key: keyof CountryResponseContent; label: string; placeholder: string }[] = [
  {
    key: 'introduction',
    label: 'הקדמה',
    placeholder: 'תיאור קצר של המדינה והתאמתה למשתמש...',
  },
  {
    key: 'visaOptions',
    label: 'אפשרויות ויזה',
    placeholder: 'מסלולי הויזה המומלצים עבור המשתמש...',
  },
  {
    key: 'costOfLiving',
    label: 'יוקר מחייה',
    placeholder: 'מידע על עלויות מחייה מותאם למשתמש...',
  },
  {
    key: 'healthcare',
    label: 'מערכת בריאות',
    placeholder: 'מידע על מערכת הבריאות...',
  },
  {
    key: 'education',
    label: 'חינוך',
    placeholder: 'מידע על מערכת החינוך...',
  },
  {
    key: 'employment',
    label: 'תעסוקה',
    placeholder: 'מידע על שוק העבודה והזדמנויות תעסוקה...',
  },
  {
    key: 'safety',
    label: 'ביטחון אישי',
    placeholder: 'מידע על ביטחון ובטיחות...',
  },
  {
    key: 'community',
    label: 'קהילה ישראלית/יהודית',
    placeholder: 'מידע על הקהילה היהודית והישראלית...',
  },
  {
    key: 'transportation',
    label: 'תחבורה',
    placeholder: 'מידע על תחבורה ציבורית ותשתיות...',
  },
  {
    key: 'additionalNotes',
    label: 'הערות נוספות',
    placeholder: 'הערות נוספות עבור המשתמש...',
  },
];

function EditResponseContent({ params }: { params: Promise<{ id: string; responseId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<ReportCountryResponse | null>(null);
  const [formContent, setFormContent] = useState<CountryResponseContent>({});
  const [status, setStatus] = useState<ReportStatus>('draft');

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
          setFormContent(foundResponse.content as CountryResponseContent || {});
          setStatus(foundResponse.status);
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

  const handleContentChange = (field: keyof CountryResponseContent, value: string) => {
    setFormContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    // Filter out empty content fields
    const filteredContent: CountryResponseContent = {};
    Object.entries(formContent).forEach(([key, value]) => {
      if (value && value.trim()) {
        filteredContent[key as keyof CountryResponseContent] = value;
      }
    });

    const { response: updatedResponse, error: updateError } = await updateCountryResponse(
      resolvedParams.id,
      resolvedParams.responseId,
      {
        content: filteredContent,
        status,
      }
    );

    if (updateError) {
      setError(updateError);
    } else if (updatedResponse) {
      setResponse(updatedResponse);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setSaving(true);
    setError('');

    // Filter out empty content fields
    const filteredContent: CountryResponseContent = {};
    Object.entries(formContent).forEach(([key, value]) => {
      if (value && value.trim()) {
        filteredContent[key as keyof CountryResponseContent] = value;
      }
    });

    const { response: updatedResponse, error: updateError } = await updateCountryResponse(
      resolvedParams.id,
      resolvedParams.responseId,
      {
        content: filteredContent,
        status: 'published',
      }
    );

    if (updateError) {
      setError(updateError);
    } else if (updatedResponse) {
      setResponse(updatedResponse);
      setStatus('published');
    }
    setSaving(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/admin/reports/${resolvedParams.id}/edit`}
            className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {content.countryResponseEditor?.backToReport || 'חזרה לדוח'}
          </Link>
          <h1 className="text-2xl font-bold text-[#1D1D1B]">
            {content.countryResponseEditor?.title || 'עריכת המלצת מדינה'}
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
                    className="w-16 h-12 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#1D1D1B]">{response.countryName}</h2>
                  <p className="text-[#706F6F]">{response.countryCode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ReportStatusBadge status={status} />
                  {status === 'draft' && (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ReportStatus)}
                      className="px-3 py-1 border border-[#C6C6C6] rounded-lg text-sm"
                    >
                      <option value="draft">טיוטה</option>
                      <option value="published">פורסם</option>
                    </select>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Content Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-[#1D1D1B] mb-6">תוכן מותאם אישית</h3>
              <div className="space-y-6">
                {contentFields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                      {label}
                    </label>
                    <textarea
                      value={formContent[key] || ''}
                      onChange={(e) => handleContentChange(key, e.target.value)}
                      placeholder={placeholder}
                      rows={4}
                      className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] resize-y"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end gap-3"
            >
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/reports/${resolvedParams.id}/edit`)}
              >
                ביטול
              </Button>
              <Button variant="outline" onClick={handleSave} disabled={saving}>
                {saving ? 'שומר...' : 'שמור'}
              </Button>
              {status === 'draft' && (
                <Button variant="primary" onClick={handlePublish} disabled={saving}>
                  {saving ? 'מפרסם...' : 'פרסם'}
                </Button>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">תגובה לא נמצאה</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EditResponsePage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  return (
    <AdminGuard>
      <EditResponseContent params={params} />
    </AdminGuard>
  );
}
