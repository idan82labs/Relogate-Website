"use client";

import { motion } from "framer-motion";

interface MatchScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * MatchScoreCircle - Circular progress indicator showing match percentage
 * Displays a score with animated ring progress
 */
export const MatchScoreCircle = ({
  score,
  size = "md",
  className = "",
}: MatchScoreCircleProps) => {
  // Size configurations
  const sizeConfig = {
    sm: { diameter: 40, strokeWidth: 3, fontSize: "text-[10px]" },
    md: { diameter: 56, strokeWidth: 4, fontSize: "text-[14px]" },
    lg: { diameter: 72, strokeWidth: 5, fontSize: "text-[18px]" },
  };

  const { diameter, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: diameter, height: diameter }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Score text */}
      <span
        className={`absolute ${fontSize} font-medium text-white`}
      >
        {score}%
      </span>
    </div>
  );
};

export default MatchScoreCircle;
