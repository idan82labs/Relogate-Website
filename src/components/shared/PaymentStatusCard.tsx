'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from './Card';
import { Button } from './Button';
import { siteContent } from '@/content/he';
import type { PaymentStatus } from '@/types/payment';

interface PaymentInfo {
  status: PaymentStatus;
  paidAt?: string;
  amount?: number;
  orderNumber?: string;
}

interface PaymentStatusCardProps {
  hasPaid: boolean;
  paymentInfo?: PaymentInfo;
  isLoading?: boolean;
  className?: string;
}

/**
 * PaymentStatusCard - Shows payment status and actions
 */
export const PaymentStatusCard = ({
  hasPaid,
  paymentInfo,
  isLoading = false,
  className = '',
}: PaymentStatusCardProps) => {
  const router = useRouter();
  const content = siteContent.personalAreaDashboard.payment;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('he-IL');
    } catch {
      return '';
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return `₪${(amount / 100).toFixed(0)}`;
  };

  const handlePaymentClick = () => {
    router.push('/checkout');
  };

  const handleRetryClick = () => {
    router.push('/checkout');
  };

  // Loading state
  if (isLoading) {
    return (
      <Card padding="lg" className={`bg-white ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 mr-auto" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 mr-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mr-auto" />
        </div>
      </Card>
    );
  }

  // Not paid state
  if (!hasPaid) {
    return (
      <Card padding="lg" className={`bg-white ${className}`}>
        <div className="text-right">
          <h3 className="text-lg font-medium text-[#1D1D1B] mb-2">
            {content.notPaid.title}
          </h3>
          <p className="text-[#706F6F] text-sm mb-4">
            {content.notPaid.description}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              size="md"
              onClick={handlePaymentClick}
              className="w-full sm:w-auto"
            >
              {content.notPaid.cta}
            </Button>
          </motion.div>
        </div>
      </Card>
    );
  }

  // Payment failed state
  if (paymentInfo?.status === 'failed') {
    return (
      <Card padding="lg" className={`bg-white border-red-200 ${className}`}>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <h3 className="text-lg font-medium text-red-600">
              {content.failed.title}
            </h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p className="text-[#706F6F] text-sm mb-4">
            {content.failed.description}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={handleRetryClick}
          >
            {content.failed.retryCta}
          </Button>
        </div>
      </Card>
    );
  }

  // Payment pending state
  if (paymentInfo?.status === 'pending') {
    return (
      <Card padding="lg" className={`bg-white ${className}`}>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <h3 className="text-lg font-medium text-[#215388]">
              {content.pending.title}
            </h3>
            <div className="w-8 h-8 bg-[#215388]/10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[#215388] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <p className="text-[#706F6F] text-sm">
            {content.pending.description}
          </p>
        </div>
      </Card>
    );
  }

  // Payment completed state
  return (
    <Card padding="lg" className={`bg-white border-[#239083]/20 ${className}`}>
      <div className="text-right">
        <div className="flex items-center justify-end gap-2 mb-2">
          <h3 className="text-lg font-medium text-[#239083]">
            {content.completed.title}
          </h3>
          <div className="w-8 h-8 bg-[#239083]/10 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#239083]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="text-[#706F6F] text-sm mb-3">
          {content.completed.description}
        </p>

        {/* Payment details */}
        <div className="space-y-1 text-sm border-t border-[#F7F7F7] pt-3 mt-3">
          {paymentInfo?.paidAt && (
            <div className="flex justify-between">
              <span className="text-[#1D1D1B]">{formatDate(paymentInfo.paidAt)}</span>
              <span className="text-[#706F6F]">{content.completed.paidAt}</span>
            </div>
          )}
          {paymentInfo?.amount && (
            <div className="flex justify-between">
              <span className="text-[#1D1D1B]">{formatAmount(paymentInfo.amount)}</span>
              <span className="text-[#706F6F]">{content.completed.amount}</span>
            </div>
          )}
          {paymentInfo?.orderNumber && (
            <div className="flex justify-between">
              <span className="text-[#1D1D1B]" dir="ltr">{paymentInfo.orderNumber}</span>
              <span className="text-[#706F6F]">{content.completed.orderNumber}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
