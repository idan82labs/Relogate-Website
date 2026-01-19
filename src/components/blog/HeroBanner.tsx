"use client";

import { motion } from "framer-motion";
import type { HeroBannerProps } from "@/types/blog";

/**
 * HeroBanner - Full-width hero section with background image and title
 *
 * Figma Specifications:
 * - Desktop: 1440px width, 500px height, 20px border-radius
 * - Mobile: Full width, 300px height, no border-radius
 */
export function HeroBanner({ title, variant, backgroundImage }: HeroBannerProps) {
  const defaultBg = "/images/blog/hero-bg.jpg";
  const bgImage = backgroundImage || defaultBg;

  if (variant === "mobile") {
    return (
      <motion.section
        className="relative w-full h-[300px] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

        {/* Title */}
        <motion.h1
          className="relative z-10 text-[32px] font-medium text-white text-center leading-[1.2] px-6 whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {title}
        </motion.h1>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="relative w-full max-w-[1440px] mx-auto h-[500px] flex items-center justify-center overflow-hidden rounded-[20px] my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />

      {/* Title */}
      <motion.h1
        className="relative z-10 text-[65px] font-medium text-white text-center leading-[61px] whitespace-pre-line"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h1>
    </motion.section>
  );
}
