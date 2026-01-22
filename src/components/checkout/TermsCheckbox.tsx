'use client';

import { motion } from 'framer-motion';
import { siteContent } from '@/content/he';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const content = siteContent.checkout.cart;

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          className={`w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${
            checked
              ? 'bg-[#239083] border-[#239083]'
              : error
              ? 'border-red-500 bg-red-50'
              : 'border-[#C6C6C6] bg-white group-hover:border-[#215388]'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
      <span className={`text-sm leading-relaxed ${error ? 'text-red-600' : 'text-[#706F6F]'}`}>
        {content.termsCheckbox}
      </span>
    </label>
  );
}
