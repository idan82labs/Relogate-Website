"use client";

import { motion } from "framer-motion";
import type { ArticleContentProps } from "@/types/blog";

/**
 * Simple markdown to HTML converter
 * Handles: headings, bold, italic, lists, links, blockquotes
 */
function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Normalize whitespace: collapse 2+ spaces to single space (preserves intentional formatting)
  // This handles double/triple spaces within text that may come from copy-paste or formatting
  html = html.replace(/[ \t]{2,}/g, " ");

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
      // Check if original block started with whitespace (first line had leading spaces)
      const firstLineHadSpaces = /^[ \t]+/.test(block);
      // Replace leading spaces on lines with bullet character (for enum-style content)
      let processed = trimmed
        .replace(/\n[ \t]+/g, "<br />• ")  // Lines starting with whitespace become bullet points
        .replace(/\n/g, "<br />");          // Regular line breaks
      // Add bullet to first line if it originally had leading spaces
      if (firstLineHadSpaces) {
        processed = "• " + processed;
      }
      return `<p class="article-p">${processed}</p>`;
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
          font-size: clamp(1.5rem, 1.25rem + 1vw, 2rem);
          font-weight: 600;
          color: var(--color-ink);
          margin-top: clamp(2rem, 1.5rem + 1vw, 2.5rem);
          margin-bottom: clamp(0.75rem, 0.5rem + 0.5vw, 1rem);
          line-height: 1.25;
        }
        .article-content .article-h3 {
          font-size: clamp(1.25rem, 1rem + 0.75vw, 1.5rem);
          font-weight: 600;
          color: var(--color-ink);
          margin-top: clamp(1.5rem, 1.25rem + 0.5vw, 2rem);
          margin-bottom: clamp(0.5rem, 0.25rem + 0.25vw, 0.75rem);
          line-height: 1.3;
        }
        .article-content .article-p {
          font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
          color: var(--color-ink);
          line-height: 1.75;
          margin-bottom: clamp(1.25rem, 1rem + 0.5vw, 1.5rem);
        }
        .article-content .article-bold {
          font-weight: 600;
          color: var(--color-ink);
        }
        .article-content .article-italic {
          font-style: italic;
        }
        .article-content .article-ul {
          margin: clamp(1rem, 0.75rem + 0.5vw, 1.5rem) 0;
          padding-right: clamp(1.25rem, 1rem + 0.5vw, 2rem);
          color: var(--color-ink);
          list-style-type: disc;
          list-style-position: inside;
        }
        .article-content .article-ol {
          margin: clamp(1rem, 0.75rem + 0.5vw, 1.5rem) 0;
          padding-right: clamp(1.25rem, 1rem + 0.5vw, 2rem);
          color: var(--color-ink);
          list-style-type: decimal;
          list-style-position: inside;
        }
        .article-content .article-li,
        .article-content .article-li-ordered {
          font-size: clamp(1rem, 0.95rem + 0.2vw, 1.0625rem);
          line-height: 1.75;
          margin-bottom: clamp(0.5rem, 0.375rem + 0.25vw, 0.75rem);
        }
        .article-content .article-blockquote {
          border-right: 3px solid var(--color-primary);
          padding: clamp(1rem, 0.75rem + 0.5vw, 1.5rem);
          padding-left: 0;
          margin: clamp(1.5rem, 1.25rem + 0.5vw, 2rem) 0;
          font-size: clamp(1.0625rem, 1rem + 0.25vw, 1.25rem);
          font-style: italic;
          color: var(--color-gray-400);
          background: linear-gradient(to left, rgba(247, 247, 247, 0.5), transparent);
          border-radius: 4px;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </motion.article>
  );
}
