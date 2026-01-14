"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, AdminGuard } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';
import {
  getCountryById,
  updateCountry,
  type CountryCategories,
  type UpdateCountryInput,
} from '@/services/countries';

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

type TabId = 'basic' | 'content' | 'categories';

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

interface FormData {
  code: string;
  name: string;
  englishName: string;
  flagImage: string;
  heroImage: string;
  introduction: string;
  isActive: boolean;
  categories: CountryCategories;
}

function CountryEditContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('basic');

  const [formData, setFormData] = useState<FormData>({
    code: '',
    name: '',
    englishName: '',
    flagImage: '',
    heroImage: '',
    introduction: '',
    isActive: true,
    categories: {},
  });

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      if (user) {
        const name = user.user_metadata?.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }

      const { country, error: fetchError } = await getCountryById(resolvedParams.id);
      if (fetchError) {
        setError(fetchError);
      } else if (country) {
        setFormData({
          code: country.code,
          name: country.name,
          englishName: country.englishName,
          flagImage: country.flagImage || '',
          heroImage: country.heroImage || '',
          introduction: country.introduction || '',
          isActive: country.isActive,
          categories: country.categories || {},
        });
      }
      setLoading(false);
    }
    init();
  }, [resolvedParams.id]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: keyof CountryCategories, value: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const input: UpdateCountryInput = {
      code: formData.code,
      name: formData.name,
      englishName: formData.englishName,
      flagImage: formData.flagImage || null,
      heroImage: formData.heroImage || null,
      introduction: formData.introduction || null,
      isActive: formData.isActive,
      categories: formData.categories,
    };

    const { country, error: updateError } = await updateCountry(resolvedParams.id, input);

    if (updateError) {
      setError(updateError);
      setSaving(false);
    } else if (country) {
      router.push(`/admin/countries/${country.id}`);
    }
  };

  const categoryFields: { key: keyof CountryCategories; label: string }[] = [
    { key: 'general', label: content.countryForm.categories.general },
    { key: 'visa', label: content.countryForm.categories.visa },
    { key: 'language', label: content.countryForm.categories.language },
    { key: 'safety', label: content.countryForm.categories.safety },
    { key: 'jewish', label: content.countryForm.categories.jewish },
    { key: 'openness', label: content.countryForm.categories.openness },
    { key: 'healthcare', label: content.countryForm.categories.healthcare },
    { key: 'education', label: content.countryForm.categories.education },
    { key: 'employment', label: content.countryForm.categories.employment },
    { key: 'transport', label: content.countryForm.categories.transport },
    { key: 'cost', label: content.countryForm.categories.cost },
    { key: 'distance', label: content.countryForm.categories.distance },
    { key: 'community', label: content.countryForm.categories.community },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/admin/countries/${resolvedParams.id}`)}
              className="text-[#215388] hover:text-[#1a4270] font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              חזרה
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[#1D1D1B]">{content.countryForm.editTitle}</h1>
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
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-[#C6C6C6] flex">
                <TabButton
                  id="basic"
                  label={content.countryForm.tabs.basic}
                  activeTab={activeTab}
                  onClick={setActiveTab}
                />
                <TabButton
                  id="content"
                  label={content.countryForm.tabs.content}
                  activeTab={activeTab}
                  onClick={setActiveTab}
                />
                <TabButton
                  id="categories"
                  label={content.countryForm.tabs.categories}
                  activeTab={activeTab}
                  onClick={setActiveTab}
                />
              </div>

              <div className="p-6">
                {/* Basic Tab */}
                {activeTab === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                          {content.countryForm.fields.code}
                        </label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                          placeholder={content.countryForm.fields.codePlaceholder}
                          maxLength={3}
                          className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388]"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => handleChange('isActive', e.target.checked)}
                          className="w-5 h-5 text-[#215388] border-[#C6C6C6] rounded focus:ring-[#215388]"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-[#1D1D1B]">
                          {content.countryForm.fields.isActive}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.countryForm.fields.name}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder={content.countryForm.fields.namePlaceholder}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.countryForm.fields.englishName}
                      </label>
                      <input
                        type="text"
                        value={formData.englishName}
                        onChange={(e) => handleChange('englishName', e.target.value)}
                        placeholder={content.countryForm.fields.englishNamePlaceholder}
                        dir="ltr"
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] text-left"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.countryForm.fields.flagImage}
                      </label>
                      <input
                        type="text"
                        value={formData.flagImage}
                        onChange={(e) => handleChange('flagImage', e.target.value)}
                        placeholder={content.countryForm.fields.flagImagePlaceholder}
                        dir="ltr"
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] text-left"
                      />
                      {formData.flagImage && (
                        <div className="mt-2">
                          <img
                            src={formData.flagImage}
                            alt="Flag preview"
                            className="h-12 rounded border border-[#C6C6C6]"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.countryForm.fields.heroImage}
                      </label>
                      <input
                        type="text"
                        value={formData.heroImage}
                        onChange={(e) => handleChange('heroImage', e.target.value)}
                        placeholder={content.countryForm.fields.heroImagePlaceholder}
                        dir="ltr"
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] text-left"
                      />
                      {formData.heroImage && (
                        <div className="mt-2">
                          <img
                            src={formData.heroImage}
                            alt="Hero preview"
                            className="h-32 w-full object-cover rounded border border-[#C6C6C6]"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                        {content.countryForm.fields.introduction}
                      </label>
                      <textarea
                        value={formData.introduction}
                        onChange={(e) => handleChange('introduction', e.target.value)}
                        placeholder={content.countryForm.fields.introductionPlaceholder}
                        rows={6}
                        className="w-full px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] resize-y"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {categoryFields.map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-[#1D1D1B] mb-2">
                          {label}
                        </label>
                        <textarea
                          value={formData.categories[key] || ''}
                          onChange={(e) => handleCategoryChange(key, e.target.value)}
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
                  onClick={() => router.push(`/admin/countries/${resolvedParams.id}`)}
                  type="button"
                >
                  {content.countryForm.cancel}
                </Button>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'שומר...' : content.countryForm.submit}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default function CountryEditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminGuard>
      <CountryEditContent params={params} />
    </AdminGuard>
  );
}
