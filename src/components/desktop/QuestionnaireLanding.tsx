"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark, StepCard } from "@/components/shared";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * QuestionnaireLanding - Desktop landing page for the eligibility questionnaire
 * Shows the 3-step process before users start the questionnaire
 */
export const QuestionnaireLanding = () => {
  const router = useRouter();
  const { questionTest } = siteContent;
  const { howItWorks } = questionTest;

  const handleStartQuestionnaire = () => {
    router.push("/questionnaire/countries");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 relative">
        {/* Hero Section with Image */}
        <section className="relative h-[500px] mx-auto max-w-[1440px] mt-0">
          {/* Hero Image */}
          <div className="absolute inset-x-0 top-0 h-full rounded-[20px] overflow-hidden mx-5">
            <img
              src="/about-image.jpg"
              alt="Couple planning relocation"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[65px] font-medium text-white text-center leading-[74px] max-w-[886px] whitespace-pre-line"
            >
              {howItWorks.title}
            </motion.h1>
          </div>
        </section>

        {/* Steps Section */}
        <section className="relative py-16 overflow-hidden">
          {/* Globe Watermark */}
          <GlobeWatermark position="center" size={480} className="top-[10%]" />

          <div className="container relative z-10">
            {/* Step Cards */}
            <div className="flex justify-center gap-[30px] mb-12">
              {howItWorks.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <StepCard
                    icon={step.icon as "questionnaire" | "payment" | "report"}
                    title={step.title}
                    className="w-[380px] h-[380px]"
                  />
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartQuestionnaire}
                className="px-12 py-4 text-[21px] rounded-[100px]"
              >
                {howItWorks.cta}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionnaireLanding;
