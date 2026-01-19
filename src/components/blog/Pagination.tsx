"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
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

  return (
    <nav
      className="flex items-center justify-center gap-4 py-8"
      aria-label="Pagination"
    >
      {/* Next Arrow (Left in RTL - goes to higher page numbers) */}
      {hasNext ? (
        <Link
          href={getPageHref(currentPage + 1)}
          className="p-2 text-[var(--color-primary)] hover:opacity-70 transition-opacity"
          aria-label={blog.pagination.next}
        >
          <motion.span
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="block"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-180"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </Link>
      ) : (
        <span className="p-2 text-[var(--color-gray-300)] cursor-not-allowed">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      {/* Page Counter */}
      <span className="text-[16px] font-medium text-[var(--color-ink)] min-w-[80px] text-center">
        {currentPage} {blog.pagination.of} {totalPages}
      </span>

      {/* Previous Arrow (Right in RTL - goes to lower page numbers) */}
      {hasPrevious ? (
        <Link
          href={getPageHref(currentPage - 1)}
          className="p-2 text-[var(--color-primary)] hover:opacity-70 transition-opacity"
          aria-label={blog.pagination.previous}
        >
          <motion.span
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="block"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </Link>
      ) : (
        <span className="p-2 text-[var(--color-gray-300)] cursor-not-allowed">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </nav>
  );
}
