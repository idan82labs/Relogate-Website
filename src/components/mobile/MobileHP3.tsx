"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MobileHeader } from "./MobileHeader";
import { siteContent } from "@/content/he";
import { Button, Card, Accordion, MobileFooter } from "@/components/shared";

interface MobileHP3Props {
  onComplete?: () => void;
}

/**
 * Mobile HP3 - Full mobile homepage
 * Based on Figma design (mobile HP3: node 265-683)
 */
export const MobileHP3 = ({ onComplete: _onComplete }: MobileHP3Props) => {
  const router = useRouter();
  const { hero, about, greenBanner, info, howItWorks, testimonials, articles, faq, contact } = siteContent;
  const testimonialsRef = useRef<HTMLDivElement>(null);

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
        {/* Hero Section with Ribbon */}
        <section className="relative px-4 pt-6">
          {/* Globe Watermark */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] opacity-100 pointer-events-none">
            <img src="/globe-watermark.svg" alt="" className="w-full h-full" aria-hidden="true" />
          </div>

          {/* Hero Text */}
          <div className="relative z-10 text-right mb-6">
            <h1 className="text-lg font-medium text-[#1D1D1B] mb-3">
              {about.title}<br />
              {about.subtitle}
            </h1>
            <p className="text-sm text-[#1D1D1B] leading-relaxed whitespace-pre-line">
              {about.description}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-end mb-6">
            <Button size="sm" className="text-sm px-5 py-2.5" onClick={() => router.push("/questionnaire")}>
              {hero.cta}
            </Button>
          </div>

          {/* Hero Image Card with Ribbon Overlay */}
          <div className="relative rounded-[20px] overflow-hidden h-[268px] mb-8">
            <Image
              src="/about-image.jpg"
              alt="Family enjoying life abroad"
              fill
              className="object-cover"
            />

            {/* Ribbon Banner - positioned at top of image, rounded top, square bottom */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <div className="bg-[#239083] rounded-t-[20px] py-2.5 px-4 text-center">
                <p className="text-white text-sm font-medium">
                  {siteContent.hero.banner}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Statement Card */}
        <section className="px-4 mb-8">
          <div className="relative rounded-[20px] overflow-hidden h-[811px]">
            <Image
              src="/hero-5.jpg"
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] opacity-100 pointer-events-none -z-10">
              <img src="/globe-watermark.svg" alt="" className="w-full h-full" aria-hidden="true" />
            </div>

            <p className="text-lg text-[#1D1D1B] text-right mb-6 leading-relaxed">
              {info.description}
            </p>

            {/* Checklist */}
            <div className="space-y-3 mb-6">
              {info.checklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3 flex-row-reverse">
                  <img
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
              <Button size="sm" className="text-sm px-6 py-2.5">
                {info.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-[#F7F7F7] py-10 px-4 mb-0">
          <h2 className="text-[26px] font-medium text-[#1D1D1B] text-center mb-8">
            {howItWorks.title}
          </h2>

          <div className="space-y-5">
            {howItWorks.steps.map((step) => (
              <Card
                key={step.number}
                padding="md"
                className="bg-white"
              >
                <div className="flex gap-4">
                  {/* Step Number */}
                  <p className="font-['Satoshi',sans-serif] text-[40px] text-[#215388] leading-none">
                    {step.number}
                  </p>

                  <div className="flex-1 text-right">
                    {/* Step Title */}
                    <h3 className="text-2xl text-[#215388] mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#1D1D1B] mb-3">
                      {step.shortDescription}
                    </p>

                    {/* Read More Link */}
                    <button className="text-[11px] font-semibold text-[#1D1D1B] underline">
                      {step.readMore}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

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
                  <img
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
              <button className="p-1" aria-label="Previous article">
                <img src="/icons/arrow-left.svg" alt="" width={9} height={11} />
              </button>
              <button className="p-1" aria-label="Next article">
                <img src="/icons/arrow-right.svg" alt="" width={9} height={11} />
              </button>
            </div>
            <h2 className="text-[26px] font-medium text-[#1D1D1B]">
              {articles.title}
            </h2>
          </div>

          {/* Article Card */}
          <div className="relative rounded-[20px] overflow-hidden h-[450px]">
            <Image
              src={articles.items[0].image}
              alt={articles.items[0].title}
              fill
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(29,29,27,0.6)] to-transparent" />

            {/* Article Info */}
            <div className="absolute bottom-6 right-4 left-4 text-right">
              <p className="text-white text-base leading-snug mb-2">
                {articles.items[0].title}
              </p>
              <p className="text-white/80 text-xs">
                {articles.items[0].date}
              </p>
            </div>
          </div>
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
            <img
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

export default MobileHP3;
