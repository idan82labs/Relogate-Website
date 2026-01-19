/**
 * Blog Service - Handles blog and press API calls
 *
 * Uses mock data until backend is ready.
 * Set NEXT_PUBLIC_USE_MOCK=true to use mock data.
 */

import type {
  BlogPost,
  BlogPostListItem,
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
} from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true; // Default to mock until backend ready

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_BLOG_POSTS: BlogPostListItem[] = [
  {
    id: '1',
    slug: 'complete-relocation-guide',
    contentType: 'blog',
    title: 'המדריך המלא לרילוקיישן – כל מה שצריך לדעת לפני המעבר הגדול',
    excerpt: 'רבים מהישראלים שחושבים רילוקיישן מתלבטים בשאלות: מתי עוברים חזון, דירה חדשות...',
    featuredImageUrl: '/images/blog/relocation-guide.jpg',
    category: 'guides',
    author: 'Relogate',
    publishedAt: '2024-03-17T00:00:00Z',
    viewCount: 150,
  },
  {
    id: '2',
    slug: 'digital-nomad-guide',
    contentType: 'blog',
    title: 'גם אני יכול להיות נווד דיגיטלי?',
    excerpt: 'האמת? הרבה יותר אנשים מתאימים לזה ממה שהם חושבים. במדריך הזה נסביר את כל מה שצריך לדעת.',
    featuredImageUrl: '/images/blog/digital-nomad.jpg',
    category: 'lifestyle',
    author: 'Relogate',
    publishedAt: '2024-03-15T00:00:00Z',
    viewCount: 230,
  },
  {
    id: '3',
    slug: 'europe-work-visas',
    contentType: 'blog',
    title: 'כל מה שצריך לדעת על ויזות עבודה באירופה',
    excerpt: 'מדריך מקיף על סוגי ויזות העבודה השונות באירופה והדרכים להשיג אותן.',
    featuredImageUrl: '/images/blog/europe-visa.jpg',
    category: 'visas',
    author: 'Relogate',
    publishedAt: '2024-03-10T00:00:00Z',
    viewCount: 180,
  },
  {
    id: '4',
    slug: 'international-moving-tips',
    contentType: 'blog',
    title: 'טיפים להובלה בינלאומית – איך לארוז ולהעביר את החיים שלכם',
    excerpt: 'המדריך המלא לארגון הובלה בינלאומית: מה לקחת, מה להשאיר, וכל מה שביניהם.',
    featuredImageUrl: '/images/blog/moving-tips.jpg',
    category: 'guides',
    author: 'Relogate',
    publishedAt: '2024-03-05T00:00:00Z',
    viewCount: 95,
  },
  {
    id: '5',
    slug: 'israeli-families-success-stories',
    contentType: 'blog',
    title: 'חיים חדשים בחו״ל – סיפורי הצלחה של משפחות ישראליות',
    excerpt: 'פגשנו משפחות שעשו את הצעד ועברו לחו״ל. הנה הסיפורים שלהם והטיפים שהם רוצים לחלוק.',
    featuredImageUrl: '/images/blog/success-stories.jpg',
    category: 'stories',
    author: 'Relogate',
    publishedAt: '2024-02-28T00:00:00Z',
    viewCount: 320,
  },
  {
    id: '6',
    slug: 'healthcare-in-europe',
    contentType: 'blog',
    title: 'מערכת הבריאות באירופה – מה חשוב לדעת לפני המעבר',
    excerpt: 'השוואה מקיפה בין מערכות הבריאות במדינות אירופה הפופולריות לרילוקיישן.',
    featuredImageUrl: '/images/blog/healthcare.jpg',
    category: 'guides',
    author: 'Relogate',
    publishedAt: '2024-02-20T00:00:00Z',
    viewCount: 145,
  },
];

