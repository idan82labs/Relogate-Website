"use client";

import { motion } from "framer-motion";

type StepIconType = "questionnaire" | "payment" | "report";

interface StepCardProps {
  icon: StepIconType;
  title: string;
  className?: string;
}

// Questionnaire icon - clipboard with pencil
const QuestionnaireIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="49"
    height="56"
    viewBox="0 0 49 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M43.75 7H35C35 5.14348 34.2625 3.36301 32.9497 2.05025C31.637 0.737498 29.8565 0 28 0H21C19.1435 0 17.363 0.737498 16.0503 2.05025C14.7375 3.36301 14 5.14348 14 7H5.25C3.85761 7 2.52226 7.55312 1.53769 8.53769C0.553124 9.52226 0 10.8576 0 12.25V50.75C0 52.1424 0.553124 53.4777 1.53769 54.4623C2.52226 55.4469 3.85761 56 5.25 56H43.75C45.1424 56 46.4777 55.4469 47.4623 54.4623C48.4469 53.4777 49 52.1424 49 50.75V12.25C49 10.8576 48.4469 9.52226 47.4623 8.53769C46.4777 7.55312 45.1424 7 43.75 7ZM21 3.5H28C29.0609 3.5 30.0783 3.92143 30.8284 4.67157C31.5786 5.42172 32 6.43913 32 7.5V10.5H17V7.5C17 6.43913 17.4214 5.42172 18.1716 4.67157C18.9217 3.92143 19.9391 3.5 21 3.5ZM45.5 50.75C45.5 51.2141 45.3156 51.6592 44.9874 51.9874C44.6592 52.3156 44.2141 52.5 43.75 52.5H5.25C4.78587 52.5 4.34075 52.3156 4.01256 51.9874C3.68437 51.6592 3.5 51.2141 3.5 50.75V12.25C3.5 11.7859 3.68437 11.3408 4.01256 11.0126C4.34075 10.6844 4.78587 10.5 5.25 10.5H14V14C14 14.4641 14.1844 14.9092 14.5126 15.2374C14.8408 15.5656 15.2859 15.75 15.75 15.75H33.25C33.7141 15.75 34.1592 15.5656 34.4874 15.2374C34.8156 14.9092 35 14.4641 35 14V10.5H43.75C44.2141 10.5 44.6592 10.6844 44.9874 11.0126C45.3156 11.3408 45.5 11.7859 45.5 12.25V50.75Z"
      fill="currentColor"
    />
    <path
      d="M12.25 28H36.75C37.2141 28 37.6592 27.8156 37.9874 27.4874C38.3156 27.1592 38.5 26.7141 38.5 26.25C38.5 25.7859 38.3156 25.3408 37.9874 25.0126C37.6592 24.6844 37.2141 24.5 36.75 24.5H12.25C11.7859 24.5 11.3408 24.6844 11.0126 25.0126C10.6844 25.3408 10.5 25.7859 10.5 26.25C10.5 26.7141 10.6844 27.1592 11.0126 27.4874C11.3408 27.8156 11.7859 28 12.25 28Z"
      fill="currentColor"
    />
    <path
      d="M12.25 38.5H36.75C37.2141 38.5 37.6592 38.3156 37.9874 37.9874C38.3156 37.6592 38.5 37.2141 38.5 36.75C38.5 36.2859 38.3156 35.8408 37.9874 35.0126C37.6592 34.6844 37.2141 34.5 36.75 34.5H12.25C11.7859 34.5 11.3408 34.6844 11.0126 35.0126C10.6844 35.3408 10.5 35.7859 10.5 36.25C10.5 36.7141 10.6844 37.1592 11.0126 37.4874C11.3408 37.8156 11.7859 38.5 12.25 38.5Z"
      fill="currentColor"
    />
  </svg>
);

// Payment icon - credit card
const PaymentIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="63"
    height="50"
    viewBox="0 0 63 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M56.7 0H6.3C2.82 0 0 2.82 0 6.3V43.7C0 47.18 2.82 50 6.3 50H56.7C60.18 50 63 47.18 63 43.7V6.3C63 2.82 60.18 0 56.7 0ZM59.5 43.7C59.5 45.25 58.25 46.5 56.7 46.5H6.3C4.75 46.5 3.5 45.25 3.5 43.7V21H59.5V43.7ZM59.5 14H3.5V6.3C3.5 4.75 4.75 3.5 6.3 3.5H56.7C58.25 3.5 59.5 4.75 59.5 6.3V14Z"
      fill="currentColor"
    />
    <path
      d="M14 35H28C29.1 35 30 34.1 30 33C30 31.9 29.1 31 28 31H14C12.9 31 12 31.9 12 33C12 34.1 12.9 35 14 35Z"
      fill="currentColor"
    />
    <path
      d="M35 35H42C43.1 35 44 34.1 44 33C44 31.9 43.1 31 42 31H35C33.9 31 33 31.9 33 33C33 34.1 33.9 35 35 35Z"
      fill="currentColor"
    />
  </svg>
);

// Report icon - document with checkmark
const ReportIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="44"
    height="56"
    viewBox="0 0 44 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M43.4 13.3L30.7 0.6C30.4 0.2 29.9 0 29.4 0H5C2.2 0 0 2.2 0 5V51C0 53.8 2.2 56 5 56H39C41.8 56 44 53.8 44 51V14.6C44 14.1 43.8 13.6 43.4 13.3ZM30.5 5.3L38.7 13.5H32C31.2 13.5 30.5 12.8 30.5 12V5.3ZM40.5 51C40.5 51.8 39.8 52.5 39 52.5H5C4.2 52.5 3.5 51.8 3.5 51V5C3.5 4.2 4.2 3.5 5 3.5H27V12C27 14.8 29.2 17 32 17H40.5V51Z"
      fill="currentColor"
    />
    <path
      d="M19.2 38.5L13.5 32.8C12.8 32.1 11.7 32.1 11 32.8C10.3 33.5 10.3 34.6 11 35.3L18 42.3C18.3 42.6 18.8 42.8 19.2 42.8C19.7 42.8 20.1 42.6 20.5 42.3L33 29.8C33.7 29.1 33.7 28 33 27.3C32.3 26.6 31.2 26.6 30.5 27.3L19.2 38.5Z"
      fill="currentColor"
    />
  </svg>
);

const iconComponents: Record<StepIconType, React.FC<{ className?: string }>> = {
  questionnaire: QuestionnaireIcon,
  payment: PaymentIcon,
  report: ReportIcon,
};

/**
 * StepCard - Card component for "How It Works" steps
 * Features hover state with blue background and white text
 */
export const StepCard = ({ icon, title, className = "" }: StepCardProps) => {
  const IconComponent = iconComponents[icon];

  return (
    <motion.div
      className={`
        bg-[#f7f7f7] rounded-[20px] p-8
        flex flex-col items-center justify-center
        cursor-pointer transition-colors duration-300
        group hover:bg-[#215388]
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div className="mb-6 text-[#215388] group-hover:text-white transition-colors duration-300">
        <IconComponent className="w-12 h-14 lg:w-16 lg:h-16" />
      </div>

      {/* Title */}
      <h3 className="text-[24px] lg:text-[36px] font-medium text-black group-hover:text-white text-center leading-tight whitespace-pre-line transition-colors duration-300">
        {title}
      </h3>
    </motion.div>
  );
};

export default StepCard;
