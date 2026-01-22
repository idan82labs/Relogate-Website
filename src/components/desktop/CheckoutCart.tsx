'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/desktop/Header';
import { Footer } from '@/components/desktop/Footer';
import { Button, GlobeWatermark } from '@/components/shared';
import { ProductCard, TermsCheckbox, CheckoutProgress } from '@/components/checkout';
import { redirectToCheckout } from '@/services/payments';
import { siteContent } from '@/content/he';
import type { ProductType } from '@/types/payment';

interface CheckoutCartProps {
  productType: ProductType;
  price: number; // In agorot
  questionnaireResponseId?: string;
}

export function CheckoutCart({
  productType,
  price,
  questionnaireResponseId,
}: CheckoutCartProps) {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const content = siteContent.checkout;

  // Format price
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
    // If successful, user is redirected to Stripe
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Globe watermark - positioned on the left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 opacity-5 pointer-events-none">
          <GlobeWatermark className="w-[800px] h-[800px]" />
        </div>

        <div className="container mx-auto px-5 py-12 max-w-[1200px] relative z-10">
          <CheckoutProgress onBack={handleBack} />

          <div className="flex gap-16 items-start">
            {/* Left side - Globe placeholder area */}
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="w-[400px] h-[400px] border border-[#E5E5E5] rounded-lg flex items-center justify-center bg-[#F9F9F9]">
                <GlobeWatermark className="w-48 h-48 opacity-20" />
              </div>
            </div>

            {/* Right side - Cart */}
            <div className="w-[440px]">
              <h1 className="text-3xl font-bold text-[#1D1D1B] mb-6">
                {content.cart.title}
              </h1>

              {/* Product */}
              <div className="border-b border-[#E5E5E5]">
                <ProductCard
                  productType={productType}
                  price={price}
                />
              </div>

              {/* Description */}
              <p className="text-[#239083] text-base leading-relaxed mt-6 mb-6 text-right">
                {content.cart.subtitle}
              </p>

              {/* Terms */}
              <div className="mb-6">
                <TermsCheckbox
                  checked={termsAccepted}
                  onChange={(checked) => {
                    setTermsAccepted(checked);
                    if (checked) setTermsError(false);
                  }}
                  error={termsError}
                />
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Pay button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full max-w-[200px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
