'use client';

import { motion } from 'framer-motion';
import { siteContent } from '@/content/he';

interface CheckoutProgressProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export function CheckoutProgress({ onBack, showBackButton = true }: CheckoutProgressProps) {
  const content = siteContent.checkout.cart;

  return (
    <div className="flex items-start justify-between mb-8">
      {/* Progress section */}
      <div className="flex flex-col gap-2">
        {/* Progress bar */}
        <div className="w-32 lg:w-40 h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-[#215388] rounded-full"
          />
        </div>
        <span className="text-sm font-medium text-[#215388]">
          {content.step}
        </span>
      </div>

      {/* Back button */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#706F6F] hover:text-[#1D1D1B] transition-colors text-sm"
        >
          <span>{content.backButton}</span>
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8L10 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
