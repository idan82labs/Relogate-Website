import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllSlugs } from "@/services/blog";
import { BlogArticleClient } from "./BlogArticleClient";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const result = await getAllSlugs("blog");
  const slugs = result.data?.slugs ?? [];

  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug({ slug });

  if (!result.data?.post) {
    return {
      title: "מאמר לא נמצא | Relogate",
    };
  }

  const post = result.data.post;

  return {
    title: post.metaTitle || `${post.title} | Relogate`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;

  // Fetch post and related posts in parallel
  const [postResult, relatedResult] = await Promise.all([
    getPostBySlug({ slug }),
    getRelatedPosts({ slug, limit: 3 }),
  ]);

  if (!postResult.data?.post) {
    notFound();
  }

  const post = postResult.data.post;
  const relatedPosts = relatedResult.data?.posts ?? [];

  return (
    <BlogArticleClient
      post={post}
      relatedPosts={relatedPosts}
    />
  );
}
