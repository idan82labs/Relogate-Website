"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, AdminGuard } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';
import { getActiveCountries, type CountryListItem } from '@/services/countries';
import {
  createCountryResponse,
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

type TabId = 'country' | 'content';

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

function CountrySelector({
  countries,
  selectedId,
  onSelect,
}: {
  countries: CountryListItem[];
  selectedId: string | null;
  onSelect: (country: CountryListItem) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {countries.map((country) => (
        <button
          key={country.id}
          type="button"
          onClick={() => onSelect(country)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedId === country.id
              ? 'border-[#215388] bg-[#215388]/5'
              : 'border-[#C6C6C6] hover:border-[#215388]/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {country.flagImage && (
              <img
                src={country.flagImage}
                alt={country.name}
                className="w-8 h-6 object-cover rounded"
              />
            )}
            <div className="text-right">
              <p className="font-medium text-[#1D1D1B]">{country.name}</p>
              <p className="text-xs text-[#706F6F]">{country.code}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
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

function NewResponseContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('country');
  const [countries, setCountries] = useState<CountryListItem[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryListItem | null>(null);
  const [content, setContent] = useState<CountryResponseContent>({});

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      if (user) {
        const name = user.user_metadata?.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }

      const { data, error: fetchError } = await getActiveCountries();
      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setCountries(data);
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleCountrySelect = (country: CountryListItem) => {
    setSelectedCountry(country);
  };

  const handleContentChange = (field: keyof CountryResponseContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedCountry) {
      setError('נא לבחור מדינה');
      setActiveTab('country');
      return;
    }

    setSaving(true);
    setError('');

    // Filter out empty content fields
    const filteredContent: CountryResponseContent = {};
    Object.entries(content).forEach(([key, value]) => {
      if (value && value.trim()) {
        filteredContent[key as keyof CountryResponseContent] = value;
      }
    });

    const { response, error: createError } = await createCountryResponse(resolvedParams.id, {
      countryId: selectedCountry.id,
      content: Object.keys(filteredContent).length > 0 ? filteredContent : undefined,
    });

    if (createError) {
      setError(createError);
      setSaving(false);
    } else if (response) {
      router.push(`/admin/reports/${resolvedParams.id}/responses/${response.id}/edit`);
    }
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
          <h1 className="text-2xl font-bold text-[#1D1D1B]">הוספת מדינה לדוח</h1>
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
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-[#C6C6C6] flex">
              <TabButton
                id="country"
                label="בחירת מדינה"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                id="content"
                label="תוכן מותאם"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            </div>

            <div className="p-6">
              {/* Country Tab */}
              {activeTab === 'country' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {selectedCountry && (
                    <div className="mb-6 p-4 bg-[#F9F6F1] rounded-lg flex items-center gap-4">
                      {selectedCountry.flagImage && (
                        <img
                          src={selectedCountry.flagImage}
                          alt={selectedCountry.name}
                          className="w-12 h-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-[#1D1D1B]">מדינה נבחרת: {selectedCountry.name}</p>
                        <p className="text-sm text-[#706F6F]">{selectedCountry.englishName}</p>
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-[#1D1D1B] mb-4">בחר מדינה להוספה:</h3>
                  <CountrySelector
                    countries={countries}
                    selectedId={selectedCountry?.id || null}
                    onSelect={handleCountrySelect}
                  />
                </motion.div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {contentFields.map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {label}
                      </label>
                      <textarea
                        value={content[key] || ''}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] resize-y"
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-[#C6C6C6] px-6 py-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/reports/${resolvedParams.id}/edit`)}
              >
                ביטול
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={saving || !selectedCountry}
              >
                {saving ? 'שומר...' : 'הוסף מדינה'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewResponsePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminGuard>
      <NewResponseContent params={params} />
    </AdminGuard>
  );
}
