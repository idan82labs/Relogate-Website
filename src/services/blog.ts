/**
 * Blog Service - Handles blog and press API calls
 */

import type {
  ApiBlogPost,
  ContentType,
  GetPostParams,
  GetPostResponse,
  GetRelatedPostsParams,
  GetRelatedPostsResponse,
  GetSlugsResponse,
  GetTotalPagesParams,
  GetTotalPagesResponse,
  ListPostsParams,
  ListPostsResponse,
  Locale,
  PaginationInfo,
} from '@/types/blog';
import { transformApiPost, transformApiFullPost } from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Development logging helper
const logError = (context: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Blog Service] ${context}:`, error);
  }
};

// ============================================================================
// API Response Types (raw from backend)
// ============================================================================

interface ApiListResponse {
  posts: ApiBlogPost[];
  pagination: PaginationInfo;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List blog/press posts with pagination
 */
export async function listPosts(
  params: ListPostsParams = {}
): Promise<{ data: ListPostsResponse | null; error?: string }> {
  const {
    contentType = 'blog',
    locale = 'he',
    page = 1,
    limit = 6,
    category,
  } = params;

  try {
    const searchParams = new URLSearchParams();
    searchParams.set('contentType', contentType);
    searchParams.set('locale', locale);
    searchParams.set('page', String(page));
    searchParams.set('limit', String(limit));
    if (category) searchParams.set('category', category);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/blog?${searchParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`listPosts failed (${response.status})`, { params, errorData });
      return { data: null, error: errorData.error || 'Failed to fetch posts' };
    }

    const json = await response.json();
    const apiData: ApiListResponse = json.data;

    if (!apiData?.posts) {
      logError('listPosts returned no posts array', { params, json });
      return { data: { posts: [], pagination: { page: 1, limit: 6, total: 0, totalPages: 0 } } };
    }

    // Transform API posts to component posts
    const transformedPosts = apiData.posts.map((post) => transformApiPost(post, locale as Locale));

    // Deduplicate posts by ID (backend may return duplicates)
    const seenIds = new Set<string>();
    const posts = transformedPosts.filter((post) => {
      if (seenIds.has(post.id)) {
        return false;
      }
      seenIds.add(post.id);
      return true;
    });

    return {
      data: {
        posts,
        pagination: apiData.pagination,
      },
    };
  } catch (error) {
    logError('listPosts network error', error);
    return { data: null, error: 'Network error' };
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(
  params: GetPostParams
): Promise<{ data: GetPostResponse | null; error?: string }> {
  const { slug, locale = 'he' } = params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/blog/${slug}?locale=${locale}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`getPostBySlug failed (${response.status})`, { slug, errorData });
      return { data: null, error: errorData.error || 'Failed to fetch post' };
    }

    const json = await response.json();
    // Backend returns post directly in data (not wrapped in { post: ... })
    const apiPost: ApiBlogPost = json.data.post ?? json.data;

    return {
      data: {
        post: transformApiFullPost(apiPost, locale as Locale),
      },
    };
  } catch (error) {
    logError('getPostBySlug network error', { slug, error });
    return { data: null, error: 'Network error' };
  }
}

/**
 * Get all slugs for static generation
 */
export async function getAllSlugs(
  contentType?: ContentType
): Promise<{ data: GetSlugsResponse | null; error?: string }> {
  try {
    const url = contentType
      ? `${API_BASE_URL}/api/v1/blog/slugs?contentType=${contentType}`
      : `${API_BASE_URL}/api/v1/blog/slugs`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`getAllSlugs failed (${response.status})`, { contentType, errorData });
      return { data: null, error: errorData.error || 'Failed to fetch slugs' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    logError('getAllSlugs network error', error);
    return { data: null, error: 'Network error' };
  }
}

/**
 * Get related posts for an article
 */
export async function getRelatedPosts(
  params: GetRelatedPostsParams
): Promise<{ data: GetRelatedPostsResponse | null; error?: string }> {
  const { slug, locale = 'he', limit = 3 } = params;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/blog/${slug}/related?locale=${locale}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`getRelatedPosts failed (${response.status})`, { slug, errorData });
      return { data: null, error: errorData.error || 'Failed to fetch related posts' };
    }

    const json = await response.json();
    const apiPosts: ApiBlogPost[] = json.data?.posts ?? [];

    // Transform and deduplicate posts
    const transformedPosts = apiPosts.map((post) => transformApiPost(post, locale as Locale));
    const seenIds = new Set<string>();
    const posts = transformedPosts.filter((post) => {
      if (seenIds.has(post.id)) {
        return false;
      }
      seenIds.add(post.id);
      return true;
    });

    return {
      data: {
        posts,
      },
    };
  } catch (error) {
    logError('getRelatedPosts network error', { slug, error });
    return { data: null, error: 'Network error' };
  }
}

/**
 * Get total pages count for pagination
 */
export async function getTotalPages(
  params: GetTotalPagesParams = {}
): Promise<{ data: GetTotalPagesResponse | null; error?: string }> {
  const { contentType = 'blog', limit = 6 } = params;

  try {
    const searchParams = new URLSearchParams();
    searchParams.set('contentType', contentType);
    searchParams.set('limit', String(limit));

    const response = await fetch(
      `${API_BASE_URL}/api/v1/blog/pages?${searchParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logError(`getTotalPages failed (${response.status})`, { params, errorData });
      return { data: null, error: errorData.error || 'Failed to fetch page count' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    logError('getTotalPages network error', error);
    return { data: null, error: 'Network error' };
  }
}

// ============================================================================
// Blog Service Object (for alternative usage pattern)
// ============================================================================

export const blogService = {
  listPosts,
  getPostBySlug,
  getAllSlugs,
  getRelatedPosts,
  getTotalPages,
};
