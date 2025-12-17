"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";

export const GreenBanner = () => {
  const { greenBanner } = siteContent;

  return (
    <section className="relative">
      {/* Top teal banner with text */}
      <div className="bg-[#239083] h-[100px] rounded-t-[20px] flex items-center justify-center">
        <p className="text-[#f7f7f7] text-[36px] font-medium text-center">
          דוח רילוקיישן מותאם אישית תוך 24 שעות!
        </p>
      </div>

      {/* Large background image with text */}
      <div 
        className="relative h-[500px] lg:h-[700px] rounded-b-[20px] bg-cover bg-center"
        style={{ backgroundImage: "url('/banner-bg.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 rounded-b-[20px]" />

        {/* Text content - positioned on the right side */}
        <div className="absolute inset-0 z-10 flex items-center" dir="ltr">
          <div className="container flex justify-end">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-[48px] font-medium text-white leading-[1.3] max-w-[550px] text-right"
              dir="rtl"
            >
              {greenBanner.title}
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreenBanner;
