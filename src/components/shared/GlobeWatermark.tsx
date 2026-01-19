"use client";

import Image from "next/image";

interface GlobeWatermarkProps {
  position?: "left" | "right" | "center";
  size?: number;
  className?: string;
  opacity?: number;
}

export const GlobeWatermark = ({
  position = "left",
  size = 480,
  className = "",
  opacity = 0.2,
}: GlobeWatermarkProps) => {
  const positionClasses = {
    left: "left-0 -translate-x-1/2",
    right: "right-0 translate-x-1/2",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 ${positionClasses[position]} ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <Image
        src="/globe-watermark.svg"
        alt=""
        fill
        className="object-contain"
        aria-hidden="true"
        priority={false}
      />
    </div>
  );
};

export default GlobeWatermark;

