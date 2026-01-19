"use client";

import { motion } from "framer-motion";
import type { ArticleContentProps } from "@/types/blog";

/**
 * Simple markdown to HTML converter
 * Handles: headings, bold, italic, lists, links, blockquotes
 */
function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="article-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="article-h2">$1</h2>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="article-bold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="article-italic">$1</em>');

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="article-blockquote">$1</blockquote>'
  );

  // Unordered lists
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="article-li">$1</li>'
  );
  // Wrap consecutive li elements in ul
  html = html.replace(
    /(<li class="article-li">.+<\/li>\n?)+/g,
    (match) => `<ul class="article-ul">${match}</ul>`
  );

  // Ordered lists
  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="article-li-ordered">$1</li>'
  );
  // Wrap consecutive ordered li elements in ol
  html = html.replace(
    /(<li class="article-li-ordered">.+<\/li>\n?)+/g,
    (match) => `<ol class="article-ol">${match}</ol>`
  );

  // Paragraphs - wrap text blocks in p tags
  html = html
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      // Don't wrap if already has HTML tags
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<blockquote")
      ) {
        return trimmed;
      }
      // Don't wrap empty blocks
      if (!trimmed) return "";
      return `<p class="article-p">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

/**
 * ArticleContent - Renders markdown content for blog articles
 *
 * Uses simple markdown parsing to avoid additional dependencies
 */
export function ArticleContent({ content }: ArticleContentProps) {
  const html = parseMarkdown(content);

  return (
    <motion.article
      className="article-content max-w-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <style jsx global>{`
        .article-content .article-h2 {
          font-size: 28px;
          font-weight: 600;
          color: var(--color-ink);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .article-content .article-h3 {
          font-size: 22px;
          font-weight: 600;
          color: var(--color-ink);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .article-content .article-p {
          font-size: 16px;
          color: var(--color-ink);
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .article-content .article-bold {
          font-weight: 600;
          color: var(--color-ink);
        }
        .article-content .article-italic {
          font-style: italic;
        }
        .article-content .article-ul,
        .article-content .article-ol {
          margin: 1rem 0;
          padding-right: 1.5rem;
          color: var(--color-ink);
        }
        .article-content .article-li,
        .article-content .article-li-ordered {
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }
        .article-content .article-blockquote {
          border-right: 4px solid var(--color-primary);
          padding-right: 1rem;
          margin: 1.5rem 0;
          font-size: 18px;
          font-style: italic;
          color: var(--color-gray-400);
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </motion.article>
  );
}
