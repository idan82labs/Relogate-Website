"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) => {
  return (
    <div className="border-b border-[#C6C6C6]">
      <button
        className="w-full py-4 flex items-center justify-between text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215388] focus-visible:ring-inset"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-lg text-[#1D1D1B]">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="mr-4 text-[#1D1D1B]"
        >
          {/* Diagonal arrow: points bottom-left when closed, top-right when open */}
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 4L4 13M4 13H11M4 13V6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-base text-[#1D1D1B]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: Array<{ question: string; answer: string }>;
  allowMultiple?: boolean;
}

export const Accordion = ({ items, allowMultiple = false }: AccordionProps) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]); // All items closed by default

  const handleToggle = useCallback(
    (index: number) => {
      setOpenIndexes((prev) => {
        if (allowMultiple) {
          return prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index];
        }
        return prev.includes(index) ? [] : [index];
      });
    },
    [allowMultiple]
  );

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndexes.includes(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
