"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { GlobeWatermark } from "@/components/shared";

type StepNumber = 1 | 2 | 3;

// Get the specific step types from content
const step1 = siteContent.howItWorks.steps[0];
const step2 = siteContent.howItWorks.steps[1];
const step3 = siteContent.howItWorks.steps[2];

// Card widths
const EXPANDED_WIDTH = 762;
const COLLAPSED_WIDTH = 380;
const SHRUNK_WIDTH = 189;

// Fixed card height - matches expanded card 01 (tallest content)
const CARD_HEIGHT = 580;

// Smooth spring animation config for width
const widthSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 0.8,
};

export const HowItWorks = () => {
  const { howItWorks } = siteContent;
  const [selectedStep, setSelectedStep] = useState<StepNumber | null>(null);

  const renderStep1Content = () => {
    const step = step1;
    const intro = step.expandedContent.intro;
    if (!intro || typeof intro === "string") return null;

    return (
      <div className="space-y-3 text-right">
        {intro.map((item, idx) => (
          <div key={idx} className="text-white">
            <span className="font-semibold text-[15px]">
              {idx + 1}. {item.title}
            </span>
            {item.content && (
              <p className="mt-1 text-white/90 text-[14px] leading-relaxed">
                {item.content}
              </p>
            )}
          </div>
        ))}

        {/* White bubble for "מה כולל הדוח?" */}
        {step.expandedContent.reportInfo && (
          <div className="mt-4 bg-white rounded-[16px] p-5">
            <h4 className="font-semibold text-[#215388] text-[15px] mb-2 text-right">
              {step.expandedContent.reportInfo.title}
            </h4>
            <p className="text-[#1D1D1B] text-[13px] text-right leading-relaxed">
              {step.expandedContent.reportInfo.content}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStep2Content = () => {
    const step = step2;
    const sections = step.expandedContent.sections;
    if (!sections || !Array.isArray(sections)) return null;

    return (
      <div className="space-y-3 text-right">
        {sections.map((section, idx) => {
          if (typeof section === "string") return null;
          return (
            <div key={idx}>
              <h4 className="font-semibold text-white text-[15px]">
                {section.title}
              </h4>
              <p className="text-white/90 text-[14px] leading-relaxed">
                {section.content}
              </p>
            </div>
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
      <div className="space-y-3 text-right">
        {typeof intro === "string" && (
          <p className="font-semibold text-white text-[15px]">{intro}</p>
        )}
        {sections &&
          sections.map((text, idx) => (
            <p key={idx} className="text-white/90 text-[14px] leading-relaxed">
              {typeof text === "string" ? text : text.content}
            </p>
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
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-[#F7F7F7] relative overflow-hidden"
    >
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

        {/* Cards Row - Horizontal Layout */}
        <div className="flex gap-6 justify-center">
          {howItWorks.steps.map((step, index) => {
            const stepNum = (index + 1) as StepNumber;
            const isSelected = selectedStep === stepNum;
            const isShrunk = selectedStep !== null && selectedStep !== stepNum;

            return (
              <motion.div
                key={step.number}
                initial={false}
                animate={{ width: getCardWidth(stepNum) }}
                transition={widthSpring}
                className="cursor-pointer"
                onClick={() => handleCardClick(stepNum)}
                style={{
                  borderRadius: 20,
                  contain: "layout style",
                }}
              >
                <div
                  className={`p-8 flex flex-col transition-colors duration-200 overflow-hidden ${
                    isSelected ? "bg-[#215388]" : "bg-white"
                  }`}
                  style={{
                    height: CARD_HEIGHT,
                    borderRadius: 20,
                    contain: "layout style",
                  }}
                >
                  {/* Shrunk state: number and title at bottom-right */}
                  {isShrunk ? (
                    <div className="flex-1 flex flex-col justify-end">
                      <motion.p
                        layout="position"
                        className="text-[#215388] text-[36px] leading-none mb-1 text-right whitespace-nowrap"
                        style={{
                          fontFamily: "Satoshi, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {step.number}
                      </motion.p>
                      <motion.h3
                        layout="position"
                        className="text-[#215388] text-[28px] font-normal leading-tight text-right whitespace-nowrap"
                      >
                        {step.title}
                      </motion.h3>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      {/* Step Number */}
                      <motion.p
                        layout="position"
                        className={`leading-none mb-2 text-left text-[52px] whitespace-nowrap ${
                          isSelected ? "text-white" : "text-[#215388]"
                        }`}
                        style={{
                          fontFamily: "Satoshi, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {step.number}
                      </motion.p>

                      {/* Step Title */}
                      <motion.h3
                        layout="position"
                        className={`font-normal leading-tight text-right mb-4 text-[52px] whitespace-nowrap ${
                          isSelected ? "text-white" : "text-[#215388]"
                        }`}
                      >
                        {step.title}
                      </motion.h3>

                      {/* Content - hidden during shrink with overflow */}
                      <div className="flex-1 overflow-hidden">
                        {isSelected ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            {renderExpandedContent(index)}
                          </motion.div>
                        ) : (
                          <div>
                            <p className="text-[#1D1D1B] text-right leading-relaxed mb-4 text-[18px]">
                              {step.shortDescription}
                            </p>
                            <button className="text-[#1D1D1B] font-semibold underline text-right w-full text-[16px]">
                              {step.readMore}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
