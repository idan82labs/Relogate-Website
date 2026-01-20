/**
 * Hero section image sets configuration.
 *
 * Position layout (left-to-right, top-to-bottom):
 * ┌─────────────┬─────────────┬─────────────┐
 * │      1      │      2      │             │
 * │   (short)   │   (short)   │             │
 * ├─────────────┼─────────────┤      3      │
 * │      4      │      5      │   (tall)    │
 * │   (short)   │   (tall)    │             │
 * ├─────────────┼─────────────┤             │
 * │      6      │      7      │             │
 * │   (tall)    │   (short)   │             │
 * └─────────────┴─────────────┴─────────────┘
 *    LEFT COL      MIDDLE COL    RIGHT COL
 */

export interface HeroImageSet {
  id: string;
  images: [string, string, string, string, string, string, string];
}

export const HERO_IMAGE_SETS: HeroImageSet[] = [
  {
    id: 'set1',
    images: [
      '/hero/set1/1.jpg',
      '/hero/set1/2.jpg',
      '/hero/set1/3.jpg',
      '/hero/set1/4.jpg',
      '/hero/set1/5.jpg',
      '/hero/set1/6.jpg',
      '/hero/set1/7.jpg',
    ],
  },
  {
    id: 'set2',
    images: [
      '/hero/set2/1.jpg',
      '/hero/set2/2.jpg',
      '/hero/set2/3.jpg',
      '/hero/set2/4.jpg',
      '/hero/set2/5.jpg',
      '/hero/set2/6.jpg',
      '/hero/set2/7.jpg',
    ],
  },
  {
    id: 'set3',
    images: [
      '/hero/set3/1.jpg',
      '/hero/set3/2.jpg',
      '/hero/set3/3.jpg',
      '/hero/set3/4.jpg',
      '/hero/set3/5.jpg',
      '/hero/set3/6.jpg',
      '/hero/set3/7.jpg',
    ],
  },
];

export const HERO_ANIMATION_CONFIG = {
  /** Time in ms each set is displayed before transitioning */
  intervalMs: 5000,
  /** Duration in ms for the crossfade transition */
  transitionDurationMs: 800,
} as const;

/** Card position aspect ratios (width:height) */
export const HERO_CARD_ASPECTS = {
  position1: 197 / 265,  // short
  position2: 200 / 162,  // short
  position3: 198 / 530,  // very tall (spans full height)
  position4: 199 / 158,  // short
  position5: 200 / 267,  // tall
  position6: 197 / 265,  // tall
  position7: 216 / 157,  // short
} as const;
