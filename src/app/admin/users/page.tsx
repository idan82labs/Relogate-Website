"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, AdminLayout } from '@/components/shared';
import { siteContent } from '@/content/he';
import { getCurrentUser } from '@/services/auth';
import {
  listUsers,
  deleteUser,
  getUserById,
  type AdminUser,
  type AdminUserDetail,
  type ListUsersParams,
} from '@/services/admin';

const content = siteContent.admin;

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
  currentUserId,
  onView,
  onDeactivate,
  onDeletePermanent,
}: {
  users: AdminUser[];
  currentUserId: string | null;
  onView: (user: AdminUser) => void;
  onDeactivate: (user: AdminUser) => void;
  onDeletePermanent: (user: AdminUser) => void;
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
                  {user.id !== currentUserId && (
                    <>
                      {user.isActive && (
                        <button
                          onClick={() => onDeactivate(user)}
                          className="text-yellow-600 hover:text-yellow-800 font-medium"
                        >
                          {content.users.actions.deactivate}
                        </button>
                      )}
                      <button
                        onClick={() => onDeletePermanent(user)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        {content.users.actions.deletePermanent}
                      </button>
                    </>
                  )}
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

function QuestionnaireStatusBadge({ status }: { status: 'in_progress' | 'completed' | 'archived' }) {
  const colors = {
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {content.userDetail.questionnaireStatus[status]}
    </span>
  );
}

function QuestionnaireResponsesDisplay({ responses }: { responses: Record<string, unknown> }) {
  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const entries = Object.entries(responses);

  if (entries.length === 0) {
    return <p className="text-[#706F6F] text-sm">-</p>;
  }

  return (
    <div className="space-y-2 bg-[#F7F7F7] rounded-lg p-3">
      {entries.map(([key, value]) => (
        <div key={key} className="text-sm">
          <span className="font-medium text-[#1D1D1B]">{key}: </span>
          <span className="text-[#706F6F]">{formatValue(value)}</span>
        </div>
      ))}
    </div>
  );
}

function UserDetailModal({
  user,
  isLoading,
  onClose,
}: {
  user: AdminUserDetail | null;
  isLoading: boolean;
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
        className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#215388]" />
          </div>
        ) : user ? (
          <>
            <div className="p-6 space-y-6">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1B] mb-4">
                  {content.userDetail.personalInfo}
                </h3>
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

              {/* Questionnaires Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1B] mb-4">
                  {content.userDetail.questionnaires}
                </h3>
                {user.questionnaires && user.questionnaires.length > 0 ? (
                  <div className="space-y-4">
                    {user.questionnaires.map((q) => (
                      <div key={q.id} className="border border-[#C6C6C6] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <QuestionnaireStatusBadge status={q.status} />
                          <span className="text-sm text-[#706F6F]">
                            {content.userDetail.questionnaireFields.currentStep}: {q.currentStep}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-[#706F6F]">{content.userDetail.questionnaireFields.createdAt}: </span>
                            <span className="text-[#1D1D1B]">{formatDate(q.createdAt)}</span>
                          </div>
                          <div>
                            <span className="text-[#706F6F]">{content.userDetail.questionnaireFields.completedAt}: </span>
                            <span className="text-[#1D1D1B]">{formatDate(q.completedAt)}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-[#1D1D1B] block mb-2">
                            {content.userDetail.questionnaireFields.responses}:
                          </label>
                          <QuestionnaireResponsesDisplay responses={q.responses} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#706F6F]">{content.userDetail.noQuestionnaires}</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[#C6C6C6]">
              <Button variant="outline" onClick={onClose} className="w-full">
                {content.userDetail.backToList}
              </Button>
            </div>
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function ConfirmDialog({
  message,
  actionLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: {
  message: string;
  actionLabel: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const buttonClass = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-yellow-600 hover:bg-yellow-700 text-white';

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
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${buttonClass}`}
          >
            {actionLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminUsersContent() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<AdminUser | null>(null);
  const [userToDeletePermanent, setUserToDeletePermanent] = useState<AdminUser | null>(null);

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
        setCurrentUserId(currentUser.id || null);
      }
      fetchUsers();
    }
    init();
  }, [fetchUsers]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers({ page: 1, search });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers({ page: newPage });
  };

  const handleViewUser = async (user: AdminUser) => {
    setIsLoadingDetail(true);
    setSelectedUserDetail(null);

    const { user: userDetail, error: fetchError } = await getUserById(user.id);

    if (fetchError || !userDetail) {
      setError(fetchError || 'Failed to load user details');
      setIsLoadingDetail(false);
      return;
    }

    setSelectedUserDetail(userDetail);
    setIsLoadingDetail(false);
  };

  const handleDeactivateUser = async () => {
    if (!userToDeactivate) return;

    const { error: deleteError } = await deleteUser(userToDeactivate.id, false);

    if (deleteError) {
      setError(deleteError);
    } else {
      fetchUsers();
    }

    setUserToDeactivate(null);
  };

  const handleDeletePermanent = async () => {
    if (!userToDeletePermanent) return;

    const { error: deleteError } = await deleteUser(userToDeletePermanent.id, true);

    if (deleteError) {
      setError(deleteError);
    } else {
      fetchUsers();
    }

    setUserToDeletePermanent(null);
  };

  return (
    <>
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
                currentUserId={currentUserId}
                onView={handleViewUser}
                onDeactivate={(user) => setUserToDeactivate(user)}
                onDeletePermanent={(user) => setUserToDeletePermanent(user)}
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
        {(selectedUserDetail || isLoadingDetail) && (
          <UserDetailModal
            user={selectedUserDetail}
            isLoading={isLoadingDetail}
            onClose={() => {
              setSelectedUserDetail(null);
              setIsLoadingDetail(false);
            }}
          />
        )}
        {userToDeactivate && (
          <ConfirmDialog
            message={content.users.confirmDeactivate}
            actionLabel={content.users.actions.deactivate}
            variant="warning"
            onConfirm={handleDeactivateUser}
            onCancel={() => setUserToDeactivate(null)}
          />
        )}
        {userToDeletePermanent && (
          <ConfirmDialog
            message={content.users.confirmDelete}
            actionLabel={content.users.actions.deletePermanent}
            variant="danger"
            onConfirm={handleDeletePermanent}
            onCancel={() => setUserToDeletePermanent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminLayout activeTab="users">
      <AdminUsersContent />
    </AdminLayout>
  );
}
