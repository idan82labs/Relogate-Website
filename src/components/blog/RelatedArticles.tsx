"use client";

import { motion } from "framer-motion";
import { ArticleCard } from "./ArticleCard";
import { siteContent } from "@/content/he";
import type { RelatedArticlesProps } from "@/types/blog";

/**
 * RelatedArticles - Section displaying related articles at the bottom of article pages
 *
 * Desktop: 3 cards in a row
 * Mobile: Horizontal scroll
 */
export function RelatedArticles({
  posts,
  variant,
  contentType,
  title,
}: RelatedArticlesProps) {
  const { blog } = siteContent;

  if (posts.length === 0) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <motion.section
        className="py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-[24px] font-semibold text-[var(--color-ink)] mb-6 px-4 text-center">
          {title || blog.relatedArticles}
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 pb-4" style={{ width: "max-content" }}>
            {posts.map((post) => (
              <div key={post.id} className="flex-shrink-0">
                <ArticleCard
                  post={post}
                  variant="mobile"
                  contentType={contentType}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-[32px] font-semibold text-[var(--color-ink)] mb-8 text-center">
        {title || blog.relatedArticles}
      </h2>

      <div className="flex justify-center gap-6 flex-wrap">
        {posts.map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
            variant="desktop"
            contentType={contentType}
          />
        ))}
      </div>
    </motion.section>
  );
}