const MOCK_PRESS_POSTS: BlogPostListItem[] = [
  {
    id: '101',
    slug: 'relogate-ynet-interview',
    contentType: 'press',
    title: 'שירות בגובה העיניים: החברה שמלווה לקוחות ברגעים המכריעים בחיים',
    excerpt: 'ראיון עם מייסדי Relogate על החזון שלהם להפוך את תהליך הרילוקיישן לפשוט ונגיש.',
    featuredImageUrl: '/images/press/ynet-interview.jpg',
    category: 'interviews',
    author: 'ynet',
    publishedAt: '2024-03-12T00:00:00Z',
    viewCount: 450,
  },
  {
    id: '102',
    slug: 'globes-relocation-trend',
    contentType: 'press',
    title: 'המגמה שמשנה את שוק העבודה: יותר ישראלים בוחנים רילוקיישן',
    excerpt: 'סקר חדש חושף: 40% מהישראלים שוקלים מעבר לחו״ל. Relogate מספקת פתרון.',
    featuredImageUrl: '/images/press/globes-article.jpg',
    category: 'news',
    author: 'Globes',
    publishedAt: '2024-03-08T00:00:00Z',
    viewCount: 380,
  },
  {
    id: '103',
    slug: 'calcalist-startup-spotlight',
    contentType: 'press',
    title: 'Relogate: הסטארטאפ שהופך את חלום הרילוקיישן למציאות',
    excerpt: 'כתבה על החברה הישראלית שמסייעת לאלפי משפחות לתכנן את המעבר הגדול.',
    featuredImageUrl: '/images/press/calcalist-spotlight.jpg',
    category: 'features',
    author: 'Calcalist',
    publishedAt: '2024-02-25T00:00:00Z',
    viewCount: 290,
  },
  {
    id: '104',
    slug: 'mako-family-relocation',
    contentType: 'press',
    title: 'המשפחה שעזבה הכל ועברה לפורטוגל: "זו ההחלטה הכי טובה שעשינו"',
    excerpt: 'סיפור מרגש של משפחה ישראלית שהשתמשה בשירותי Relogate והגשימה את החלום.',
    featuredImageUrl: '/images/press/mako-family.jpg',
    category: 'stories',
    author: 'mako',
    publishedAt: '2024-02-15T00:00:00Z',
    viewCount: 520,
  },
  {
    id: '105',
    slug: 'walla-digital-nomads',
    contentType: 'press',
    title: 'נוודים דיגיטליים: הישראלים שעובדים מכל מקום בעולם',
    excerpt: 'כתבה מיוחדת על תופעת הנוודות הדיגיטלית וכיצד Relogate מסייעת בתהליך.',
    featuredImageUrl: '/images/press/walla-nomads.jpg',
    category: 'features',
    author: 'Walla',
    publishedAt: '2024-02-10T00:00:00Z',
    viewCount: 410,
  },
  {
    id: '106',
    slug: 'israel-hayom-europe-guide',
    contentType: 'press',
    title: 'המדינות באירופה שהכי מתאימות לישראלים - המדריך המלא',
    excerpt: 'בשיתוף עם Relogate: סקירה מקיפה של היעדים הפופולריים ביותר לרילוקיישן.',
    featuredImageUrl: '/images/press/israel-hayom.jpg',
    category: 'guides',
    author: 'Israel Hayom',
    publishedAt: '2024-02-01T00:00:00Z',
    viewCount: 350,
  },
];

const MOCK_FULL_POST_CONTENT = `## התחילו בבניית עץ זמן

כמו כל תהליך גדול ומשמעותי, מחייב בניית עץ זמן. דבר נוסף הוא ניל לדעת את האסטרטגיה המועדפות. אם נתחיל כמה חודשים קודם יש לנו את ההזדמנות לאסוף את המידע הנדרש לחישובים ולהיערך כראוי למעבר.

**המעבר לחו״ל** דורש הכנה מקדימה של מספר חודשים. הכנה טובה תאפשר לכם להתמודד עם האתגרים בצורה טובה יותר ולהפחית את רמת הלחץ.

### אסטרטגיה להגירה רכה

מוביליות הגירה רכה היא אחת הדרכים הפופולריות ביותר לביצוע רילוקיישן. בגישה זו, אתם מתחילים לבנות את החיים החדשים במקביל לשמירה על הקיים:

- **שלב ראשון**: מחקר מעמיק על היעד
- **שלב שני**: ביקור מקדים ביעד
- **שלב שלישי**: יצירת רשת קשרים מקומית
- **שלב רביעי**: הסדרת נושאי ויזה ועבודה
- **שלב חמישי**: המעבר הפיזי

### נקודת ציון ראשונה - הטיפול בוויזה

בשלב הראשון בתכנון, אנחנו ממליצים לבדוק את אפשרויות הוויזה הזמינות עבורכם. לכל מדינה יש דרישות שונות ומסלולים שונים להשגת אשרת שהייה.

> "התכנון המוקדם הוא המפתח להצלחה. ככל שתתחילו מוקדם יותר, כך יהיה לכם יותר זמן להתכונן כראוי."

### מה לקחת בחשבון

כשאתם מתכננים את המעבר, חשוב לקחת בחשבון את הגורמים הבאים:

1. עלויות המחיה ביעד
2. אפשרויות תעסוקה
3. מערכת הבריאות
4. מערכת החינוך (אם יש לכם ילדים)
5. קהילה ישראלית/יהודית
6. מזג האוויר והתרבות המקומית

כל אחד מהגורמים הללו יכול להשפיע משמעותית על איכות החיים שלכם ביעד החדש.

### סיכום

התכנון לרילוקיישן הוא תהליך מורכב אך מתגמל. עם הכנה נכונה, מחקר מעמיק והכוונה מקצועית, תוכלו להגשים את החלום ולבנות חיים חדשים במקום שבחרתם.

**צריכים עזרה בתכנון?** צרו קשר עם Relogate ונעזור לכם בכל שלב בדרך.`;

