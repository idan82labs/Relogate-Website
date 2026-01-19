"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteContent } from "@/content/he";
import { Button, Card, Stars, Accordion, Icon } from "@/components/shared";
import { MobileFooter } from "./MobileFooter";
import { MobileHeader } from "./MobileHeader";
import { MobileHowItWorks } from "./MobileHowItWorks";
import { listPosts } from "@/services/blog";
import type { BlogPostListItem } from "@/types/blog";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `פורסם ב${formatter.format(date)}`;
}

export const MobileHome = () => {
  const { hero, about, greenBanner, info, testimonials, articles, faq, contact } =
    siteContent;

  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await listPosts({ contentType: "press", limit: 8 });
      if (data?.posts) {
        setPosts(data.posts);
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const currentPost = posts[currentIndex];

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader />

      {/* Hero Banner */}
      <div className="bg-[#215388] py-2">
        <p className="text-white text-center text-sm font-medium px-4">
          {hero.banner}
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[4/3] mx-4 mt-4 rounded-[20px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D1D1B] to-[#215388]" />
      </div>

      {/* About Section */}
      <section className="px-4 py-8">
        <h2 className="text-lg font-medium text-[#1D1D1B] mb-4">
          {about.title}
          <br />
          {about.subtitle}
        </h2>
        <p className="text-sm text-[#1D1D1B] mb-6 whitespace-pre-line leading-relaxed">
          {about.description}
        </p>
        <Link href="/blog">
          <Button variant="primary" size="md">
            {about.blogCta}
          </Button>
        </Link>
      </section>

      {/* Green Banner Section */}
      <section className="relative mx-4 rounded-[20px] overflow-hidden aspect-[4/5]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1D1D1B] to-[#215388]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#215388]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 p-6 flex items-end">
          <p className="text-xl font-medium text-white leading-snug">
            {greenBanner.title}
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 py-8">
        <p className="text-base text-[#1D1D1B] mb-6 leading-relaxed">
          {info.description}
        </p>
        <ul className="space-y-3 mb-6">
          {info.checklist.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-[#239083] rounded-full flex items-center justify-center mt-0.5">
                <Icon name="check" size={12} className="text-white" />
              </span>
              <span className="text-sm text-[#1D1D1B]">{item}</span>
            </li>
          ))}
        </ul>
        <Button variant="primary" size="md">
          {info.cta}
        </Button>
      </section>

      {/* How It Works */}
      <MobileHowItWorks />

      {/* Testimonials */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-medium text-[#1D1D1B] mb-6">
          {testimonials.title}
        </h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {testimonials.items.map((testimonial, index) => (
            <Card
              key={index}
              padding="md"
              className="flex-none w-[214px] bg-[#F7F7F7]"
            >
              <Stars rating={testimonial.rating} size="sm" />
              <p className="text-sm text-[#1D1D1B] mt-3 mb-4 leading-relaxed">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C6C6C6]" />
                <div>
                  <p className="text-sm font-medium text-[#1D1D1B]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[#706F6F]">{testimonial.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-[#1D1D1B]">
            {articles.title}
          </h2>
          <div className="flex items-center gap-2">
            <Link
              href="/press"
              className="text-[#215388] hover:underline text-xs font-medium"
            >
              לכל הכתבות
            </Link>
            <div className="flex gap-1">
              <button
                onClick={goToPrevious}
                disabled={posts.length === 0}
                className="w-8 h-8 rounded-full border border-[#C6C6C6] flex items-center justify-center disabled:opacity-50"
                aria-label="הקודם"
              >
                <Icon name="chevronRight" size={16} className="text-[#1D1D1B]" />
              </button>
              <button
                onClick={goToNext}
                disabled={posts.length === 0}
                className="w-8 h-8 rounded-full border border-[#C6C6C6] flex items-center justify-center disabled:opacity-50"
                aria-label="הבא"
              >
                <Icon name="chevronLeft" size={16} className="text-[#1D1D1B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Article card */}
        {isLoading ? (
          <div className="relative aspect-[4/5] rounded-[20px] bg-[#F7F7F7] animate-pulse" />
        ) : currentPost ? (
          <Link href={`/press/${currentPost.slug}`}>
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic content image from CMS */}
              <img
                src={currentPost.featuredImageUrl || "/images/blog/placeholder.jpg"}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1B]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-base font-normal leading-snug">
                  {currentPost.title}
                </h3>
                <p className="text-white/70 text-xs mt-2">
                  {formatDate(currentPost.publishedAt)}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#F7F7F7] flex items-center justify-center">
            <p className="text-[#706F6F] text-sm">אין כתבות להצגה</p>
          </div>
        )}

        {/* Pagination dots */}
        {posts.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-[#215388]" : "bg-[#C6C6C6]"
                }`}
                aria-label={`עבור לכתבה ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-medium text-[#1D1D1B] mb-6">{faq.title}</h2>
        <Accordion items={faq.items} />
      </section>

      {/* Contact */}
      <section className="py-8 px-4 text-center">
        <h2 className="text-2xl font-medium text-[#1D1D1B] mb-4">
          {contact.title}
        </h2>
        <div className="w-12 h-12 mx-auto mb-4 text-[#215388]">
          <Icon name="globe" size={48} />
        </div>
        <div className="space-y-1 mb-4">
          <a href={`mailto:${contact.email}`} className="block text-sm text-[#1D1D1B]">
            {contact.email}
          </a>
          <a href={`tel:${contact.phone}`} className="block text-sm text-[#1D1D1B]" dir="ltr">
            {contact.phone}
          </a>
        </div>
        <p className="text-sm text-[#1D1D1B] whitespace-pre-line">
          {contact.description}
        </p>
      </section>

      <MobileFooter />
    </div>
  );
};
