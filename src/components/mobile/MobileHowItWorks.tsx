"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { Card } from "@/components/shared";

type StepNumber = 1 | 2 | 3;

export const MobileHowItWorks = () => {
  const { howItWorks } = siteContent;
  const [selectedStep, setSelectedStep] = useState<StepNumber | null>(null);

  const renderExpandedContent = (stepIndex: number) => {
    const step = howItWorks.steps[stepIndex];
    const intro = step.expandedContent.intro;
    const sections = step.expandedContent.sections;

    if (stepIndex === 0 && intro && typeof intro !== "string") {
      return (
        <div className="space-y-4 text-sm">
          <ol className="space-y-3 list-decimal list-inside">
            {intro.map((item, idx) => (
              <li key={idx} className="text-white">
                <span className="font-semibold">{item.title}</span>
                {item.content && (
                  <p className="mt-1 mr-5 text-white/90">{item.content}</p>
                )}
              </li>
            ))}
          </ol>
          {step.expandedContent.reportInfo && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <h4 className="font-semibold text-[#215388] mb-1">
                {step.expandedContent.reportInfo.title}
              </h4>
              <p className="text-[#215388]/90 text-xs">
                {step.expandedContent.reportInfo.content}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (stepIndex === 1 && sections) {
      return (
        <div className="space-y-3 text-sm">
          {sections.map((section, idx) => {
            if (typeof section === "string") return null;
            return (
              <div key={idx}>
                <h4 className="font-semibold text-white">{section.title}</h4>
                <p className="text-white/90 text-xs">{section.content}</p>
              </div>
            );
          })}
        </div>
      );
    }

    if (stepIndex === 2 && typeof intro === "string") {
      return (
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-white">{intro}</p>
          {sections &&
            sections.map((text, idx) => (
              <p key={idx} className="text-white/90 text-xs">
                {typeof text === "string" ? text : text.content}
              </p>
            ))}
        </div>
      );
    }

    return null;
  };

  return (
    <section id="how-it-works" className="py-12 bg-[#F7F7F7]">
      <div className="px-4">
        {/* Section Title */}
        <h2 className="text-2xl font-medium text-[#1D1D1B] text-center mb-8">
          {howItWorks.title}
        </h2>

        {/* Steps */}
        <div className="space-y-4">
          {howItWorks.steps.map((step, index) => {
            const stepNum = (index + 1) as StepNumber;
            const isSelected = selectedStep === stepNum;

            return (
              <motion.div
                key={step.number}
                layout
                className="cursor-pointer"
                onClick={() => setSelectedStep(isSelected ? null : stepNum)}
              >
                <Card
                  padding="md"
                  className={`transition-colors duration-300 ${
                    isSelected
                      ? "bg-[#215388] text-white"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <p
                      className={`font-['Satoshi',sans-serif] text-[40px] font-normal ${
                        isSelected ? "text-white" : "text-[#215388]"
                      }`}
                    >
                      {step.number}
                    </p>

                    <div className="flex-1">
                      {/* Step Title */}
                      <h3
                        className={`text-2xl font-normal mb-2 ${
                          isSelected ? "text-white" : "text-[#215388]"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Content */}
                      <AnimatePresence mode="wait">
                        {isSelected ? (
                          <motion.div
                            key="expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
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
                          >
                            <p className="text-sm text-[#1D1D1B] mb-2">
                              {step.shortDescription}
                            </p>
                            <button className="text-[#1D1D1B] font-semibold underline text-sm">
                              {step.readMore}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MobileHowItWorks;
