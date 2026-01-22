'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/desktop/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { Footer } from '@/components/desktop/Footer';
import { Button, GlobeWatermark } from '@/components/shared';
import { siteContent } from '@/content/he';

export default function CheckoutCancelPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const content = siteContent.checkout.cancel;

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

        <div className="w-full max-w-[500px] text-center relative z-10">
          {/* Warning icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-8 rounded-full bg-yellow-50 flex items-center justify-center"
          >
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-500" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9V13M12 17H12.01M4.98207 19H19.0179C20.5615 19 21.5233 17.3256 20.7455 16.0077L13.7276 4.01544C12.9558 2.70846 11.0442 2.70846 10.2724 4.01544L3.25452 16.0077C2.47675 17.3256 3.43849 19 4.98207 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl lg:text-3xl font-bold text-[#1D1D1B] mb-4"
          >
            {content.title}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#706F6F] text-base mb-8"
          >
            {content.message}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.back()}
              className="w-full max-w-[280px] mx-auto"
            >
              {content.retryCta}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/')}
              className="w-full max-w-[280px] mx-auto"
            >
              {content.homeCta}
            </Button>
          </motion.div>
        </div>
      </main>

      {!isMobile && <Footer />}
    </div>
  );
}
