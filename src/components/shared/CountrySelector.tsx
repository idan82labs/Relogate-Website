"use client";

import { motion } from "framer-motion";

interface CountryOption {
  id: string;
  label: string;
}

interface CountrySelectorProps {
  options: CountryOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

/**
 * CountrySelector - Multi-select button grid for country preferences
 * Displays options in a 2x2 grid with toggle selection
 */
export const CountrySelector = ({
  options,
  selected,
  onChange,
  multiSelect = true,
  className = "",
}: CountrySelectorProps) => {
  const handleSelect = (id: string) => {
    if (multiSelect) {
      // Special handling for "any" option - clears other selections
      if (id === "any") {
        onChange(selected.includes("any") ? [] : ["any"]);
        return;
      }

      // If selecting a specific country, remove "any" from selection
      const withoutAny = selected.filter((s) => s !== "any");

      if (withoutAny.includes(id)) {
        onChange(withoutAny.filter((s) => s !== id));
      } else {
        onChange([...withoutAny, id]);
      }
    } else {
      onChange([id]);
    }
  };

  const isSelected = (id: string) => selected.includes(id);

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {options.map((option) => (
        <motion.button
          key={option.id}
          type="button"
          onClick={() => handleSelect(option.id)}
          className={`
            h-[50px] rounded-[10px] font-medium text-[16px]
            transition-colors duration-200
            ${
              isSelected(option.id)
                ? "bg-[#215388] text-white border-2 border-[#215388]"
                : "bg-white text-[#1D1D1B] border-2 border-[#C6C6C6] hover:border-[#215388]"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
};

export default CountrySelector;
