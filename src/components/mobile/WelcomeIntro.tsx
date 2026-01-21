"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { siteContent } from "@/content/he";
import { MobileHeader } from "./MobileHeader";

interface WelcomeIntroProps {
  onComplete: () => void;
}

/**
 * Image card configuration for the collage layout
 * Positions are based on Figma HP2 (375×812 viewport)
 * Converted to percentages for responsiveness
 */
interface ImageCard {
  id: string;
  src: string;
  alt: string;
  // Final position as percentage of content area
  left: string;
  top: string;
  // Size
  width: string;
  aspectRatio: string;
  // Starting position offset (in viewport units, will fly from edge)
  startX: number; // -100 = left edge, 100 = right edge
  startY: number; // -100 = top edge, 100 = bottom edge
}

const imageCards: ImageCard[] = [
  {
    // Top-Left: Plants/interior
    id: "top-left",
    src: "/hero/set1/1.jpg",
    alt: "Scandinavian interior",
    left: "4%",
    top: "6%",
    width: "39%",
    aspectRatio: "146/197",
    startX: -120,
    startY: -80,
  },
  {
    // Top-Right: Woman with bike
    id: "top-right",
    src: "/hero/set1/3.jpg",
    alt: "Woman traveling",
    left: "56%",
    top: "3%",
    width: "39%",
    aspectRatio: "146/197",
    startX: 120,
    startY: -80,
  },
  {
    // Middle-Center: Family selfie
    id: "middle-center",
    src: "/hero/set1/2.jpg",
    alt: "Happy family",
    left: "32%",
    top: "22%",
    width: "39%",
    aspectRatio: "146/116",
    startX: 0,
    startY: -120,
  },
  {
    // Bottom-Left: Yellow tram
    id: "bottom-left",
    src: "/hero/set1/6.jpg",
    alt: "Yellow tram",
    left: "13%",
    top: "63%",
    width: "39%",
    aspectRatio: "146/197",
    startX: -120,
    startY: 80,
  },
  {
    // Bottom-Center: Woman selfie
    id: "bottom-center",
    src: "/hero/set1/4.jpg",
    alt: "Woman selfie",
    left: "36%",
    top: "55%",
    width: "39%",
    aspectRatio: "146/116",
    startX: 0,
    startY: 120,
  },
  {
    // Bottom-Right: Couple with boxes
    id: "bottom-right",
    src: "/hero/set1/5.jpg",
    alt: "Couple moving",
    left: "64%",
    top: "68%",
    width: "39%",
    aspectRatio: "146/197",
    startX: 120,
    startY: 80,
  },
];

/**
 * Scroll-triggered animation:
 * 1. Text appears immediately
 * 2. User scrolls → cards fly in from edges
 * 3. When cards settle → navigate to homepage
 */
export const WelcomeIntro = ({ onComplete }: WelcomeIntroProps) => {
  const { mobile } = siteContent;
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  // Use scroll progress directly for immediate response
  const smoothProgress = scrollYProgress;

  // When scroll reaches the end, trigger completion
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value >= 0.95 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        // Small delay to let animation settle
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, onComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-40 bg-white overflow-y-auto"
    >
      {/* Fixed header */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-white">
        <MobileHeader />
      </div>

      {/* Scrollable content - 400vh for slower animation */}
      <div className="h-[400vh] relative">
        {/* Fixed content area that animates based on scroll */}
        <div className="fixed top-[52px] left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
          {/* Title text - visible immediately */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none"
            style={{ top: "46%" }}
          >
            <h1 className="text-[28px] font-medium text-[#1D1D1B] text-center leading-tight px-4">
              {mobile.welcomeIntro.title}
            </h1>
            <p className="text-[28px] font-medium text-[#1D1D1B] text-center leading-tight px-4">
              {mobile.welcomeIntro.subtitle}
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[#215388]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M19 12l-7 7-7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            <span className="text-sm text-[#706F6F] mt-2">גלול למטה</span>
          </motion.div>

          {/* Image cards - animate based on scroll */}
          {imageCards.map((card) => (
            <ScrollCard
              key={card.id}
              card={card}
              progress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Individual card component that animates based on scroll progress
 */
interface ScrollCardProps {
  card: ImageCard;
  progress: MotionValue<number>;
}

const ScrollCard = ({ card, progress }: ScrollCardProps) => {
  // Transform scroll progress to card position
  // Animation completes at 60% scroll so images are fully visible before the end
  // At progress 0: card is off-screen (but closer than before)
  // At progress 0.6: card reaches final position
  const x = useTransform(
    progress,
    [0, 0.6],
    [`${card.startX * 0.5}vw`, "0vw"]
  );

  const y = useTransform(
    progress,
    [0, 0.6],
    [`${card.startY * 0.5}vh`, "0vh"]
  );

  // Images become visible quickly (by 15% scroll)
  const opacity = useTransform(
    progress,
    [0, 0.15],
    [0, 1]
  );

  const scale = useTransform(
    progress,
    [0, 0.6],
    [0.85, 1]
  );

  return (
    <motion.div
      className="absolute rounded-[10px] overflow-hidden shadow-lg"
      style={{
        left: card.left,
        top: card.top,
        width: card.width,
        aspectRatio: card.aspectRatio,
        x,
        y,
        opacity,
        scale,
        // GPU acceleration
        willChange: "transform, opacity",
      }}
    >
      <Image
        src={card.src}
        alt={card.alt}
        fill
        className="object-cover"
        priority
      />
    </motion.div>
  );
};

