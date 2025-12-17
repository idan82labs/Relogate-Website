"use client";

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
  opacity = 1,
}: GlobeWatermarkProps) => {
  const positionClasses = {
    left: "left-0 -translate-x-1/2",
    right: "right-0 translate-x-1/2",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${positionClasses[position]} ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <img
        src="/globe-watermark.svg"
        alt=""
        className="w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
};

export default GlobeWatermark;

