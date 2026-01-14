"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, AdminGuard } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';
import {
  listCountries,
  deleteCountry,
  type Country,
  type ListCountriesParams,
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

function AdminNav({ activeTab }: { activeTab: string }) {
  return (
    <nav className="bg-white border-b border-[#C6C6C6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          <a
            href="/admin/users"
            className={`py-4 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-[#215388] text-[#215388] font-medium'
                : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
            }`}
          >
            {content.dashboard.nav.users}
          </a>
          <a
            href="/admin/countries"
            className={`py-4 border-b-2 transition-colors ${
              activeTab === 'countries'
                ? 'border-[#215388] text-[#215388] font-medium'
                : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
            }`}
          >
            מדינות
          </a>
          <a
            href="/admin/reports"
            className={`py-4 border-b-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-[#215388] text-[#215388] font-medium'
                : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
            }`}
          >
            דוחות
          </a>
        </div>
      </div>
    </nav>
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

function CountriesTable({
  countries,
  onView,
  onEdit,
  onDelete,
}: {
  countries: Country[];
  onView: (country: Country) => void;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-[#C6C6C6]">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.countries.table.code}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.countries.table.name}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.countries.table.englishName}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.countries.table.status}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.countries.table.createdAt}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.countries.table.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#C6C6C6]">
          {countries.map((country, index) => (
            <motion.tr
              key={country.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-[#F9F6F1]"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {country.flagImage && (
                    <img
                      src={country.flagImage}
                      alt={country.name}
                      className="w-6 h-4 object-cover rounded"
                    />
                  )}
                  <span className="text-sm font-medium text-[#1D1D1B]">{country.code}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1D1D1B]">
                {country.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {country.englishName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CountryStatusBadge isActive={country.isActive} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {new Date(country.createdAt).toLocaleDateString('he-IL')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onView(country)}
                    className="text-[#215388] hover:text-[#215388]/80"
                  >
                    {content.countries.actions.view}
                  </button>
                  <button
                    onClick={() => onEdit(country)}
                    className="text-[#239083] hover:text-[#239083]/80"
                  >
                    {content.countries.actions.edit}
                  </button>
                  <button
                    onClick={() => onDelete(country)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {content.countries.actions.delete}
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
        {content.countries.pagination.prev}
      </Button>
      <span className="text-sm text-[#706F6F]">
        {page} {content.countries.pagination.of} {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {content.countries.pagination.next}
      </Button>
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

function CountriesContent() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Country | null>(null);

  const loadCountries = useCallback(async (params: ListCountriesParams = {}) => {
    setLoading(true);
    const { data, error } = await listCountries(params);
    if (data) {
      setCountries(data.countries);
      setTotalPages(data.pagination.totalPages);
    } else if (error) {
      console.error('Failed to fetch countries:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function init() {
      const user = getCurrentUser();
      if (user) {
        const name = user.user_metadata?.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }
      await loadCountries({ page: 1, limit: 20 });
    }
    init();
  }, [loadCountries]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleSearch = () => {
    setPage(1);
    loadCountries({ page: 1, limit: 20, search: search || undefined });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadCountries({ page: newPage, limit: 20, search: search || undefined });
  };

  const handleView = (country: Country) => {
    router.push(`/admin/countries/${country.id}`);
  };

  const handleEdit = (country: Country) => {
    router.push(`/admin/countries/${country.id}/edit`);
  };

  const handleDelete = (country: Country) => {
    setDeleteTarget(country);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const { success, error } = await deleteCountry(deleteTarget.id);
    if (success) {
      setDeleteTarget(null);
      loadCountries({ page, limit: 20, search: search || undefined });
    } else {
      console.error('Failed to delete country:', error);
    }
  };

  const handleAddCountry = () => {
    router.push('/admin/countries/new');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F7F7]">
      <AdminHeader userName={userName} onLogout={handleLogout} />
      <AdminNav activeTab="countries" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1D1D1B]">{content.countries.title}</h2>
          <Button variant="primary" size="sm" onClick={handleAddCountry}>
            {content.countries.addCountry}
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={content.countries.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-[#C6C6C6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215388] focus:border-transparent"
            />
            <Button variant="outline" size="sm" onClick={handleSearch}>
              חיפוש
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full"
            />
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#706F6F]">{content.countries.empty}</p>
          </div>
        ) : (
          <>
            <CountriesTable
              countries={countries}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
            title="מחיקת מדינה"
            message={content.countries.confirmDelete}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CountriesPage() {
  return (
    <AdminGuard>
      <CountriesContent />
    </AdminGuard>
  );
}
