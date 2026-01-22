"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button, AdminLayout } from '@/components/shared';
import { siteContent } from '@/content/he';
import {
  listPayments,
  type AdminPayment,
  type ListPaymentsParams,
} from '@/services/admin';

const content = siteContent.admin;

type PaymentStatus = AdminPayment['status'];
type ProductType = AdminPayment['productType'];

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const colors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
    refunded: 'bg-blue-100 text-blue-800',
    disputed: 'bg-orange-100 text-orange-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {content.payments.status[status]}
    </span>
  );
}

function ProductTypeBadge({ productType }: { productType: ProductType }) {
  const colors: Record<ProductType, string> = {
    relomatch_report: 'bg-purple-100 text-purple-800',
    consultation: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[productType]}`}
    >
      {content.payments.productTypes[productType]}
    </span>
  );
}

function formatAmount(amount: number, currency: string): string {
  // Amount is stored in agorot (cents), convert to main unit
  const mainAmount = amount / 100;
  if (currency === 'ILS') {
    return `${mainAmount.toLocaleString('he-IL')} ש״ח`;
  }
  return `${currency} ${mainAmount.toLocaleString()}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function PaymentsTable({
  payments,
  onViewUser,
}: {
  payments: AdminPayment[];
  onViewUser: (userId: string) => void;
}) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12 text-[#706F6F]">
        {content.payments.empty}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#C6C6C6]">
        <thead className="bg-[#F7F7F7]">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.user}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.email}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.product}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.amount}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.status}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.createdAt}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.paidAt}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#706F6F] uppercase tracking-wider">
              {content.payments.table.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#C6C6C6]">
          {payments.map((payment) => (
            <motion.tr
              key={payment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-[#F9F6F1] transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[#1D1D1B]">
                  {payment.user
                    ? `${payment.user.firstName} ${payment.user.lastName}`
                    : '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#706F6F]">
                  {payment.user?.email || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ProductTypeBadge productType={payment.productType} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-[#1D1D1B]">
                  {formatAmount(payment.amount, payment.currency)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {formatDate(payment.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#706F6F]">
                {formatDate(payment.paidAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                  {payment.userId && (
                    <button
                      onClick={() => onViewUser(payment.userId)}
                      className="text-[#215388] hover:text-[#1a4270] font-medium"
                    >
                      {content.payments.actions.viewUser}
                    </button>
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
        {page} {content.payments.pagination.of} {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          {content.payments.pagination.prev}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          {content.payments.pagination.next}
        </Button>
      </div>
    </div>
  );
}

function FilterTabs({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  const filters = [
    { id: '', label: content.payments.filters.all },
    { id: 'completed', label: content.payments.filters.completed },
    { id: 'pending', label: content.payments.filters.pending },
    { id: 'failed', label: content.payments.filters.failed },
    { id: 'refunded', label: content.payments.filters.refunded },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-[#215388] text-white'
              : 'bg-white text-[#706F6F] hover:bg-[#F7F7F7] border border-[#C6C6C6]'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function ProductTypeFilter({
  activeType,
  onTypeChange,
}: {
  activeType: string;
  onTypeChange: (type: string) => void;
}) {
  const types = [
    { id: '', label: content.payments.productTypes.all },
    { id: 'relomatch_report', label: content.payments.productTypes.relomatch_report },
    { id: 'consultation', label: content.payments.productTypes.consultation },
  ];

  return (
    <div className="flex gap-2">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeChange(type.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeType === type.id
              ? 'bg-[#239083] text-white'
              : 'bg-white text-[#706F6F] hover:bg-[#F7F7F7] border border-[#C6C6C6]'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}

function AdminPaymentsContent() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = useCallback(async (params: ListPaymentsParams = {}) => {
    setIsLoading(true);
    setError('');

    const { data, error: fetchError } = await listPayments({
      page: params.page || page,
      limit: 20,
      status: (params.status ?? statusFilter) || undefined,
      productType: (params.productType ?? productTypeFilter) || undefined,
      search: (params.search ?? search) || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    if (fetchError || !data) {
      setError(fetchError || 'Failed to load payments');
      setIsLoading(false);
      return;
    }

    setPayments(data.payments);
    setTotalPages(data.pagination.totalPages);
    setIsLoading(false);
  }, [page, search, statusFilter, productTypeFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleSearch = () => {
    setPage(1);
    fetchPayments({ page: 1, search });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchPayments({ page: newPage });
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    fetchPayments({ page: 1, status: newStatus });
  };

  const handleProductTypeFilterChange = (newType: string) => {
    setProductTypeFilter(newType);
    setPage(1);
    fetchPayments({ page: 1, productType: newType });
  };

  const handleViewUser = (userId: string) => {
    window.open(`/admin/users`, '_blank');
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1D1D1B] mb-4">
          {content.payments.title}
        </h1>

        {/* Search and filters */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={content.payments.searchPlaceholder}
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

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <FilterTabs
              activeFilter={statusFilter}
              onFilterChange={handleStatusFilterChange}
            />
            <ProductTypeFilter
              activeType={productTypeFilter}
              onTypeChange={handleProductTypeFilterChange}
            />
          </div>
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
            <PaymentsTable
              payments={payments}
              onViewUser={handleViewUser}
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
  );
}

export default function AdminPaymentsPage() {
  return (
    <AdminLayout activeTab="payments">
      <AdminPaymentsContent />
    </AdminLayout>
  );
}
