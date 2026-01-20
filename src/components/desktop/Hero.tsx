"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark, HeroImageGrid } from "@/components/shared";
import { useAuth } from "@/contexts";
import { useHeroAnimation } from "@/hooks";

export const Hero = () => {
  const router = useRouter();
  const { hero } = siteContent;
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const { currentSetIndex } = useHeroAnimation();

  const handleCtaClick = () => {
    if (hasCompletedOnboarding) {
      // User completed questionnaire - go to results
      router.push("/questionnaire/results");
    } else if (isAuthenticated) {
      // User is logged in but hasn't completed - go to questionnaire
      router.push("/questionnaire");
    } else {
      // User not logged in - redirect to login first, then to questionnaire
      sessionStorage.setItem("redirectAfterLogin", "/questionnaire");
      router.push("/login");
    }
  };

  const ctaText = hasCompletedOnboarding ? hero.ctaViewResults : hero.cta;

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Content */}
      <div className="container py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Right side for RTL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <h1 className="text-5xl lg:text-[65px] font-medium text-[#1D1D1B] leading-tight mb-8">
              {hero.title}
              <br />
              {hero.subtitle}
            </h1>
            <Button variant="primary" size="lg" onClick={handleCtaClick}>
              {ctaText}
            </Button>
          </motion.div>

          {/* Image Grid - Left side for RTL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <HeroImageGrid currentSetIndex={currentSetIndex} variant="desktop" />
          </motion.div>
        </div>
      </div>

      {/* Decorative globe */}
      <GlobeWatermark position="center" size={480} />
    </section>
  );
};

