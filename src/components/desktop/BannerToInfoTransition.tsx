"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";

// Teal checkmark SVG component
const TealCheckmark = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '18px' }}>
    <path d="M2 9L8 15L22 1" stroke="#239083" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BannerToInfoTransition = () => {
  const { greenBanner, info, hero } = siteContent;
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through this section
  // "start center" = animation begins when section top reaches viewport center (image is centered)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"]
  });

  // === ANIMATION PHASES ===
  // Phase 1 - VIEW:    0.00 - 0.60 → Image centered, no animation (long view time)
  // Phase 2 - ANIMATE: 0.60 - 0.95 → Image shrinks, text appears (slower animation)
  // Phase 3 - HOLD:    0.95 - 1.00 → Everything frozen

  // === IMAGE TRANSFORMS ===
  // START: Full width (1360px) → END: Small (552px)
  const imageWidth = useTransform(
    scrollYProgress,
    [0, 0.60, 0.68, 0.76, 0.84, 0.92, 0.95, 1],
    [1360, 1360, 1180, 1000, 800, 650, 552, 552]
  );

  // Height: 600px → 466px
  const imageHeight = useTransform(
    scrollYProgress,
    [0, 0.60, 0.68, 0.76, 0.84, 0.92, 0.95, 1],
    [600, 600, 570, 540, 510, 485, 466, 466]
  );

  // Border radius: starts at 20px (rounded), stays 20px throughout
  const borderTopRadius = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [20, 20, 20, 20, 20, 20, 20]
  );

  // === TEAL BANNER TRANSFORMS ===
  // Slides up and fades out during animation phase
  const tealBannerY = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [0, 0, -30, -70, -110, -120, -120]
  );
  const tealBannerOpacity = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [1, 1, 0.7, 0.35, 0.05, 0, 0]
  );

  // === TEXT OVERLAY ON IMAGE ===
  // Fades out during animation phase
  const imageTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [1, 1, 0.75, 0.4, 0.05, 0, 0]
  );
  const darkOverlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [0.3, 0.3, 0.22, 0.12, 0.02, 0, 0]
  );

  // === INFO TEXT COLUMN ===
  // Fades in and slides in during animation phase
  const infoOpacity = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [0, 0, 0.4, 0.75, 0.95, 1, 1]
  );
  const infoX = useTransform(
    scrollYProgress,
    [0, 0.60, 0.72, 0.84, 0.92, 0.95, 1],
    [200, 200, 120, 50, 10, 0, 0]
  );

  return (
    <section ref={sectionRef} className="relative bg-white mb-[150px]">
      {/* Scroll container - 1800px for longer view + slower animation */}
      <div className="h-[1800px]">
        {/* Sticky container - top-[88px] positions below header for centered appearance */}
        <div className="sticky top-[88px] pt-6 lg:pt-8">
          <div className="bg-white w-full">
            {/* Max-width container */}
            <div className="max-w-[1400px] mx-auto px-5">
              {/* Relative container for positioning */}
              <div className="relative" style={{ minHeight: '700px' }}>

                {/* IMAGE COLUMN - animates from left side to full width */}
                <motion.div
                  className="absolute left-0 top-0"
                  style={{ width: imageWidth }}
                >
                  {/* Teal banner strip */}
                  <motion.div
                    className="bg-[#239083] h-[80px] lg:h-[100px] rounded-t-[20px] flex items-center justify-center overflow-hidden"
                    style={{
                      y: tealBannerY,
                      opacity: tealBannerOpacity,
                      borderTopLeftRadius: borderTopRadius,
                      borderTopRightRadius: borderTopRadius,
                    }}
                  >
                    <p className="text-[#f7f7f7] text-[24px] lg:text-[36px] font-medium text-center px-4 whitespace-nowrap">
                      {hero.banner}
                    </p>
                  </motion.div>

                  {/* Image container - square top to connect with banner, rounded bottom */}
                  <motion.div
                    className="relative overflow-hidden rounded-b-[20px]"
                    style={{
                      height: imageHeight,
                    }}
                  >
                    <img
                      src="/banner-bg.jpg"
                      alt="Woman working on laptop"
                      className="w-full h-full object-cover"
                    />

                    {/* Dark overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black pointer-events-none"
                      style={{ opacity: darkOverlayOpacity }}
                    />

                    {/* Text overlay on image */}
                    <motion.div
                      className="absolute inset-0 z-10 flex items-center justify-end"
                      style={{ opacity: imageTextOpacity }}
                    >
                      <div className="px-6 lg:px-16">
                        <h2
                          className="text-xl lg:text-[42px] font-medium text-white leading-[1.3] max-w-[500px] text-right"
                          dir="rtl"
                        >
                          {greenBanner.title}
                        </h2>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* TEXT COLUMN - positioned to the right, fades in */}
                <motion.div
                  className="absolute right-0 top-[26px] w-[calc(100%-552px-94px)] max-w-[700px]"
                  style={{
                    opacity: infoOpacity,
                    x: infoX,
                  }}
                  dir="rtl"
                >
                  <p className="text-lg lg:text-xl text-[#1D1D1B] mb-5 lg:mb-6 leading-relaxed text-right">
                    {info.description}
                  </p>

                  {/* Checklist */}
                  <ul className="space-y-2 lg:space-y-3 mb-5 lg:mb-6">
                    {info.checklist.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 mt-1">
                          <TealCheckmark />
                        </span>
                        <span className="text-sm lg:text-base text-[#1D1D1B] text-right">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="primary" size="lg">
                    {info.cta}
                  </Button>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerToInfoTransition;
