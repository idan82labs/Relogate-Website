"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { BackButton, ArticleContent, RelatedArticles } from "@/components/blog";
import type { BlogPost, BlogPostListItem } from "@/types/blog";

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

interface BlogArticleClientProps {
  post: BlogPost;
  relatedPosts: BlogPostListItem[];
}

export function BlogArticleClient({ post, relatedPosts }: BlogArticleClientProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { blog } = siteContent;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Format date
  const formattedDate = new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

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
          <motion.article
            key={post.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={isMobile ? "px-4" : "max-w-[1400px] mx-auto px-6"}
          >
            {/* Container for text content */}
            <div className={isMobile ? "" : "max-w-[900px] mx-auto"}>
              {/* Back Button */}
              <div className={isMobile ? "py-4" : "py-6"}>
                <BackButton href="/blog" label={blog.backToBlog} />
              </div>

              {/* Article Header */}
              <header className="mb-8">
                {/* Title */}
                <motion.h1
                  className={`font-semibold text-[var(--color-ink)] leading-[1.2] mb-4 ${
                    isMobile ? "text-[28px]" : "text-[40px]"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {post.title}
                </motion.h1>

                {/* Meta Info */}
                <motion.p
                  className="text-[14px] font-light text-[var(--color-gray-400)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {blog.publishedBy} {formattedDate} {blog.by} {post.author}
                </motion.p>

                {/* Excerpt */}
                <motion.p
                  className="text-[18px] text-[var(--color-gray-400)] mt-4 leading-[1.6]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {post.excerpt}
                </motion.p>
              </header>
            </div>

            {/* Wider container for featured image */}
            <div className={isMobile ? "" : "max-w-[900px] mx-auto"}>
              {post.featuredImageUrl && (
                <motion.div
                  className={`relative overflow-hidden rounded-[20px] mb-8 ${
                    isMobile ? "h-[250px]" : "h-[400px]"
                  }`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}
            </div>

            {/* Container for article body */}
            <div className={isMobile ? "" : "max-w-[900px] mx-auto"}>
              <ArticleContent content={post.content} />
            </div>
          </motion.article>

          {/* Related Articles - Outside narrow container for full width */}
          {relatedPosts.length > 0 && (
            <div className={isMobile ? "mt-12" : "mt-16"}>
              <RelatedArticles
                posts={relatedPosts}
                variant={variant}
                contentType="blog"
                title={blog.relatedArticles}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
