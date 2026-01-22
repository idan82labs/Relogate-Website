'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckoutCart } from '@/components/desktop/CheckoutCart';
import { MobileCheckoutCart } from '@/components/mobile/MobileCheckoutCart';
import { AuthGuard } from '@/components/shared';
import type { ProductType } from '@/types/payment';

// Product prices in agorot (multiply by 100)
const PRODUCT_PRICES: Record<ProductType, number> = {
  relomatch_report: 500000, // 5,000 ILS
  consultation: 35000, // 350 ILS
};

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const productType = (searchParams.get('product') as ProductType) || 'relomatch_report';
  const questionnaireResponseId = searchParams.get('responseId') || undefined;

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Validate product type
  useEffect(() => {
    if (isClient && !['relomatch_report', 'consultation'].includes(productType)) {
      router.replace('/');
    }
  }, [productType, router, isClient]);

  // Show loading while determining layout
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full" />
      </div>
    );
  }

  const price = PRODUCT_PRICES[productType] || PRODUCT_PRICES.relomatch_report;

  return (
    <AuthGuard>
      {isMobile ? (
        <MobileCheckoutCart
          productType={productType}
          price={price}
          questionnaireResponseId={questionnaireResponseId}
        />
      ) : (
        <CheckoutCart
          productType={productType}
          price={price}
          questionnaireResponseId={questionnaireResponseId}
        />
      )}
    </AuthGuard>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin w-8 h-8 border-4 border-[#215388] border-t-transparent rounded-full" />
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
