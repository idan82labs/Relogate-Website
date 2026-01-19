import type { Metadata } from "next";
import { siteContent } from "@/content/he";
import { listPosts, getTotalPages } from "@/services/blog";
import { PressListingClient } from "./PressListingClient";

// ISR: Revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: siteContent.blog.meta.pressTitle,
  description: siteContent.blog.meta.pressDescription,
};

export default async function PressPage() {
  // Fetch first page of posts
  const [postsResult, pagesResult] = await Promise.all([
    listPosts({ contentType: "press", page: 1, limit: 6 }),
    getTotalPages({ contentType: "press", limit: 6 }),
  ]);

  const posts = postsResult.data?.posts ?? [];
  const totalPages = pagesResult.data?.totalPages ?? 1;

  return (
    <PressListingClient
      initialPosts={posts}
      currentPage={1}
      totalPages={totalPages}
    />
  );
}
