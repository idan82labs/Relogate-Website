"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import type { ArticleCardProps } from "@/types/blog";

/**
 * ArticleCard - Displays a blog/press article preview card
 *
 * Matches Figma specifications:
 * - Desktop: 375px width, 360px image height, 20px border-radius
 * - Mobile: 343px width, 360px image height, 20px border-radius
 */
export function ArticleCard({ post, variant, contentType }: ArticleCardProps) {
  const { blog } = siteContent;
  const basePath = contentType === "press" ? "/press" : "/blog";
  const href = `${basePath}/${post.slug}`;

  // Format date in Hebrew
  const formattedDate = new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <motion.article
      className={`flex flex-col ${variant === "desktop" ? "w-[375px]" : "w-[343px]"}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="block group">
        {/* Image Container */}
        <div className="relative h-[360px] w-full overflow-hidden rounded-[20px] mb-4">
          {post.featuredImageUrl ? (
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={variant === "desktop" ? "375px" : "343px"}
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-gray-200)] flex items-center justify-center">
              <span className="text-[var(--color-gray-400)] text-sm">
                {blog.loading}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 px-1">
          {/* Date and Author */}
          <p className="text-[14px] font-light text-[var(--color-ink)] leading-[1.4]">
            {blog.publishedBy} {formattedDate} {blog.by} {post.author}
          </p>

          {/* Title */}
          <h3 className="text-[18px] font-medium text-[var(--color-ink)] leading-[1.4] line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-[16px] font-normal text-[var(--color-ink)] leading-[1.5] line-clamp-3">
            {post.excerpt}
          </p>

          {/* Read More Link */}
          <span className="text-[21px] font-semibold text-[var(--color-primary)] mt-2 underline group-hover:opacity-80 transition-opacity">
            {blog.readMore}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
