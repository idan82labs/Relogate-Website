"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, Card, Stars, Accordion, Icon, MobileFooter } from "@/components/shared";
import { MobileHeader } from "./MobileHeader";
import { MobileHowItWorks } from "./MobileHowItWorks";

export const MobileHome = () => {
  const { hero, about, greenBanner, info, testimonials, articles, faq, contact } =
    siteContent;

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
        <Button variant="primary" size="md">
          {about.cta}
        </Button>
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
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-full border border-[#C6C6C6] flex items-center justify-center" aria-label="הקודם">
              <Icon name="chevronRight" size={16} className="text-[#1D1D1B]" />
            </button>
            <button className="w-8 h-8 rounded-full border border-[#C6C6C6] flex items-center justify-center" aria-label="הבא">
              <Icon name="chevronLeft" size={16} className="text-[#1D1D1B]" />
            </button>
          </div>
        </div>

        {/* Single article card for mobile */}
        <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
          <img
            src={articles.items[0].image}
            alt={articles.items[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1B]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-base font-normal leading-snug">
              {articles.items[0].title}
            </h3>
            <p className="text-white/70 text-xs mt-2">
              {articles.items[0].date}
            </p>
          </div>
        </div>
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

export default MobileHome;
