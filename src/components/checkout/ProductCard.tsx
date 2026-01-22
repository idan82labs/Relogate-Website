'use client';

import { motion } from 'framer-motion';
import { siteContent } from '@/content/he';
import type { ProductType } from '@/types/payment';

interface ProductCardProps {
  productType: ProductType;
  price: number;
  currency?: string;
}

export function ProductCard({
  productType,
  price,
  currency = 'ILS',
}: ProductCardProps) {
  const content = siteContent.checkout.products[productType];

  // Format price (convert from agorot to shekels)
  const formattedPrice = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 py-4"
    >
      {/* Product name with checkmark */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-[#239083] flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-lg font-medium text-[#1D1D1B]">
          {content.name}
        </span>
      </div>

      {/* Price */}
      <span className="text-lg font-semibold text-[#1D1D1B] whitespace-nowrap">
        {formattedPrice}
      </span>
    </motion.div>
  );
}
