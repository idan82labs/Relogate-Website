"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, MobileFooter, StepCard } from "@/components/shared";
import { MobileHeader } from "./MobileHeader";

/**
 * MobileQuestionnaireLanding - Mobile landing page for the eligibility questionnaire
 * Shows the 3-step process before users start the questionnaire
 */
export const MobileQuestionnaireLanding = () => {
  const router = useRouter();
  const { questionTest } = siteContent;
  const { howItWorks } = questionTest;

  const handleStartQuestionnaire = () => {
    router.push("/questionnaire/countries");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileHeader />

      <main className="flex-1">
        {/* Hero Section with Image */}
        <section className="relative h-[280px]">
          {/* Hero Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/about-image.jpg"
              alt="Couple planning relocation"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[28px] font-medium text-white text-center leading-[36px] whitespace-pre-line"
            >
              {howItWorks.title}
            </motion.h1>
          </div>
        </section>

        {/* Steps Section */}
        <section className="px-4 py-8">
          {/* Step Cards - Vertical Stack */}
          <div className="flex flex-col gap-4 mb-8">
            {howItWorks.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <StepCard
                  icon={step.icon as "questionnaire" | "payment" | "report"}
                  title={step.title}
                  className="w-full py-6"
                />
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleStartQuestionnaire}
              className="rounded-[100px]"
            >
              {howItWorks.cta}
            </Button>
          </motion.div>
        </section>
      </main>

      <MobileFooter />
    </div>
  );
};

export default MobileQuestionnaireLanding;
