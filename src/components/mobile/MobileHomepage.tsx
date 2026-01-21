"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { MobileHeader } from "./MobileHeader";
import { MobileHowItWorks } from "./MobileHowItWorks";
import { siteContent } from "@/content/he";
import { Button, Accordion } from "@/components/shared";
import { MobileFooter } from "./MobileFooter";
import { useAuth } from "@/contexts";
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
 *
 * Correct Structure:
 * a) About text section (title + description)
 * b) CTA Button "למילוי השאלון האישי" (aligned right)
 * c) Hero image with banner
 * d) Video with RELOGATE text
 * e) Info description
 * f) Checklist with green marks (aligned right for RTL)
 * g) "איך זה עובד?" section (no card selected by default)
 * h) Testimonials (horizontal scroll)
 * i) Articles (horizontal scroll RTL, no buttons)
 * j) FAQ
 * k) Contact
 */
export const MobileHomepage = ({ onComplete: _onComplete }: MobileHomepageProps) => {
  const router = useRouter();
  const { hero, about, greenBanner, info, testimonials, articles, faq, contact } = siteContent;
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

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
        {/* a) About Text Section - FIRST */}
        <section className="px-4 pt-6 pb-4">
          {/* Title */}
          <h2 className="text-[18px] font-medium text-[#1D1D1B] text-right mb-4 leading-snug">
            {about.title}
            <br />
            {about.subtitle}
          </h2>

          {/* Description */}
          <p className="text-[14px] text-[#1D1D1B] text-right mb-6 whitespace-pre-line leading-relaxed">
            {about.description}
          </p>

          {/* b) CTA Button - aligned right */}
          <div dir="ltr" className="flex justify-end">
            <Button size="md" onClick={handleCtaClick}>
              למילוי השאלון האישי
            </Button>
          </div>
        </section>

        {/* c) Hero Image with Banner */}
        <section className="relative px-4 py-4">
          {/* Banner - Green/Teal strip on top */}
          <div className="bg-[#239083] rounded-t-[20px] py-3 px-4 flex items-center justify-center">
            <p className="text-[#f7f7f7] text-[14px] font-medium text-center">
              {hero.banner}
            </p>
          </div>

          {/* Hero Image - Connected to banner (rounded bottom corners only) */}
          <div className="relative rounded-b-[20px] overflow-hidden aspect-[343/240]">
            <Image
              src="/about-image.jpg"
              alt="Family relaxing - relocation lifestyle"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 343px"
              priority
            />
          </div>
        </section>

        {/* d) Video with RELOGATE text */}
        <section className="px-4 mb-6">
          <div className="relative rounded-[20px] overflow-hidden aspect-[343/400]">
            {/* Video Background */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/banner.webm" type="video/webm" />
              <source src="/videos/banner.mp4" type="video/mp4" />
            </video>
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-end justify-end p-6">
              <p className="text-white text-[26px] font-medium leading-tight text-right max-w-[300px]">
                {greenBanner.title}
              </p>
            </div>
          </div>
        </section>

        {/* e) Info Description */}
        <section className="px-4 py-4">
          <p className="text-[18px] text-[#1D1D1B] text-right mb-6 leading-relaxed">
            {info.description}
          </p>
        </section>

        {/* f) Checklist with Green Marks (aligned right for RTL) */}
        <section className="px-4 pb-6">
          <div className="space-y-3 mb-6">
            {info.checklist.map((item, index) => (
              <div key={index} className="flex items-start gap-3" dir="ltr">
                <p className="text-[12px] text-[#1D1D1B] text-right leading-relaxed flex-1">
                  {item}
                </p>
                <Image
                  src="/icons/checkmark.svg"
                  alt=""
                  width={12}
                  height={9}
                  className="mt-1.5 flex-shrink-0"
                />
              </div>
            ))}
          </div>

          {/* CTA Button - aligned right */}
          <div dir="ltr" className="flex justify-end">
            <Button size="md" onClick={handleCtaClick}>
              {info.cta}
            </Button>
          </div>
        </section>

        {/* g) How It Works Section - No card selected by default */}
        <MobileHowItWorks />

        {/* h) Testimonials - Horizontal scroll */}
        <section className="py-10 px-4">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] text-right mb-6">
            {testimonials.title}
          </h2>

          {/* Horizontal Scroll Container */}
          <div
            ref={testimonialsRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
            dir="rtl"
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

        {/* i) Articles - Horizontal scroll RTL, NO buttons */}
        <section className="px-4 mb-8">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] text-right mb-4">
            {articles.title}
          </h2>

          {/* Horizontal Scroll Container - RTL (right to left) */}
          {isLoadingPosts ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4" dir="rtl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] h-[350px] rounded-[20px] bg-[#F7F7F7] animate-pulse"
                />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div
              ref={articlesRef}
              className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
              dir="rtl"
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/press/${post.slug}`}
                  className="flex-shrink-0 w-[280px]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="relative rounded-[20px] overflow-hidden h-[350px]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic content image */}
                    <img
                      src={post.featuredImageUrl || "/images/blog/placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(29,29,27,0.6)] to-transparent" />

                    {/* Article Info */}
                    <div className="absolute bottom-4 right-4 left-4 text-right">
                      <p className="text-white text-base leading-snug mb-2">
                        {post.title}
                      </p>
                      <p className="text-white/80 text-xs">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="relative rounded-[20px] overflow-hidden h-[350px] bg-[#F7F7F7] flex items-center justify-center">
              <p className="text-[#706F6F] text-sm">אין כתבות זמינות</p>
            </div>
          )}
        </section>

        {/* j) FAQ Section */}
        <section className="px-4 py-10">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] text-right mb-6">
            {faq.title}
          </h2>

          <Accordion items={faq.items} />
        </section>

        {/* k) Contact Section */}
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
