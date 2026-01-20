"use client";

import { useState, useEffect } from 'react';
import { HERO_IMAGE_SETS, HERO_ANIMATION_CONFIG } from '@/data/hero-images';

/**
 * Hook to manage hero image set cycling animation.
 * Automatically cycles through image sets at configured intervals.
 */
export function useHeroAnimation() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % HERO_IMAGE_SETS.length);
    }, HERO_ANIMATION_CONFIG.intervalMs);

    return () => clearInterval(interval);
  }, []);

  return {
    currentSetIndex,
    totalSets: HERO_IMAGE_SETS.length,
    currentSet: HERO_IMAGE_SETS[currentSetIndex],
  };
}
