/**
 * Blog Types - TypeScript definitions for blog and press content
 */

// ============================================================================
// Content Types
// ============================================================================

export type ContentType = 'blog' | 'press';

export type Locale = 'he' | 'en';

// ============================================================================
// Blog Post Types
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
