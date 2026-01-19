"use client";

import { ArticleCard } from "./ArticleCard";
import { siteContent } from "@/content/he";
import type { ArticleGridProps } from "@/types/blog";

/**
 * ArticleGrid - Displays a grid of article cards
 *
 * Layout:
 * - Desktop: 3-column grid with 24px gap
 * - Mobile: Single column with 24px gap
 */
export function ArticleGrid({ posts, variant, contentType }: ArticleGridProps) {
  const { blog } = siteContent;

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-gray-400)] text-lg">{blog.noPosts}</p>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col items-center gap-8 px-4">
        {posts.map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
            variant="mobile"
            contentType={contentType}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 max-w-[1200px] mx-auto px-6">
      {posts.map((post) => (
        <ArticleCard
          key={post.id}
          post={post}
          variant="desktop"
          contentType={contentType}
        />
      ))}
    </div>
  );
}
