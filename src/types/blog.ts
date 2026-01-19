/**
 * Blog Types - TypeScript definitions for blog and press content
 */

// ============================================================================
// Content Types
// ============================================================================

export type ContentType = 'blog' | 'press';

export type Locale = 'he' | 'en';

/**
 * Localized text object from API
 */
export interface LocalizedText {
  he: string;
  en?: string;
}

// ============================================================================
// API Response Types (raw from backend)
// ============================================================================

/**
 * Blog post from API (with localized fields)
 */
export interface ApiBlogPost {
  id: string;
  slug: string;
  contentType: ContentType;
  title: LocalizedText;
  excerpt: LocalizedText | null;
  content?: LocalizedText;
  metaDescription?: LocalizedText | null;
  featuredImageUrl: string | null;
  featuredImageAlt?: LocalizedText | null;
  category: string | null;
  tags?: string[];
  author: string;
  viewCount?: number;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// Transformed Types (for components)
// ============================================================================

/**
 * Blog post list item - minimal data for listing pages
 */
export interface BlogPostListItem {
  id: string;
  slug: string;
  contentType: ContentType;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  category: string | null;
  author: string;
  publishedAt: string;
  viewCount: number;
}

/**
 * Full blog post with content - for article pages
 */
export interface BlogPost extends BlogPostListItem {
  content: string; // Markdown content
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[];
  readingTimeMinutes: number;
  updatedAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Pagination info returned by API
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * List posts API response
 */
export interface ListPostsResponse {
  posts: BlogPostListItem[];
  pagination: PaginationInfo;
}

/**
 * Single post API response
 */
export interface GetPostResponse {
  post: BlogPost;
}

/**
 * Slugs API response (for generateStaticParams)
 */
export interface GetSlugsResponse {
  slugs: string[];
}

/**
 * Related posts API response
 */
export interface GetRelatedPostsResponse {
  posts: BlogPostListItem[];
}

/**
 * Total pages API response
 */
export interface GetTotalPagesResponse {
  totalPages: number;
}

// ============================================================================
// Service Parameters
// ============================================================================

/**
 * Parameters for listing posts
 */
export interface ListPostsParams {
  contentType?: ContentType;
  locale?: Locale;
  page?: number;
  limit?: number;
  category?: string;
}

/**
 * Parameters for getting a single post
 */
export interface GetPostParams {
  slug: string;
  locale?: Locale;
}

/**
 * Parameters for getting related posts
 */
export interface GetRelatedPostsParams {
  slug: string;
  locale?: Locale;
  limit?: number;
}

/**
 * Parameters for getting total pages
 */
export interface GetTotalPagesParams {
  contentType?: ContentType;
  limit?: number;
}

// ============================================================================
// Component Props Types
// ============================================================================

export type ArticleCardVariant = 'desktop' | 'mobile';

export interface ArticleCardProps {
  post: BlogPostListItem;
  variant: ArticleCardVariant;
  contentType: ContentType;
}

export interface ArticleGridProps {
  posts: BlogPostListItem[];
  variant: ArticleCardVariant;
  contentType: ContentType;
}

export interface HeroBannerProps {
  title: string;
  variant: ArticleCardVariant;
  backgroundImage?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  contentType: ContentType;
}

export interface ArticleContentProps {
  content: string;
}

export interface RelatedArticlesProps {
  posts: BlogPostListItem[];
  variant: ArticleCardVariant;
  contentType: ContentType;
  title: string;
}

export interface BackButtonProps {
  href: string;
  label: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract text from localized field
 */
export function getLocalizedText(
  text: LocalizedText | string | null | undefined,
  locale: Locale = 'he'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[locale] ?? text.he ?? '';
}

/**
 * Transform API post to component post
 */
export function transformApiPost(post: ApiBlogPost, locale: Locale = 'he'): BlogPostListItem {
  return {
    id: post.id,
    slug: post.slug,
    contentType: post.contentType,
    title: getLocalizedText(post.title, locale),
    excerpt: getLocalizedText(post.excerpt, locale),
    featuredImageUrl: post.featuredImageUrl,
    category: post.category,
    author: post.author,
    publishedAt: post.publishedAt,
    viewCount: post.viewCount ?? 0,
  };
}

/**
 * Transform API post to full post
 */
export function transformApiFullPost(post: ApiBlogPost, locale: Locale = 'he'): BlogPost {
  const content = getLocalizedText(post.content, locale);
  const wordCount = content.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    ...transformApiPost(post, locale),
    content,
    metaTitle: getLocalizedText(post.title, locale),
    metaDescription: getLocalizedText(post.metaDescription, locale) || null,
    tags: post.tags ?? [],
    readingTimeMinutes,
    updatedAt: post.updatedAt ?? post.publishedAt,
  };
}
