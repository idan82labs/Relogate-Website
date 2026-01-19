"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Icon } from "@/components/shared";
import type { PaginationProps } from "@/types/blog";

/**
 * Pagination - Page navigation with Hebrew format "1 מתוך 12"
 *
 * Uses path-based pagination for ISR compatibility:
 * - /blog → Page 1
 * - /blog/page/2 → Page 2
 */
export function Pagination({ currentPage, totalPages, contentType }: PaginationProps) {
  const { blog } = siteContent;
  const basePath = contentType === "press" ? "/press" : "/blog";

  // Generate href for a page number
  const getPageHref = (page: number): string => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}/page/${page}`;
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Button styles matching ArticlesCarousel
  const buttonBaseStyles = "w-10 h-10 rounded-full border flex items-center justify-center transition-colors";
  const buttonActiveStyles = "border-[#C6C6C6] text-[#1D1D1B] hover:bg-[#F7F7F7]";
  const buttonDisabledStyles = "border-[#E5E5E5] text-[#C6C6C6] cursor-not-allowed";

  return (
    <nav
      className="flex items-center justify-center gap-4 py-8"
      aria-label="Pagination"
    >
      {/* Left position (>) - Previous page */}
      {hasPrevious ? (
        <Link href={getPageHref(currentPage - 1)} aria-label={blog.pagination.previous}>
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${buttonBaseStyles} ${buttonActiveStyles}`}
          >
            <Icon name="chevronRight" size={20} />
          </motion.span>
        </Link>
      ) : (
        <span className={`${buttonBaseStyles} ${buttonDisabledStyles}`}>
          <Icon name="chevronRight" size={20} />
        </span>
      )}

      {/* Page Counter */}
      <span className="text-[14px] font-light text-black min-w-[80px] text-center">
        {currentPage} {blog.pagination.of} {totalPages}
      </span>

      {/* Right position (<) - Next page */}
      {hasNext ? (
        <Link href={getPageHref(currentPage + 1)} aria-label={blog.pagination.next}>
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${buttonBaseStyles} ${buttonActiveStyles}`}
          >
            <Icon name="chevronLeft" size={20} />
          </motion.span>
        </Link>
      ) : (
        <span className={`${buttonBaseStyles} ${buttonDisabledStyles}`}>
          <Icon name="chevronLeft" size={20} />
        </span>
      )}
    </nav>
  );
}
