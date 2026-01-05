"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark } from "@/components/shared";

export const AboutSection = () => {
  const { about } = siteContent;

  return (
    <section id="about" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative globe */}
      <GlobeWatermark position="center" size={500} />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="rounded-[20px] aspect-[4/3] overflow-hidden">
              <img 
                src="/about-image.jpg" 
                alt="Family relaxing"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-2xl lg:text-3xl font-medium text-[#1D1D1B] mb-6 leading-snug">
              {about.title}
              <br />
              {about.subtitle}
            </h2>
            <div className="text-lg text-[#1D1D1B] mb-8 whitespace-pre-line leading-relaxed">
              {about.description}
            </div>
            <Button variant="primary" size="lg">
              {about.cta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
