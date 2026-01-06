"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
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
  // Position as percentage of content area (below header)
  left: string;
  top: string;
  // Size
  width: string;
  aspectRatio: string;
  // Animation direction multipliers (-1 = left/top, 1 = right/bottom, 0 = center)
  flyFromX: number;
  flyFromY: number;
}

const imageCards: ImageCard[] = [
  {
    // Top-Left: Manhattan & Brooklyn subway sign
    id: "top-left",
    src: "/hero-3.jpg",
    alt: "Manhattan & Brooklyn",
    left: "4%",
    top: "6%",
    width: "39%",
    aspectRatio: "146/197",
    flyFromX: -1,
    flyFromY: -0.5,
  },
  {
    // Top-Right: Couple in Florence
    id: "top-right",
    src: "/hero-1.jpg",
    alt: "Couple traveling",
    left: "56%",
    top: "3%",
    width: "39%",
    aspectRatio: "146/197",
    flyFromX: 1,
    flyFromY: -0.5,
  },
  {
    // Middle-Center: Amsterdam bikes
    id: "middle-center",
    src: "/hero-2.jpg",
    alt: "Amsterdam",
    left: "32%",
    top: "22%",
    width: "39%",
    aspectRatio: "146/116",
    flyFromX: 0,
    flyFromY: -1,
  },
  {
    // Bottom-Left: Elderly woman with dog
    id: "bottom-left",
    src: "/hero-7.jpg",
    alt: "Senior with pet",
    left: "13%",
    top: "63%",
    width: "39%",
    aspectRatio: "146/197",
    flyFromX: -1,
    flyFromY: 0.5,
  },
  {
    // Bottom-Center: Family photo
    id: "bottom-center",
    src: "/hero-5.jpg",
    alt: "Happy family",
    left: "36%",
    top: "55%",
    width: "39%",
    aspectRatio: "146/116",
    flyFromX: 0,
    flyFromY: 1,
  },
  {
    // Bottom-Right: Mother & child at beach
    id: "bottom-right",
    src: "/hero-4.jpg",
    alt: "Mother and child",
    left: "64%",
    top: "68%",
    width: "39%",
    aspectRatio: "146/197",
    flyFromX: 1,
    flyFromY: 0.5,
  },
];

/**
 * Animation Configuration
 *
 * Timeline:
 * 0.0s  - Component mounts
 * 0.5s  - First card starts flying in
 * 0.7s  - Second card starts (stagger: 0.2s)
 * 0.9s  - Third card starts
 * 1.1s  - Fourth card starts
 * 1.3s  - Fifth card starts
 * 1.5s  - Sixth card starts
 * 1.8s  - Text starts appearing
 * 2.6s  - Text fully visible, cards settled
 * 5.0s  - Auto-transition to HP3
 *
 * User has ~2.4 seconds to read the text
 *
 * Performance Notes:
 * - Using pixel values instead of viewport units (vw/vh) for GPU acceleration
 * - Using tween with easeOut instead of spring to avoid micro-jitters
 * - transform: translateZ(0) forces GPU layer creation
 * - will-change: transform hints browser to optimize
 */

// Container variants for staggered children animation
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5,
    },
  },
};

/**
 * Creates card variants with pixel-based offsets for smooth GPU-accelerated animation.
 * Using tween animation instead of spring to avoid micro-jitters.
 */
const createCardVariants = (viewportWidth: number, viewportHeight: number): Variants => ({
  hidden: (custom: { flyFromX: number; flyFromY: number }) => ({
    x: custom.flyFromX * viewportWidth,
    y: custom.flyFromY * viewportHeight,
    opacity: 0,
    scale: 0.9,
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      // Tween with easeOut is smoother than spring for fly-in animations
      type: "tween",
      duration: 1.0,
      ease: [0.25, 0.1, 0.25, 1], // CSS ease equivalent - very smooth
    },
  },
});

// Text variants - appears after cards with smooth fade
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,                    // Slide up slightly for more natural feel
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.8,             // After cards have mostly settled (was 1.2)
      duration: 0.8,          // Slower fade-in (was 0.6)
      ease: "easeOut",
    },
  },
};

// Total animation duration before auto-transition (in ms)
// Gives user ~2.4 seconds to read the text after it appears
const AUTO_TRANSITION_DELAY = 5000;

export const WelcomeIntro = ({ onComplete }: WelcomeIntroProps) => {
  const { mobile } = siteContent;

  // Get viewport dimensions for pixel-based animations (avoids viewport unit jank)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Calculate viewport size on mount for GPU-accelerated pixel animations
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Auto-transition to next screen after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, AUTO_TRANSITION_DELAY);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Create card variants with actual pixel values (not viewport units)
  const cardVariants = createCardVariants(viewportSize.width, viewportSize.height);

  // Don't render animation until viewport size is known
  const isReady = viewportSize.width > 0;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-40 bg-white flex flex-col"
    >
      {/* Header with bottom border */}
      <MobileHeader />

      {/* Main content area - no overflow hidden to allow fly-in animation */}
      <motion.div
        className="flex-1 relative"
        variants={containerVariants}
        initial="hidden"
        animate={isReady ? "visible" : "hidden"}
      >
        {/* Image cards with fly-in animation */}
        {imageCards.map((card) => (
          <motion.div
            key={card.id}
            custom={{ flyFromX: card.flyFromX, flyFromY: card.flyFromY }}
            variants={cardVariants}
            className="absolute rounded-[10px] overflow-hidden"
            style={{
              left: card.left,
              top: card.top,
              width: card.width,
              aspectRatio: card.aspectRatio,
              // GPU acceleration hints
              backgroundColor: "transparent",
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
              // Force GPU layer creation
              transform: "translateZ(0)",
            }}
          >
            <img
              src={card.src}
              alt={card.alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        ))}

        {/* Center title text - positioned in gap between top and bottom cards */}
        {/* Figma: text at Y=365 on 812px screen, header=52px, so ~41% of content area */}
        {/* Gap is between middle card bottom (~38%) and bottom cards top (~55%) */}
        {/* Center of gap: ~46% */}
        <motion.div
          variants={textVariants}
          className="absolute left-0 right-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          style={{
            top: "46%",
          }}
        >
          <h1 className="text-[28px] font-medium text-[#1D1D1B] text-center leading-tight px-4">
            {mobile.welcomeIntro.title}
          </h1>
          <p className="text-[28px] font-medium text-[#1D1D1B] text-center leading-tight px-4">
            {mobile.welcomeIntro.subtitle}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeIntro;
