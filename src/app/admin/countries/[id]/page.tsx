"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, AdminGuard } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';
import { getCountryById, deleteCountry, type Country } from '@/services/countries';

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

function CountryStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isActive ? content.countries.status.active : content.countries.status.inactive}
    </span>
  );
}

function CategoryDisplay({ label, value }: { label: string; value: string | undefined }) {
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
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

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
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            אישור
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function CountryDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      if (user) {
        const name = user.user_metadata?.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }

      const { country: fetchedCountry, error: fetchError } = await getCountryById(resolvedParams.id);
      if (fetchError) {
        setError(fetchError);
      } else if (fetchedCountry) {
        setCountry(fetchedCountry);
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleEdit = () => {
    router.push(`/admin/countries/${resolvedParams.id}/edit`);
  };

  const handleDelete = async () => {
    const { success, error: deleteError } = await deleteCountry(resolvedParams.id);
    if (success) {
      router.push('/admin/countries');
    } else {
      setError(deleteError || 'Failed to delete country');
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/countries')}
              className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              חזרה לרשימה
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              {content.countries.actions.edit}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {content.countries.actions.delete}
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
        ) : country ? (
          <div className="space-y-6">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start gap-6">
                {country.flagImage && (
                  <img
                    src={country.flagImage}
                    alt={country.name}
                    className="w-24 h-16 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-[#1D1D1B]">{country.name}</h1>
                    <span className="text-lg text-[#706F6F]">({country.code})</span>
                    <CountryStatusBadge isActive={country.isActive} />
                  </div>
                  <p className="text-[#706F6F] mb-2">{country.englishName}</p>
                  <p className="text-sm text-[#B2B2B2]">
                    נוצר ב: {new Date(country.createdAt).toLocaleDateString('he-IL')}
                    {' | '}
                    עודכן ב: {new Date(country.updatedAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            {country.heroImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <img
                  src={country.heroImage}
                  alt={`${country.name} hero`}
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            )}

            {/* Introduction */}
            {country.introduction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-semibold text-[#1D1D1B] mb-4">הקדמה</h2>
                <p className="text-[#1D1D1B] whitespace-pre-wrap">{country.introduction}</p>
              </motion.div>
            )}

            {/* Categories */}
            {country.categories && Object.keys(country.categories).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-semibold text-[#1D1D1B] mb-6">קטגוריות</h2>
                <div className="space-y-6">
                  <CategoryDisplay label={content.countryForm.categories.general} value={country.categories.general} />
                  <CategoryDisplay label={content.countryForm.categories.visa} value={country.categories.visa} />
                  <CategoryDisplay label={content.countryForm.categories.language} value={country.categories.language} />
                  <CategoryDisplay label={content.countryForm.categories.safety} value={country.categories.safety} />
                  <CategoryDisplay label={content.countryForm.categories.jewish} value={country.categories.jewish} />
                  <CategoryDisplay label={content.countryForm.categories.openness} value={country.categories.openness} />
                  <CategoryDisplay label={content.countryForm.categories.healthcare} value={country.categories.healthcare} />
                  <CategoryDisplay label={content.countryForm.categories.education} value={country.categories.education} />
                  <CategoryDisplay label={content.countryForm.categories.employment} value={country.categories.employment} />
                  <CategoryDisplay label={content.countryForm.categories.transport} value={country.categories.transport} />
                  <CategoryDisplay label={content.countryForm.categories.cost} value={country.categories.cost} />
                  <CategoryDisplay label={content.countryForm.categories.distance} value={country.categories.distance} />
                  <CategoryDisplay label={content.countryForm.categories.community} value={country.categories.community} />
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">מדינה לא נמצאה</p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="מחיקת מדינה"
        message={content.countries.confirmDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default function CountryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminGuard>
      <CountryDetailContent params={params} />
    </AdminGuard>
  );
}
