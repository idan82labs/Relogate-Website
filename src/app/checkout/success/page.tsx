'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/desktop/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Footer } from '@/components/desktop/Footer';
import { Button, GlobeWatermark } from '@/components/shared';
import { CheckoutProgress } from '@/components/checkout';
import { siteContent } from '@/content/he';
import type { ProductType } from '@/types/payment';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const sessionId = searchParams.get('session_id');
  const productParam = searchParams.get('product') as ProductType | null;

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const content = siteContent.checkout.success;

  // Default to report if no product specified
  const productType: ProductType = productParam || 'relomatch_report';
  const isReport = productType === 'relomatch_report';
  const productContent = isReport ? content.report : content.consultation;

  // Generate a mock order number from session ID or random
  const orderNumber = sessionId
    ? sessionId.slice(-8).toUpperCase()
    : Math.random().toString(36).substring(2, 8).toUpperCase();

  const handlePrimaryCta = () => {
    if (productType === 'relomatch_report') {
      router.push('/personal-area');
    } else {
      router.push('/');
    }
  };

  const handleSecondaryCta = () => {
    router.push('/');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full" />
      </div>
    );
  }

  const HeaderComponent = isMobile ? MobileHeader : Header;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderComponent />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Globe watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <GlobeWatermark className="w-[600px] h-[600px]" />
        </div>

        <div className="w-full max-w-[600px] text-center relative z-10">
          {/* Progress bar */}
          <div className="mb-8">
            <CheckoutProgress showBackButton={false} />
          </div>

          {/* Success title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl lg:text-4xl font-bold text-[#239083] mb-4"
          >
            {content.title}
          </motion.h1>

          {/* Order number */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base lg:text-lg text-[#1D1D1B] mb-6"
          >
            {content.orderNumber} {orderNumber}
          </motion.p>

          {/* Divider */}
          <div className="w-full h-px bg-[#E5E5E5] my-6" />

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#706F6F] text-base leading-relaxed mb-8"
          >
            {productContent.message}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handlePrimaryCta}
              className="w-full"
            >
              {productContent.primaryCta}
            </Button>

            {/* Show secondary CTA on mobile for report product */}
            {isMobile && isReport && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleSecondaryCta}
                className="w-full"
              >
                {content.report.secondaryCta}
              </Button>
            )}
          </motion.div>
        </div>
      </main>

      {!isMobile && <Footer />}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