// ============================================================================
// Helper Functions
// ============================================================================

function getMockPosts(contentType: ContentType): BlogPostListItem[] {
  return contentType === 'press' ? MOCK_PRESS_POSTS : MOCK_BLOG_POSTS;
}

function getMockFullPost(post: BlogPostListItem): BlogPost {
  return {
    ...post,
    content: MOCK_FULL_POST_CONTENT,
    metaTitle: post.title,
    metaDescription: post.excerpt,
    tags: ['רילוקיישן', 'מדריך', 'חו״ל'],
    readingTimeMinutes: 8,
    updatedAt: post.publishedAt,
  };
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

  if (USE_MOCK) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    let posts = getMockPosts(contentType);

    // Filter by category if provided
    if (category) {
      posts = posts.filter((p) => p.category === category);
    }

    // Paginate
    const total = posts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedPosts = posts.slice(start, start + limit);

    return {
      data: {
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  }

  // Real API call
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
      return { data: null, error: errorData.error || 'Failed to fetch posts' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (_error) {
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

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Search in both blog and press posts
    const allPosts = [...MOCK_BLOG_POSTS, ...MOCK_PRESS_POSTS];
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) {
      return { data: null, error: 'Post not found' };
    }

    return { data: { post: getMockFullPost(post) } };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/blog/${slug}?locale=${locale}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.error || 'Failed to fetch post' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (_error) {
    return { data: null, error: 'Network error' };
  }
}

/**
 * Get all slugs for static generation
 */
export async function getAllSlugs(
  contentType?: ContentType
): Promise<{ data: GetSlugsResponse | null; error?: string }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    let posts: BlogPostListItem[];
    if (contentType) {
      posts = getMockPosts(contentType);
    } else {
      posts = [...MOCK_BLOG_POSTS, ...MOCK_PRESS_POSTS];
    }

    return { data: { slugs: posts.map((p) => p.slug) } };
  }

  try {
    const url = contentType
      ? `${API_BASE_URL}/api/v1/blog/slugs?contentType=${contentType}`
      : `${API_BASE_URL}/api/v1/blog/slugs`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.error || 'Failed to fetch slugs' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (_error) {
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

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find the current post to determine content type
    const allPosts = [...MOCK_BLOG_POSTS, ...MOCK_PRESS_POSTS];
    const currentPost = allPosts.find((p) => p.slug === slug);

    if (!currentPost) {
      return { data: null, error: 'Post not found' };
    }

    // Get related posts of the same content type, excluding current
    const sameCategoryPosts = getMockPosts(currentPost.contentType)
      .filter((p) => p.slug !== slug)
      .slice(0, limit);

    return { data: { posts: sameCategoryPosts } };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/blog/${slug}/related?locale=${locale}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { data: null, error: errorData.error || 'Failed to fetch related posts' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (_error) {
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

  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const posts = getMockPosts(contentType);
    const totalPages = Math.ceil(posts.length / limit);

    return { data: { totalPages } };
  }

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
      return { data: null, error: errorData.error || 'Failed to fetch page count' };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (_error) {
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
