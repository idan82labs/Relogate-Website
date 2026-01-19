import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteContent } from "@/content/he";
import { listPosts, getTotalPages } from "@/services/blog";
import { PressListingClient } from "../../PressListingClient";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PaginatedPressPageProps {
  params: Promise<{ page: string }>;
}

// Generate static paths for all pages
export async function generateStaticParams() {
  const result = await getTotalPages({ contentType: "press", limit: 6 });
  const totalPages = result.data?.totalPages ?? 1;

  // Generate params for pages 2 onwards (page 1 is handled by /press)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: PaginatedPressPageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  return {
    title: `${siteContent.blog.meta.pressTitle} - עמוד ${pageNum}`,
    description: siteContent.blog.meta.pressDescription,
  };
}

export default async function PaginatedPressPage({ params }: PaginatedPressPageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  // Redirect to main page if page is 1 or invalid
  if (isNaN(pageNum) || pageNum < 1) {
    redirect("/press");
  }

  if (pageNum === 1) {
    redirect("/press");
  }

  // Fetch posts for this page
  const [postsResult, pagesResult] = await Promise.all([
    listPosts({ contentType: "press", page: pageNum, limit: 6 }),
    getTotalPages({ contentType: "press", limit: 6 }),
  ]);

  const posts = postsResult.data?.posts ?? [];
  const totalPages = pagesResult.data?.totalPages ?? 1;

  // Redirect to last valid page if page is out of range
  if (pageNum > totalPages) {
    redirect(totalPages === 1 ? "/press" : `/press/page/${totalPages}`);
  }

  return (
    <PressListingClient
      initialPosts={posts}
      currentPage={pageNum}
      totalPages={totalPages}
    />
  );
}
