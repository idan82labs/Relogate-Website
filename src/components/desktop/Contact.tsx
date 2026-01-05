"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Icon, GlobeWatermark } from "@/components/shared";

export const Contact = () => {
  const { contact } = siteContent;

  return (
    <section id="contact" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative globe */}
      <GlobeWatermark position="center" size={450} />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-medium text-[#1D1D1B]">
              {contact.title}
            </h2>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Globe icon */}
            <div className="w-16 h-16 text-[#215388]">
              <Icon name="globe" size={64} />
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-[#1D1D1B] hover:text-[#215388] transition-colors"
              >
                <Icon name="email" size={20} />
                <span>{contact.email}</span>
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 text-[#1D1D1B] hover:text-[#215388] transition-colors"
              >
                <Icon name="phone" size={20} />
                <span>{contact.phone}</span>
              </a>
            </div>

            {/* Description */}
            <p className="text-base text-[#1D1D1B] whitespace-pre-line leading-relaxed">
              {contact.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
