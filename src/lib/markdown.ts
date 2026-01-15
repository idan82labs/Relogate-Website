/**
 * Simple markdown parser for response content.
 * Supports: bold, italic, bullet lists, links, images, and subheadings.
 * Designed for RTL Hebrew content.
 */

import React from 'react';

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parse inline markdown elements (bold, italic, links, images)
 */
function parseInlineMarkdown(text: string): string {
  let result = escapeHtml(text);

  // Images: ![alt](url)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" loading="lazy" />'
  );

  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#215388] hover:underline">$1</a>'
  );

  // Bold: **text** or __text__
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  result = result.replace(/_([^_]+)_/g, '<em>$1</em>');

  return result;
}

/**
 * Parse a single line and return HTML
 */
function parseLine(line: string): string {
  const trimmed = line.trim();

  // Empty line
  if (!trimmed) {
    return '';
  }

  // Check headings from most specific to least specific (#### before ###, etc.)

  // Heading 4: #### text
  if (trimmed.startsWith('#### ')) {
    const content = parseInlineMarkdown(trimmed.slice(5));
    return `<h4 class="text-base font-semibold text-[#1D1D1B] mt-3 mb-1">${content}</h4>`;
  }

  // Heading 3: ### text
  if (trimmed.startsWith('### ')) {
    const content = parseInlineMarkdown(trimmed.slice(4));
    return `<h3 class="text-lg font-semibold text-[#1D1D1B] mt-4 mb-2">${content}</h3>`;
  }

  // Heading 2: ## text
  if (trimmed.startsWith('## ')) {
    const content = parseInlineMarkdown(trimmed.slice(3));
    return `<h2 class="text-xl font-bold text-[#1D1D1B] mt-5 mb-3">${content}</h2>`;
  }

  // Heading 1: # text
  if (trimmed.startsWith('# ')) {
    const content = parseInlineMarkdown(trimmed.slice(2));
    return `<h1 class="text-2xl font-bold text-[#1D1D1B] mt-6 mb-4">${content}</h1>`;
  }

  // Bullet list item: - text or * text
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    const content = parseInlineMarkdown(trimmed.slice(2));
    return `<li class="mr-4 mb-1">${content}</li>`;
  }

  // Numbered list item: 1. text
  const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
  if (numberedMatch) {
    const content = parseInlineMarkdown(numberedMatch[1]);
    return `<li class="mr-4 mb-1 list-decimal">${content}</li>`;
  }

  // Regular paragraph
  const content = parseInlineMarkdown(trimmed);
  return `<p class="mb-2 leading-relaxed">${content}</p>`;
}

/**
 * Convert markdown text to HTML string
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  const lines = markdown.split('\n');
  const htmlParts: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const isBulletItem = trimmed.startsWith('- ') || trimmed.startsWith('* ');
    const isNumberedItem = /^\d+\.\s+/.test(trimmed);
    const isListItem = isBulletItem || isNumberedItem;

    // Handle list transitions
    if (isListItem && !inList) {
      // Start new list
      listType = isBulletItem ? 'ul' : 'ol';
      htmlParts.push(listType === 'ul'
        ? '<ul class="list-disc mr-6 mb-3 space-y-1">'
        : '<ol class="list-decimal mr-6 mb-3 space-y-1">'
      );
      inList = true;
    } else if (!isListItem && inList) {
      // End list
      htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
      listType = null;
    }

    const parsed = parseLine(line);
    if (parsed) {
      htmlParts.push(parsed);
    }
  }

  // Close any open list
  if (inList) {
    htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>');
  }

  return htmlParts.join('\n');
}

/**
 * Render markdown as React element using dangerouslySetInnerHTML
 * Use this for displaying content in the UI
 */
export function renderMarkdown(markdown: string): React.ReactElement {
  const html = markdownToHtml(markdown);
  return React.createElement('div', {
    className: 'markdown-content text-[#1D1D1B]',
    dangerouslySetInnerHTML: { __html: html },
    dir: 'rtl',
  });
}

/**
 * Strip markdown formatting and return plain text
 * Useful for generating previews or summaries
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';

  return markdown
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove list markers
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract first paragraph as summary (for previews)
 */
export function extractSummary(markdown: string, maxLength = 150): string {
  const plain = stripMarkdown(markdown);
  const firstParagraph = plain.split('\n\n')[0] || plain;

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.slice(0, maxLength).trim() + '...';
}

/**
 * Check if markdown contains any images
 */
export function hasImages(markdown: string): boolean {
  return /!\[[^\]]*\]\([^)]+\)/.test(markdown);
}

/**
 * Extract all image URLs from markdown
 */
export function extractImageUrls(markdown: string): string[] {
  const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * Insert markdown syntax at cursor position
 * Returns the new text and cursor position
 */
export function insertMarkdown(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  type: 'bold' | 'italic' | 'link' | 'image' | 'bullet' | 'heading'
): { newText: string; newCursorPos: number } {
  const before = text.slice(0, selectionStart);
  const selected = text.slice(selectionStart, selectionEnd);
  const after = text.slice(selectionEnd);

  let insertion: string;
  let cursorOffset: number;

  switch (type) {
    case 'bold':
      insertion = `**${selected || 'טקסט מודגש'}**`;
      cursorOffset = selected ? insertion.length : 2;
      break;
    case 'italic':
      insertion = `*${selected || 'טקסט נטוי'}*`;
      cursorOffset = selected ? insertion.length : 1;
      break;
    case 'link':
      insertion = `[${selected || 'טקסט הקישור'}](url)`;
      cursorOffset = selected ? insertion.length - 4 : 1;
      break;
    case 'image':
      insertion = `![${selected || 'תיאור התמונה'}](url)`;
      cursorOffset = selected ? insertion.length - 4 : 2;
      break;
    case 'bullet':
      // Add bullet at start of current line
      const lineStart = before.lastIndexOf('\n') + 1;
      const beforeLine = text.slice(0, lineStart);
      const currentLine = text.slice(lineStart, selectionEnd);
      return {
        newText: beforeLine + '- ' + currentLine + after,
        newCursorPos: selectionStart + 2,
      };
    case 'heading':
      // Add ### at start of current line
      const hLineStart = before.lastIndexOf('\n') + 1;
      const hBeforeLine = text.slice(0, hLineStart);
      const hCurrentLine = text.slice(hLineStart, selectionEnd);
      return {
        newText: hBeforeLine + '### ' + hCurrentLine + after,
        newCursorPos: selectionStart + 4,
      };
    default:
      return { newText: text, newCursorPos: selectionEnd };
  }

  return {
    newText: before + insertion + after,
    newCursorPos: selectionStart + cursorOffset,
  };
}
