"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { siteContent } from "@/content/he";
import { Stars } from "@/components/shared";

// Avatar images mapping
const avatarImages = [
  "/testimonials/avatar-1.png",
  "/testimonials/avatar-2.jpg",
  "/testimonials/avatar-3.jpg",
  "/testimonials/avatar-4.jpg",
];

export const Testimonials = () => {
  const { testimonials } = siteContent;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="testimonials" className="py-16 lg:py-24">
      <div className="container">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl lg:text-5xl font-medium text-[#1D1D1B] mb-12"
        >
          {testimonials.title}
        </motion.h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.items.map((testimonial, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  rounded-[20px] p-8 h-full flex flex-col cursor-pointer
                  transition-all duration-300 ease-out
                  ${isHovered 
                    ? "bg-[#215388] shadow-lg scale-[1.02]" 
                    : "bg-[#F7F7F7] hover:shadow-md"
                  }
                `}
              >
                {/* Stars */}
                <div className="mb-4">
                  <Stars 
                    rating={testimonial.rating} 
                    color={isHovered ? "white" : "blue"}
                  />
                </div>

                {/* Quote */}
                <p className={`
                  text-lg flex-grow mb-6 transition-colors duration-300
                  ${isHovered ? "text-white" : "text-[#1D1D1B]"}
                `}>
                  {testimonial.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {avatarImages[index % avatarImages.length] ? (
                      <Image
                        src={avatarImages[index % avatarImages.length]}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#B2B2B2] to-[#706F6F]" />
                    )}
                  </div>
                  <div>
                    <p className={`
                      font-medium transition-colors duration-300
                      ${isHovered ? "text-white" : "text-[#1D1D1B]"}
                    `}>
                      {testimonial.name}
                    </p>
                    <p className={`
                      text-sm transition-colors duration-300
                      ${isHovered ? "text-white/70" : "text-[#706F6F]"}
                    `}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
