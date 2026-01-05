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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // === IMAGE TRANSFORMS ===
  // START: Full width (1360px) → END: Small (552px) - image shrinks as user scrolls
  const imageWidth = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.9, 1], 
    [1360, 1360, 1360, 1250, 1150, 1050, 920, 780, 650, 552, 552, 552]
  );
  
  // Height: 600px → 466px - image gets shorter as it shrinks
  const imageHeight = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.9, 1], 
    [600, 600, 600, 585, 565, 545, 520, 500, 480, 466, 466, 466]
  );
  
  // Border radius: 0 → 20px - corners round as image shrinks
  const borderTopRadius = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 1], 
    [0, 0, 4, 8, 13, 17, 20, 20]
  );

  // === TEAL BANNER TRANSFORMS ===
  // Slides up and fades out as user scrolls
  const tealBannerY = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.3, 0.45, 0.55, 0.65, 0.75, 0.85, 0.9, 1], 
    [0, 0, -10, -30, -50, -70, -90, -110, -120, -120]
  );
  const tealBannerOpacity = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 1], 
    [1, 1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1, 0, 0]
  );

  // === TEXT OVERLAY ON IMAGE ===
  // Fades out as image shrinks (visible at start, hidden at end)
  const imageTextOpacity = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 1], 
    [1, 1, 0.9, 0.75, 0.55, 0.35, 0.15, 0, 0]
  );
  const darkOverlayOpacity = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 1], 
    [0.3, 0.3, 0.24, 0.17, 0.1, 0.05, 0, 0]
  );

  // === INFO TEXT COLUMN ===
  // Fades in and slides in from right as image shrinks
  const infoOpacity = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65], 
    [0, 0.15, 0.35, 0.6, 0.85, 1, 1, 1]
  );
  const infoX = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 1], 
    [200, 200, 190, 160, 125, 90, 60, 35, 15, 0]
  );

  return (
    <section ref={sectionRef} className="relative bg-white mb-[150px]">
      {/* Scroll container - provides scroll distance for animation */}
      <div className="h-[1200px]">
        {/* Sticky container - stays fixed while scrolling through the section */}
        <div className="sticky top-0 pt-6 lg:pt-8 min-h-screen">
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

                  {/* Image container */}
                  <motion.div
                    className="relative overflow-hidden rounded-b-[20px]"
                    style={{
                      height: imageHeight,
                      borderTopLeftRadius: borderTopRadius,
                      borderTopRightRadius: borderTopRadius,
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

                {/* TEXT COLUMN - positioned to the right, fades out */}
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
