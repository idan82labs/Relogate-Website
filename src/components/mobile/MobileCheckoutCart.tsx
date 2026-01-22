'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Button, GlobeWatermark } from '@/components/shared';
import { ProductCard, TermsCheckbox, CheckoutProgress } from '@/components/checkout';
import { redirectToCheckout } from '@/services/payments';
import { siteContent } from '@/content/he';
import type { ProductType } from '@/types/payment';

interface MobileCheckoutCartProps {
  productType: ProductType;
  price: number; // In agorot
  questionnaireResponseId?: string;
}

export function MobileCheckoutCart({
  productType,
  price,
  questionnaireResponseId,
}: MobileCheckoutCartProps) {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const content = siteContent.checkout;

  const formattedTotal = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
  }).format(price / 100);

  const handlePayment = async () => {
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await redirectToCheckout({
      productType,
      questionnaireResponseId,
    });

    if (!result.success) {
      setError(result.error || content.errors.generic);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileHeader />

      <main className="flex-1 px-4 pt-4 pb-28 relative overflow-hidden">
        {/* Globe watermark background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <GlobeWatermark className="w-[500px] h-[500px]" />
        </div>

        <div className="relative z-10">
          <CheckoutProgress onBack={() => router.back()} />

          <h1 className="text-2xl font-bold text-[#1D1D1B] mb-4">
            {content.cart.title}
          </h1>

          {/* Product */}
          <div className="border-b border-[#E5E5E5]">
            <ProductCard productType={productType} price={price} />
          </div>

          {/* Globe placeholder area */}
          <div className="my-6 flex justify-center">
            <div className="w-full max-w-[280px] aspect-square border border-[#E5E5E5] rounded-lg flex items-center justify-center bg-[#F9F9F9]">
              <GlobeWatermark className="w-24 h-24 opacity-20" />
            </div>
          </div>

          {/* Description */}
          <p className="text-[#239083] text-sm leading-relaxed mb-6 text-center">
            {content.cart.subtitle}
          </p>

          {/* Terms */}
          <div className="mb-4">
            <TermsCheckbox
              checked={termsAccepted}
              onChange={(checked) => {
                setTermsAccepted(checked);
                if (checked) setTermsError(false);
              }}
              error={termsError}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] px-4 py-4 flex items-center justify-between gap-4 z-20">
        <Button
          variant="primary"
          onClick={handlePayment}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {content.cart.payButton}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 4L6 8L10 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </Button>

        <div className="text-left flex-1">
          <p className="text-xs text-[#706F6F]">{content.cart.total}</p>
          <p className="text-lg font-bold text-[#1D1D1B]">{formattedTotal}</p>
        </div>
      </div>
    </div>
  );
}
