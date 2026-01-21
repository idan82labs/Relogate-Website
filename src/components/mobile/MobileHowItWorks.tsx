"use client";

import { useState } from "react";
import { siteContent } from "@/content/he";
import { Card } from "@/components/shared";

type StepNumber = 1 | 2 | 3;

export const MobileHowItWorks = () => {
  const { howItWorks } = siteContent;
  // No card selected by default (per user specification)
  const [selectedStep, setSelectedStep] = useState<StepNumber | null>(null);

  const renderExpandedContent = (stepIndex: number) => {
    const step = howItWorks.steps[stepIndex];
    const intro = step.expandedContent.intro;
    const sections = step.expandedContent.sections;

    if (stepIndex === 0 && intro && typeof intro !== "string") {
      return (
        <div className="space-y-4 text-sm text-right">
          <div className="space-y-3">
            {intro.map((item, idx) => (
              <div key={idx} className="text-white">
                <span className="font-semibold">{idx + 1}. {item.title}</span>
                {item.content && (
                  <p className="mt-1 text-white/90">{item.content}</p>
                )}
              </div>
            ))}
          </div>
          {step.expandedContent.reportInfo && (
            <div className="mt-4 bg-white rounded-[16px] p-4">
              <h4 className="font-semibold text-[#215388] text-sm mb-1 text-right">
                {step.expandedContent.reportInfo.title}
              </h4>
              <p className="text-[#1D1D1B] text-xs text-right leading-relaxed">
                {step.expandedContent.reportInfo.content}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (stepIndex === 1 && sections) {
      return (
        <div className="space-y-3 text-sm text-right">
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
        <div className="space-y-3 text-sm text-right">
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
    <section id="how-it-works" className="py-10 bg-[#F7F7F7]">
      <div className="px-4">
        {/* Section Title */}
        <h2 className="text-[26px] font-medium text-[#1D1D1B] text-center mb-8">
          {howItWorks.title}
        </h2>

        {/* Steps */}
        <div className="space-y-4">
          {howItWorks.steps.map((step, index) => {
            const stepNum = (index + 1) as StepNumber;
            const isSelected = selectedStep === stepNum;

            return (
              <div
                key={step.number}
                className="cursor-pointer"
                onClick={() => setSelectedStep(isSelected ? null : stepNum)}
              >
                <Card
                  padding="md"
                  className={`transition-colors duration-300 ${
                    isSelected
                      ? "!bg-[#215388] text-white"
                      : "bg-white"
                  }`}
                >
                  {/* RTL layout: flex-row-reverse puts number on the right */}
                  <div className="flex items-start gap-4 flex-row-reverse" dir="rtl">
                    {/* Step Number - on the right in RTL */}
                    <p
                      className={`font-['Satoshi',sans-serif] text-[40px] font-normal leading-none ${
                        isSelected ? "text-white" : "text-[#215388]"
                      }`}
                    >
                      {step.number}
                    </p>

                    <div className="flex-1 text-right">
                      {/* Step Title */}
                      <h3
                        className={`text-2xl font-normal mb-2 ${
                          isSelected ? "text-white" : "text-[#215388]"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {/* Content */}
                      {isSelected ? (
                        <div className="mt-3">
                          {renderExpandedContent(index)}
                        </div>
                      ) : (
                        <div>
                          <p className={`text-sm mb-2 ${isSelected ? "text-white/90" : "text-[#1D1D1B]"}`}>
                            {step.shortDescription}
                          </p>
                          <button className={`font-semibold underline text-sm ${isSelected ? "text-white" : "text-[#1D1D1B]"}`}>
                            {step.readMore}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

