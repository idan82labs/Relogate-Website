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

// Card dimensions
const CARD_HEIGHT = 560;
const EXPANDED_WIDTH = 762;
const COLLAPSED_WIDTH = 380;
const SHRUNK_WIDTH = 189;

export const HowItWorks = () => {
  const { howItWorks } = siteContent;
  const [selectedStep, setSelectedStep] = useState<StepNumber | null>(null);

  const renderStep1Content = () => {
    const step = step1;
    const intro = step.expandedContent.intro;
    if (!intro || typeof intro === "string") return null;

    return (
      <div className="space-y-4 text-right">
        {intro.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.1 }}
            className="text-white"
          >
            <span className="font-semibold">{idx + 1}. {item.title}</span>
            {item.content && (
              <p className="mt-1 text-white/90 text-sm">{item.content}</p>
            )}
          </motion.div>
        ))}
        
        {/* White bubble for "מה כולל הדוח?" */}
        {step.expandedContent.reportInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white rounded-[20px] p-6"
            style={{ width: '100%', maxWidth: '695px', minHeight: '170px' }}
          >
            <h4 className="font-semibold text-[#215388] text-lg mb-2 text-right">
              {step.expandedContent.reportInfo.title}
            </h4>
            <p className="text-[#1D1D1B] text-sm text-right leading-relaxed">
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
      <div className="space-y-4 text-right">
        {sections.map((section, idx) => {
          if (typeof section === "string") return null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 10 }}
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
      <div className="space-y-4 text-right">
        {typeof intro === "string" && (
          <motion.p
            initial={{ opacity: 0, x: 10 }}
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
            initial={{ opacity: 0, x: 10 }}
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
    setSelectedStep(selectedStep === stepNum ? null : stepNum);
  };

  const getCardWidth = (stepNum: StepNumber) => {
    if (selectedStep === null) return COLLAPSED_WIDTH;
    if (selectedStep === stepNum) return EXPANDED_WIDTH;
    return SHRUNK_WIDTH;
  };

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-[#F7F7F7] relative overflow-hidden">
      {/* Decorative globe */}
      <GlobeWatermark position="center" size={550} className="top-[30%]" />
      
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

        {/* Steps Grid */}
        <LayoutGroup>
          <div className="flex gap-6 justify-center">
            {howItWorks.steps.map((step, index) => {
              const stepNum = (index + 1) as StepNumber;
              const isSelected = selectedStep === stepNum;
              const isShrunk = selectedStep !== null && selectedStep !== stepNum;

              return (
                <motion.div
                  key={step.number}
                  layout
                  animate={{ width: getCardWidth(stepNum) }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="cursor-pointer"
                  onClick={() => handleCardClick(stepNum)}
                  whileHover={{ scale: isSelected ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    layout
                    className={`rounded-[20px] p-8 transition-colors duration-300 overflow-hidden ${
                      isSelected
                        ? "bg-[#215388]"
                        : "bg-white hover:shadow-md"
                    }`}
                    style={{ height: CARD_HEIGHT }}
                  >
                    {/* Step Number - Left aligned */}
                    <motion.p
                      layout="position"
                      className={`leading-normal mb-4 text-left transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-[#215388]"
                      } ${isShrunk ? "text-[40px]" : "text-[58px]"}`}
                      style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }}
                    >
                      {step.number}
                    </motion.p>

                    {/* Step Title - Right aligned */}
                    <motion.h3
                      layout="position"
                      className={`font-normal leading-normal text-right mb-4 transition-all duration-300 ${
                        isSelected ? "text-white" : "text-[#215388]"
                      } ${isShrunk ? "text-[32px]" : "text-[65px]"}`}
                    >
                      {step.title}
                    </motion.h3>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                      {isSelected ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-y-auto"
                          style={{ maxHeight: CARD_HEIGHT - 200 }}
                        >
                          {renderExpandedContent(index)}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`${isShrunk ? "opacity-70" : ""}`}
                        >
                          {!isShrunk && (
                            <>
                              <p className="text-black text-right leading-normal mb-4 text-[24px]">
                                {step.shortDescription}
                              </p>
                              <button className="text-black font-semibold underline text-right w-full text-[18px]">
                                {step.readMore}
                              </button>
                            </>
                          )}
                          {isShrunk && (
                            <p className="text-black text-right leading-normal text-[16px] line-clamp-4">
                              {step.shortDescription}
                            </p>
                          )}
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
