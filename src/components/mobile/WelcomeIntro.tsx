"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";

interface WelcomeIntroProps {
  onComplete: () => void;
}

export const WelcomeIntro = ({ onComplete }: WelcomeIntroProps) => {
  const { mobile } = siteContent;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform values for different images
  const image1X = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const image1Y = useTransform(scrollYProgress, [0, 0.5], [-50, 0]);
  const image1Scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);
  const image1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);

  const image2X = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const image2Y = useTransform(scrollYProgress, [0, 0.5], [-80, 0]);
  const image2Scale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1]);
  const image2Opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);

  const image3X = useTransform(scrollYProgress, [0.1, 0.6], [-80, 0]);
  const image3Y = useTransform(scrollYProgress, [0.1, 0.6], [100, 0]);
  const image3Scale = useTransform(scrollYProgress, [0.1, 0.6], [1.4, 1]);
  const image3Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6], [0, 1, 1]);

  const image4X = useTransform(scrollYProgress, [0.1, 0.6], [80, 0]);
  const image4Y = useTransform(scrollYProgress, [0.1, 0.6], [120, 0]);
  const image4Scale = useTransform(scrollYProgress, [0.1, 0.6], [1.2, 1]);
  const image4Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6], [0, 1, 1]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 1]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 1]);

  const finalOpacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value >= 0.95 && !isComplete) {
        setIsComplete(true);
        setTimeout(onComplete, 300);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, isComplete, onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <motion.div
        style={{ opacity: finalOpacity }}
        className="fixed inset-0 z-40 bg-white flex flex-col"
      >
        {/* Header with skip button */}
        <div className="absolute top-0 left-0 right-0 h-[52px] flex items-center justify-between px-4 z-50">
          <button
            onClick={handleSkip}
            className="text-[#706F6F] text-sm hover:text-[#1D1D1B] transition-colors"
          >
            {mobile.welcomeIntro.skip}
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
          <div className="relative w-full max-w-sm aspect-square">
            {/* Center text */}
            <motion.div
              style={{ opacity: textOpacity, scale: textScale }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              <h1 className="text-3xl font-medium text-[#1D1D1B] text-center">
                {mobile.welcomeIntro.title}
              </h1>
              <p className="text-3xl font-medium text-[#1D1D1B] text-center">
                {mobile.welcomeIntro.subtitle}
              </p>
            </motion.div>

            {/* Floating images */}
            {/* Top left */}
            <motion.div
              style={{
                x: image1X,
                y: image1Y,
                scale: image1Scale,
                opacity: image1Opacity,
              }}
              className="absolute -top-8 -left-8 w-32 h-40 rounded-[10px] overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#F9F6F1] via-[#C6C6C6] to-[#B2B2B2]" />
            </motion.div>

            {/* Top right */}
            <motion.div
              style={{
                x: image2X,
                y: image2Y,
                scale: image2Scale,
                opacity: image2Opacity,
              }}
              className="absolute -top-4 -right-8 w-36 h-44 rounded-[10px] overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#215388]/20 to-[#239083]/20" />
            </motion.div>

            {/* Bottom left */}
            <motion.div
              style={{
                x: image3X,
                y: image3Y,
                scale: image3Scale,
                opacity: image3Opacity,
              }}
              className="absolute -bottom-12 -left-4 w-40 h-48 rounded-[10px] overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#C6C6C6] to-[#F7F7F7]" />
            </motion.div>

            {/* Bottom right */}
            <motion.div
              style={{
                x: image4X,
                y: image4Y,
                scale: image4Scale,
                opacity: image4Opacity,
              }}
              className="absolute -bottom-8 -right-4 w-28 h-36 rounded-[10px] overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#F9F6F1] to-[#B2B2B2]" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#706F6F]"
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeIntro;
