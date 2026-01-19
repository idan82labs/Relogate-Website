"use client";

import { motion } from "framer-motion";
import { MatchScoreCircle } from "./MatchScoreCircle";

interface CountryCardProps {
  name: string;
  matchScore: number;
  image: string;
  isSelected?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  visaType?: string;
  matchReasons?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * CountryCard - Card displaying a country recommendation with match score
 * Has two states: collapsed (just image and name) and expanded (with details)
 */
export const CountryCard = ({
  name,
  matchScore,
  image,
  isSelected = false,
  isExpanded = false,
  onClick,
  visaType,
  matchReasons = [],
  className = "",
  size = "md",
}: CountryCardProps) => {
  // Size configurations
  const sizeConfig = {
    sm: { height: "h-[280px]", width: "w-[171px]", nameSize: "text-[24px]", scoreSize: "sm" as const },
    md: { height: "h-[360px]", width: "w-[228px]", nameSize: "text-[36px]", scoreSize: "md" as const },
    lg: { height: "h-[406px]", width: "w-[228px]", nameSize: "text-[36px]", scoreSize: "md" as const },
  };

  const config = sizeConfig[size];

  // Expanded card (selected state with overlay and details)
  if (isExpanded && isSelected) {
    return (
      <motion.div
        className={`relative rounded-[20px] overflow-hidden cursor-pointer ${config.height} ${className}`}
        onClick={onClick}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        style={{ minWidth: size === "lg" ? "454px" : "261px" }}
      >
        {/* Background image - dynamic URL from API, domain unknown at build time */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-[rgba(33,83,136,0.9)]" />
        {/* Content */}
        <div className="absolute inset-0 p-5 text-white text-right flex flex-col">
          <h3 className={`font-medium ${config.nameSize} mb-2`}>{name}</h3>
          <div className="text-[14px] lg:text-[18px] leading-relaxed">
            <p className="mb-1">
              <span>מסלול ויזה: </span>
              <span>{visaType}</span>
            </p>
            <p className="mb-1">
              <span>ציון התאמה כללי: </span>
              <span>{matchScore}%</span>
            </p>
            {matchReasons.length > 0 && (
              <>
                <p className="mb-1">סיבות התאמה:</p>
                <ul className="list-disc list-inside mr-2">
                  {matchReasons.map((reason, index) => (
                    <li key={index} className="text-[12px] lg:text-[14px] mb-1 leading-snug">
                      {reason}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Collapsed card (default state)
  return (
    <motion.div
      className={`relative rounded-[20px] overflow-hidden cursor-pointer ${config.height} ${config.width} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background image - dynamic URL from API, domain unknown at build time */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(29,29,27,0.6)] via-transparent to-transparent" />
      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-right">
        <h3 className={`font-medium ${config.nameSize} mb-1`}>{name}</h3>
        <p className="text-[14px] lg:text-[18px]">
          ציון התאמה: {matchScore}%
        </p>
      </div>
      {/* Match score circle */}
      <div className="absolute top-3 left-3">
        <MatchScoreCircle score={matchScore} size={config.scoreSize} />
      </div>
    </motion.div>
  );
};

export default CountryCard;
