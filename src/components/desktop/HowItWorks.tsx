"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { siteContent } from "@/content/he";
import { GlobeWatermark } from "@/components/shared";

type StepNumber = 1 | 2 | 3;

// Get the specific step types from content
const step1 = siteContent.howItWorks.steps[0];
const step2 = siteContent.howItWorks.steps[1];
const step3 = siteContent.howItWorks.steps[2];

// Animation variants for card sizing
const cardVariants = {
  collapsed: {
    flex: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  expanded: {
    flex: 1.8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  shrunk: {
    flex: 0.6,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

// Animation variants for content
const contentVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      opacity: { duration: 0.15 },
      height: { duration: 0.3, ease: "easeInOut" },
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

// Animation variants for collapsed content
const collapsedContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, delay: 0.1 },
  },
};

export const HowItWorks = () => {
  const { howItWorks } = siteContent;
  const [selectedStep, setSelectedStep] = useState<StepNumber | null>(null);

  const renderStep1Content = () => {
    const step = step1;
    const intro = step.expandedContent.intro;
    if (!intro || typeof intro === "string") return null;

    return (
      <div className="space-y-6">
        <ol className="space-y-4 list-decimal list-inside">
          {intro.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className="text-white"
            >
              <span className="font-semibold">{item.title}</span>
              {item.content && (
                <p className="mt-1 mr-6 text-white/90">{item.content}</p>
              )}
            </motion.li>
          ))}
        </ol>
        {step.expandedContent.reportInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6 border-t border-white/20"
          >
            <h4 className="font-semibold text-white text-lg mb-2">
              {step.expandedContent.reportInfo.title}
            </h4>
            <p className="text-white/90 text-sm">
              {step.expandedContent.reportInfo.content}
            </p>
          </motion.div>
        )}
      </div>
    );
  };

  const renderStep2Content = () => {
    const step = step2;
    const sections = step.expandedContent.sections;
    if (!sections || !Array.isArray(sections)) return null;

    return (
      <div className="space-y-4">
        {sections.map((section, idx) => {
          if (typeof section === "string") return null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
            >
              <h4 className="font-semibold text-white">{section.title}</h4>
              <p className="text-white/90 text-sm">{section.content}</p>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderStep3Content = () => {
    const step = step3;
    const intro = step.expandedContent.intro;
    const sections = step.expandedContent.sections;

    return (
      <div className="space-y-4">
        {typeof intro === "string" && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="font-semibold text-white"
          >
            {intro}
          </motion.p>
        )}
        {sections && sections.map((text, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.1 }}
            className="text-white/90 text-sm"
          >
            {typeof text === "string" ? text : text.content}
          </motion.p>
        ))}
      </div>
    );
  };

  const renderExpandedContent = (stepIndex: number) => {
    if (stepIndex === 0) return renderStep1Content();
    if (stepIndex === 1) return renderStep2Content();
    if (stepIndex === 2) return renderStep3Content();
    return null;
  };

  const handleCardClick = (stepNum: StepNumber) => {
    // Toggle selection: if already selected, deselect; otherwise select
    setSelectedStep(selectedStep === stepNum ? null : stepNum);
  };

  const getCardVariant = (stepNum: StepNumber) => {
    if (selectedStep === null) return "collapsed";
    if (selectedStep === stepNum) return "expanded";
    return "shrunk";
  };

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-[#F7F7F7] relative overflow-hidden">
      {/* Decorative globe */}
      <GlobeWatermark position="left" size={550} className="top-[30%]" />
      
      <div className="container relative z-10">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-[65px] font-medium text-black text-center mb-12"
        >
          {howItWorks.title}
        </motion.h2>

        {/* Steps Grid - Using flex for smooth width transitions */}
        <LayoutGroup>
          <div className="flex gap-6 items-stretch">
            {howItWorks.steps.map((step, index) => {
              const stepNum = (index + 1) as StepNumber;
              const isSelected = selectedStep === stepNum;
              const isShrunk = selectedStep !== null && selectedStep !== stepNum;

              return (
                <motion.div
                  key={step.number}
                  layout
                  variants={cardVariants}
                  initial="collapsed"
                  animate={getCardVariant(stepNum)}
                  className="cursor-pointer min-w-0"
                  onClick={() => handleCardClick(stepNum)}
                  whileHover={{ scale: isSelected ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    layout
                    className={`rounded-[20px] p-8 h-full transition-colors duration-300 ${
                      isSelected
                        ? "bg-[#215388]"
                        : "bg-white hover:shadow-md"
                    }`}
                  >
                    {/* Step Number */}
                    <motion.p
                      layout="position"
                      className={`font-['Satoshi',sans-serif] font-normal leading-normal mb-4 transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-[#215388]"
                      } ${isShrunk ? "text-[40px]" : "text-[58px]"}`}
                    >
                      {step.number}
                    </motion.p>

                    {/* Step Title */}
                    <motion.h3
                      layout="position"
                      className={`font-normal leading-normal text-center mb-4 transition-all duration-300 ${
                        isSelected ? "text-white" : "text-[#215388]"
                      } ${isShrunk ? "text-[40px]" : "text-[65px]"}`}
                    >
                      {step.title}
                    </motion.h3>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                      {isSelected ? (
                        <motion.div
                          key="expanded"
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="overflow-hidden"
                        >
                          {renderExpandedContent(index)}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="collapsed"
                          variants={collapsedContentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className={`${isShrunk ? "opacity-70" : ""}`}
                        >
                          <p className={`text-black text-right leading-normal mb-4 transition-all duration-300 ${
                            isShrunk ? "text-[18px] line-clamp-3" : "text-[24px]"
                          }`}>
                            {step.shortDescription}
                          </p>
                          <button className={`text-black font-semibold underline text-center w-full transition-all duration-300 ${
                            isShrunk ? "text-[14px]" : "text-[18px]"
                          }`}>
                            {step.readMore}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
};

export default HowItWorks;
