import type { Metadata } from "next";
import { siteContent } from "@/content/he";
import { listPosts, getTotalPages } from "@/services/blog";
import { BlogListingClient } from "./BlogListingClient";

// ISR: Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: siteContent.blog.meta.blogTitle,
  description: siteContent.blog.meta.blogDescription,
};

export default async function BlogPage() {
  // Fetch first page of posts
  const [postsResult, pagesResult] = await Promise.all([
    listPosts({ contentType: "blog", page: 1, limit: 6 }),
    getTotalPages({ contentType: "blog", limit: 6 }),
  ]);

  const posts = postsResult.data?.posts ?? [];
  const totalPages = pagesResult.data?.totalPages ?? 1;

  return (
    <BlogListingClient
      initialPosts={posts}
      currentPage={1}
      totalPages={totalPages}
    />
  );
}
