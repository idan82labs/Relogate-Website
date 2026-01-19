"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark } from "@/components/shared";
import { useAuth } from "@/contexts";

export const Hero = () => {
  const router = useRouter();
  const { hero } = siteContent;
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

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
            {/* 3-column masonry layout matching Figma (reversed for RTL) */}
            <div className="flex gap-3">
              {/* Column 3 - Right (appears first in RTL) */}
              <div className="flex flex-col gap-3 flex-1">
                {/* Couple - tall */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[198/265]">
                  <Image
                    src="/hero-1.jpg"
                    alt="Happy couple"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Column 2 - Middle */}
              <div className="flex flex-col gap-3 flex-1">
                {/* Amsterdam bikes - short */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[200/162]">
                  <Image
                    src="/hero-2.jpg"
                    alt="Amsterdam"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Mother and son - tall */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[200/267]">
                  <Image
                    src="/hero-4.jpg"
                    alt="Mother and son"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* London bus - short */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[216/157]">
                  <Image
                    src="/hero-6.jpg"
                    alt="London"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Column 1 - Left (appears last in RTL) */}
              <div className="flex flex-col gap-3 flex-1">
                {/* Manhattan subway - tall */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[197/265]">
                  <Image
                    src="/hero-3.jpg"
                    alt="Manhattan & Brooklyn"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Family with kids - short */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[199/158]">
                  <Image
                    src="/hero-5.jpg"
                    alt="Happy family"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Elderly with dog - tall */}
                <div className="relative rounded-[10px] overflow-hidden aspect-[197/265]">
                  <Image
                    src="/hero-7.jpg"
                    alt="Senior with pet"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative globe */}
      <GlobeWatermark position="center" size={480} />
    </section>
  );
};

export default Hero;
