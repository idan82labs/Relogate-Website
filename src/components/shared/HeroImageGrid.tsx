"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_IMAGE_SETS, HERO_ANIMATION_CONFIG } from "@/data/hero-images";

interface HeroImageGridProps {
  currentSetIndex: number;
  variant?: "desktop" | "mobile";
}

/**
 * Hero image grid with crossfade animation between sets.
 *
 * Position layout (left-to-right, top-to-bottom):
 * ┌─────────────┬─────────────┬─────────────┐
 * │      1      │      2      │             │
 * ├─────────────┼─────────────┤      3      │
 * │      4      │      5      │             │
 * ├─────────────┼─────────────┤             │
 * │      6      │      7      │             │
 * └─────────────┴─────────────┴─────────────┘
 *    LEFT COL      MIDDLE COL    RIGHT COL
 */
export const HeroImageGrid = ({
  currentSetIndex,
  variant = "desktop",
}: HeroImageGridProps) => {
  const transitionDuration = HERO_ANIMATION_CONFIG.transitionDurationMs / 1000;

  const isDesktop = variant === "desktop";
  const gap = isDesktop ? "gap-3" : "gap-2";
  const borderRadius = isDesktop ? "rounded-[10px]" : "rounded-[8px]";

  // Aspect ratios from Figma
  // Desktop: portrait=197:265, landscape=197:157, position5=200:267
  // Mobile: portrait=146:197, landscape=146:116
  // Position 3 is a standard portrait card (same as positions 1 and 6)
  const aspects = isDesktop
    ? {
        portrait: "aspect-[197/265]",
        landscape: "aspect-[197/157]",
        position3: "aspect-[197/265]",
        position5: "aspect-[200/267]",
      }
    : {
        portrait: "aspect-[146/197]",
        landscape: "aspect-[146/116]",
        position3: "aspect-[146/197]",
        position5: "aspect-[146/197]",
      };

  return (
    <div className={`flex ${gap}`} dir="ltr">
      {/* Column 1 - Left */}
      <div className={`flex flex-col ${gap} flex-1`}>
        {/* Position 1 - portrait (tall) */}
        <ImageCard
          position={1}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.portrait}
          borderRadius={borderRadius}
        />
        {/* Position 4 - landscape (short) */}
        <ImageCard
          position={4}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.landscape}
          borderRadius={borderRadius}
        />
        {/* Position 6 - portrait (tall) */}
        <ImageCard
          position={6}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.portrait}
          borderRadius={borderRadius}
        />
      </div>

      {/* Column 2 - Middle */}
      <div className={`flex flex-col ${gap} flex-1`}>
        {/* Position 2 - landscape (short) */}
        <ImageCard
          position={2}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.landscape}
          borderRadius={borderRadius}
        />
        {/* Position 5 - portrait (tall) */}
        <ImageCard
          position={5}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.position5}
          borderRadius={borderRadius}
        />
        {/* Position 7 - landscape (short) */}
        <ImageCard
          position={7}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.landscape}
          borderRadius={borderRadius}
        />
      </div>

      {/* Column 3 - Right */}
      <div className={`flex flex-col ${gap} flex-1`}>
        {/* Position 3 - very tall (spans full grid height) */}
        <ImageCard
          position={3}
          currentSetIndex={currentSetIndex}
          transitionDuration={transitionDuration}
          aspectRatio={aspects.position3}
          borderRadius={borderRadius}
        />
      </div>
    </div>
  );
};

interface ImageCardProps {
  position: number;
  currentSetIndex: number;
  transitionDuration: number;
  aspectRatio: string;
  borderRadius: string;
}

/**
 * Single image card with stacked images for crossfade effect.
 * All sets are rendered stacked, with only the current set visible.
 */
const ImageCard = ({
  position,
  currentSetIndex,
  transitionDuration,
  aspectRatio,
  borderRadius,
}: ImageCardProps) => {
  return (
    <div className={`relative ${borderRadius} overflow-hidden ${aspectRatio}`}>
      {HERO_IMAGE_SETS.map((set, setIndex) => (
        <motion.div
          key={set.id}
          className={setIndex === 0 ? "relative w-full h-full" : "absolute inset-0"}
          initial={false}
          animate={{ opacity: currentSetIndex === setIndex ? 1 : 0 }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
        >
          <Image
            src={set.images[position - 1]}
            alt=""
            fill
            className="object-cover"
            sizes={
              position === 3
                ? "(max-width: 1024px) 33vw, 25vw"
                : "(max-width: 1024px) 33vw, 20vw"
            }
            quality={85}
            priority={setIndex === 0}
          />
        </motion.div>
      ))}
    </div>
  );
};
