"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { MobileHeader } from "./MobileHeader";
import { MobileHowItWorks } from "./MobileHowItWorks";
import { siteContent } from "@/content/he";
import { Button, Accordion, HeroImageGrid } from "@/components/shared";
import { MobileFooter } from "./MobileFooter";
import { useAuth } from "@/contexts";
import { useHeroAnimation } from "@/hooks";
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

interface MobileHomepageProps {
  onComplete?: () => void;
}

/**
 * MobileHomepage - Full mobile homepage
 * Based on Figma design (mobile HP3: node 265-683)
 */
export const MobileHomepage = ({ onComplete: _onComplete }: MobileHomepageProps) => {
  const router = useRouter();
  const { hero, about, greenBanner, info, testimonials, articles, faq, contact } = siteContent;
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const { currentSetIndex } = useHeroAnimation();
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await listPosts({ contentType: "press", limit: 8 });
      if (data?.posts) {
        setPosts(data.posts);
      }
      setIsLoadingPosts(false);
    }
    fetchPosts();
  }, []);

  const scrollArticles = (direction: "prev" | "next") => {
    if (posts.length === 0) return;

    if (direction === "prev") {
      setCurrentArticleIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
    } else {
      setCurrentArticleIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
    }
  };

  const handleCtaClick = () => {
    if (hasCompletedOnboarding) {
      router.push("/questionnaire/results");
    } else if (isAuthenticated) {
      router.push("/questionnaire");
    } else {
      sessionStorage.setItem("redirectAfterLogin", "/questionnaire");
      router.push("/login");
    }
  };

  const ctaText = hasCompletedOnboarding ? hero.ctaViewResults : hero.cta;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="pt-[52px]">
        {/* Hero Section with Image Grid */}
        <section className="relative px-4 pt-6">
          {/* Hero Image Grid */}
          <div className="mb-6">
            <HeroImageGrid currentSetIndex={currentSetIndex} variant="mobile" />
          </div>

          {/* Hero Text */}
          <div className="relative z-10 text-right mb-6">
            <h1 className="text-[26px] font-medium text-[#1D1D1B] leading-tight mb-3">
              {hero.title}<br />
              {hero.subtitle}
            </h1>
          </div>
        </section>

        {/* Company Statement Card */}
        <section className="px-4 mb-8">
          <div className="relative rounded-[20px] overflow-hidden h-[811px]">
            <Image
              src="/hero/set1/5.jpg"
              alt="Relogate - International relocation"
              fill
              className="object-cover"
            />
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-end p-6">
              <p className="text-white text-[26px] font-medium leading-tight text-right">
                {greenBanner.title}
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 mb-8">
          {/* Globe Watermark for this section */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] opacity-20 pointer-events-none -z-10">
              <Image src="/globe-watermark.svg" alt="" fill aria-hidden="true" />
            </div>

            <p className="text-lg text-[#1D1D1B] text-right mb-6 leading-relaxed">
              {info.description}
            </p>

            {/* Checklist */}
            <div className="space-y-3 mb-6">
              {info.checklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3 flex-row-reverse">
                  <Image
                    src="/icons/checkmark.svg"
                    alt=""
                    width={12}
                    height={9}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-[#1D1D1B] text-right">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-end">
              <Button size="sm" className="text-sm px-6 py-2.5" onClick={handleCtaClick}>
                {hasCompletedOnboarding ? hero.ctaViewResults : info.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <MobileHowItWorks />

        {/* Testimonials Section */}
        <section className="py-10 px-4">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] text-right mb-6">
            {testimonials.title}
          </h2>

          {/* Horizontal Scroll Container */}
          <div
            ref={testimonialsRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {testimonials.items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[214px] bg-[#F7F7F7] rounded-[20px] p-4"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Stars */}
                <div className="flex justify-end mb-2">
                  <Image
                    src="/icons/stars-rating.svg"
                    alt={`${item.rating} stars`}
                    width={80}
                    height={13}
                  />
                </div>

                {/* Quote */}
                <p className="text-sm text-[#1D1D1B] text-right mb-4 leading-relaxed">
                  {item.text}
                </p>

                {/* Author */}
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="text-sm text-[#1D1D1B]">{item.name},</p>
                    <p className="text-sm text-[#1D1D1B]">{item.location}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={`/testimonials/avatar-${(index % 4) + 1}.${index === 0 ? 'png' : 'jpg'}`}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Press/Articles Section */}
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                className="p-1"
                aria-label="Previous article"
                onClick={() => scrollArticles("prev")}
              >
                <Image src="/icons/arrow-left.svg" alt="" width={9} height={11} />
              </button>
              <button
                className="p-1"
                aria-label="Next article"
                onClick={() => scrollArticles("next")}
              >
                <Image src="/icons/arrow-right.svg" alt="" width={9} height={11} />
              </button>
            </div>
            <h2 className="text-[26px] font-medium text-[#1D1D1B]">
              {articles.title}
            </h2>
          </div>

          {/* Article Card */}
          {isLoadingPosts ? (
            <div className="relative rounded-[20px] overflow-hidden h-[450px] bg-[#F7F7F7] animate-pulse" />
          ) : posts.length > 0 ? (
            <Link href={`/press/${posts[currentArticleIndex].slug}`}>
              <motion.div
                key={posts[currentArticleIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-[20px] overflow-hidden h-[450px] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic content image */}
                <img
                  src={posts[currentArticleIndex].featuredImageUrl || "/images/blog/placeholder.jpg"}
                  alt={posts[currentArticleIndex].title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(29,29,27,0.6)] to-transparent" />

                {/* Article Info */}
                <div className="absolute bottom-6 right-4 left-4 text-right">
                  <p className="text-white text-base leading-snug mb-2">
                    {posts[currentArticleIndex].title}
                  </p>
                  <p className="text-white/80 text-xs">
                    {formatDate(posts[currentArticleIndex].publishedAt)}
                  </p>
                </div>
              </motion.div>
            </Link>
          ) : (
            <div className="relative rounded-[20px] overflow-hidden h-[450px] bg-[#F7F7F7] flex items-center justify-center">
              <p className="text-[#706F6F] text-sm">אין כתבות זמינות</p>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-10">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] text-right mb-6">
            {faq.title}
          </h2>

          <Accordion items={faq.items} />
        </section>

        {/* Contact Section */}
        <section className="px-4 py-10 text-center">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] mb-4">
            {contact.title}
          </h2>

          {/* Social Icons */}
          <div className="flex justify-center gap-2 mb-4">
            <Image
              src="/icons/social-whatsapp-email.svg"
              alt="Contact via WhatsApp or Email"
              width={60}
              height={20}
            />
          </div>

          {/* Contact Details */}
          <div className="text-sm text-[#1D1D1B] mb-4">
            <p>{contact.email}</p>
            <p dir="ltr">{contact.phone}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-[#1D1D1B] whitespace-pre-line leading-relaxed">
            {contact.description}
          </p>
        </section>

        {/* Footer */}
        <MobileFooter />
      </main>
    </motion.div>
  );
};

