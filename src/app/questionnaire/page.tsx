"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Desktop component
import { QuestionnaireLanding } from "@/components/desktop/QuestionnaireLanding";

// Mobile component
import { MobileQuestionnaireLanding } from "@/components/mobile/MobileQuestionnaireLanding";

export default function QuestionnairePage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Detect viewport and set mobile state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Loading state while detecting viewport
  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-[#215388] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </motion.div>
      </div>
    );
  }

  // Render appropriate component based on viewport
  return isMobile ? <MobileQuestionnaireLanding /> : <QuestionnaireLanding />;
}
