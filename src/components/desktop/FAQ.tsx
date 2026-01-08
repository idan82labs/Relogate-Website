"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Accordion, GlobeWatermark } from "@/components/shared";

export const FAQ = () => {
  const { faq } = siteContent;

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#F7F7F7] relative overflow-hidden">
      {/* Decorative globe */}
      <GlobeWatermark position="center" size={500} />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Title - aligned to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:pt-4"
          >
            <h2 className="text-4xl lg:text-5xl font-medium text-[#1D1D1B]">
              {faq.title}
            </h2>
          </motion.div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Accordion items={faq.items} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
