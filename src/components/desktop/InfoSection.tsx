"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";

// Teal checkmark SVG component matching Figma design
const TealCheckmark = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '18px' }}>
    <path d="M2 9L8 15L22 1" stroke="#239083" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InfoSection = () => {
  const { info } = siteContent;

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start" dir="ltr">
          {/* Image - Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="rounded-[20px] aspect-[4/3] overflow-hidden">
              <img 
                src="/banner-bg.jpg" 
                alt="Woman working on laptop"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content - Right side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
            dir="rtl"
          >
            <p className="text-xl lg:text-2xl text-[#1D1D1B] mb-8 leading-relaxed text-right">
              {info.description}
            </p>

            {/* Checklist */}
            <ul className="space-y-4 mb-8">
              {info.checklist.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 mt-1">
                    <TealCheckmark />
                  </span>
                  <span className="text-base text-[#1D1D1B] text-right">{item}</span>
                </motion.li>
              ))}
            </ul>

            <Button variant="primary" size="lg">
              {info.cta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
