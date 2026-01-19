"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { HeroBanner, ArticleGrid, Pagination } from "@/components/blog";
import type { BlogPostListItem } from "@/types/blog";

// Desktop header component (imported dynamically to avoid SSR issues)
import dynamic from "next/dynamic";
const Header = dynamic(
  () => import("@/components/desktop/Header").then((mod) => mod.Header),
  { ssr: false }
);
const MobileHeader = dynamic(
  () => import("@/components/mobile/MobileHeader").then((mod) => mod.MobileHeader),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/desktop/Footer").then((mod) => mod.Footer),
  { ssr: false }
);

interface BlogListingClientProps {
  initialPosts: BlogPostListItem[];
  currentPage: number;
  totalPages: number;
}

export function BlogListingClient({
  initialPosts,
  currentPage,
  totalPages,
}: BlogListingClientProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { blog } = siteContent;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Loading state
  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-[var(--color-primary)] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const variant = isMobile ? "mobile" : "desktop";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      {isMobile ? <MobileHeader /> : <Header />}

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key="blog-listing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Banner */}
            <HeroBanner
              title={blog.heroBanner.blog}
              variant={variant}
            />

            {/* Articles Grid */}
            <section className={isMobile ? "py-8" : "py-12"}>
              <ArticleGrid
                posts={initialPosts}
                variant={variant}
                contentType="blog"
              />
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                contentType="blog"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
