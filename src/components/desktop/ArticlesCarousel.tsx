"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Icon } from "@/components/shared";

export const ArticlesCarousel = () => {
  const { articles } = siteContent;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        {/* Header with title and navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-medium text-[#1D1D1B]"
          >
            {articles.title}
          </motion.h2>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-[#C6C6C6] flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
              aria-label="Previous"
            >
              <Icon name="chevronRight" size={20} className="text-[#1D1D1B]" />
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-[#C6C6C6] flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
              aria-label="Next"
            >
              <Icon name="chevronLeft" size={20} className="text-[#1D1D1B]" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
        >
          {articles.items.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-none w-[280px]"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1D1D1B] to-[#215388]" />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1B]/60 to-transparent" />
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-base font-normal leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">{article.date}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesCarousel;
