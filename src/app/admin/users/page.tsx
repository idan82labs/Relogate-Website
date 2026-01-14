"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, AdminGuard } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';
import {
  listUsers,
  deleteUser,
  type AdminUser,
  type ListUsersParams,
} from '@/services/admin';

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
        </div>
      </div>
    </nav>
  );
}

function UserStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isActive ? content.users.status.active : content.users.status.inactive}
    </span>
  );
}

function OnboardingBadge({ status }: { status: 'pending' | 'in_progress' | 'completed' }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {content.users.onboardingStatus[status]}
    </span>
  );
}

function RoleBadge({ role }: { role: 'user' | 'admin' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        role === 'admin'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {content.users.roles[role]}
    </span>
  );
}

function UsersTable({
  users,
  onView,
  onDelete,
}: {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('he-IL');
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-[#706F6F]">
        {content.users.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#C6C6C6]">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.name}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.email}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.role}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.status}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.onboarding}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.createdAt}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.users.table.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#C6C6C6]">
          {users.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-[#F9F6F1] transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[#1D1D1B]">
                  {user.firstName} {user.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#706F6F]">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <UserStatusBadge isActive={user.isActive} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OnboardingBadge status={user.onboardingStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(user)}
                    className="text-[#215388] hover:text-[#1a4270] font-medium"
                  >
                    {content.users.actions.view}
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    {user.isActive
                      ? content.users.actions.deactivate
                      : content.users.actions.delete}
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
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#C6C6C6]">
      <div className="text-sm text-[#706F6F]">
        {page} {content.users.pagination.of} {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          {content.users.pagination.prev}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          {content.users.pagination.next}
        </Button>
      </div>
    </div>
  );
}

function UserDetailModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('he-IL');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#C6C6C6]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1D1D1B]">
              {content.userDetail.title}
            </h2>
            <button
              onClick={onClose}
              className="text-[#706F6F] hover:text-[#1D1D1B]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.firstName}</label>
              <p className="font-medium text-[#1D1D1B]">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.lastName}</label>
              <p className="font-medium text-[#1D1D1B]">{user.lastName}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.email}</label>
              <p className="font-medium text-[#1D1D1B]">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.phone}</label>
              <p className="font-medium text-[#1D1D1B]">{user.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.idNumber}</label>
              <p className="font-medium text-[#1D1D1B]">{user.idNumber || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.birthDate}</label>
              <p className="font-medium text-[#1D1D1B]">{formatDate(user.birthDate)}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.citizenship}</label>
              <p className="font-medium text-[#1D1D1B]">{user.citizenship || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.role}</label>
              <p className="font-medium"><RoleBadge role={user.role} /></p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.status}</label>
              <p className="font-medium"><UserStatusBadge isActive={user.isActive} /></p>
            </div>
            <div>
              <label className="text-sm text-[#706F6F]">{content.userDetail.fields.createdAt}</label>
              <p className="font-medium text-[#1D1D1B]">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#C6C6C6]">
          <Button variant="outline" onClick={onClose} className="w-full">
            {content.userDetail.backToList}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#1D1D1B] mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            {content.userForm.cancel}
          </Button>
          <Button variant="primary" onClick={onConfirm} className="flex-1">
            {content.users.actions.delete}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminUsersContent() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async (params: ListUsersParams = {}) => {
    setIsLoading(true);
    setError('');

    const { data, error: fetchError } = await listUsers({
      page: params.page || page,
      limit: 20,
      search: params.search || search || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    if (fetchError || !data) {
      setError(fetchError || 'Failed to load users');
      setIsLoading(false);
      return;
    }

    setUsers(data.users);
    setTotalPages(data.pagination.totalPages);
    setIsLoading(false);
  }, [page, search]);

  useEffect(() => {
    async function init() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserName(`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim());
      }
      fetchUsers();
    }
    init();
  }, [fetchUsers]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers({ page: 1, search });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers({ page: newPage });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const { error: deleteError } = await deleteUser(userToDelete.id, !userToDelete.isActive);

    if (deleteError) {
      setError(deleteError);
    } else {
      fetchUsers();
    }

    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <AdminHeader userName={userName} onLogout={handleLogout} />
      <AdminNav activeTab="users" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1D1D1B]">{content.users.title}</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={content.users.searchPlaceholder}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-10 px-4 border-2 border-[#C6C6C6] rounded-lg text-[#1D1D1B] placeholder:text-[#B2B2B2] focus:border-[#215388] focus:outline-none"
                dir="rtl"
              />
            </div>
            <Button variant="primary" onClick={handleSearch}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#215388]" />
            </div>
          ) : (
            <>
              <UsersTable
                users={users}
                onView={(user) => setSelectedUser(user)}
                onDelete={(user) => setUserToDelete(user)}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
        {userToDelete && (
          <ConfirmDialog
            message={
              userToDelete.isActive
                ? content.users.confirmDeactivate
                : content.users.confirmDelete
            }
            onConfirm={handleDeleteUser}
            onCancel={() => setUserToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminUsersContent />
    </AdminGuard>
  );
}
