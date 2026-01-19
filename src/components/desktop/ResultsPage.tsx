"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CategoryTag, CountryCard } from "@/components/shared";
import { renderMarkdown } from "@/lib/markdown";

interface CountrySection {
  key: string;
  title: string;
  icon?: string;
  content: string;
  position: number;
}

interface Country {
  id: string;
  name: string;
  englishName: string;
  matchScore: number;
  visaType: string;
  image: string;
  matchReasons: string[];
  description: string;
  visaInfo: string;
  sections?: CountrySection[];
}

interface ResultsPageProps {
  // TODO: Replace with actual data from backend
  userData?: {
    userName: string;
    profile: {
      citizenship: string;
      age: string;
      profession: string;
      familyStatus: string;
      netIncome: string;
      passiveIncome: string;
      relocationGoals: string;
    };
  };
  countries?: Country[];
}

/**
 * ResultsPage - Desktop results page showing personalized relocation recommendations
 */
export const ResultsPage = ({
  userData = siteContent.reportResults.mockData,
  countries = siteContent.reportResults.mockData.countries,
}: ResultsPageProps) => {
  const { reportResults } = siteContent;
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("visa");

  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[500px] overflow-hidden">
          <Image
            src="/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(33,83,136,0.7)]" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[65px] font-medium text-white text-center"
            >
              {reportResults.heroBanner.title}
            </motion.h1>
          </div>
        </section>

        {/* Profile Summary Section */}
        <section className="container py-12 relative">
          {/* Globe watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/globe-watermark.svg"
              alt=""
              width={400}
              height={400}
              className="object-contain opacity-10"
              aria-hidden="true"
            />
          </div>

          <div className="max-w-[1200px] mx-auto relative z-10">
            {/* Greeting */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[48px] font-medium text-black text-right mb-2"
            >
              {reportResults.greeting} {userData.userName}
            </motion.h2>

            <p className="text-[18px] text-[#1D1D1B] text-right mb-8">
              {reportResults.profileSummary.title}
            </p>

            {/* Profile Data */}
            <div className="flex gap-12">
              {/* Profile Summary */}
              <div className="flex-1 text-right">
                <h3 className="text-[24px] font-medium text-[#239083] mb-4">
                  {reportResults.profileSummary.profileDataTitle}
                </h3>
                <div className="space-y-2 text-[18px]">
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.citizenship}</span>{" "}
                    {userData.profile.citizenship}
                  </p>
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.age}</span>{" "}
                    {userData.profile.age}
                  </p>
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.profession}</span>{" "}
                    {userData.profile.profession}
                  </p>
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.familyStatus}</span>{" "}
                    {userData.profile.familyStatus}
                  </p>
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.netIncome}</span>{" "}
                    {userData.profile.netIncome}
                  </p>
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.passiveIncome}</span>{" "}
                    {userData.profile.passiveIncome}
                  </p>
                  <p>
                    <span className="font-medium">{reportResults.profileSummary.fields.relocationGoals}</span>{" "}
                    {userData.profile.relocationGoals}
                  </p>
                </div>
              </div>

              {/* Sharing placeholder */}
              <div className="w-[300px] bg-[#F7F7F7] rounded-[20px] p-6 text-center">
                <h4 className="text-[18px] font-medium text-[#706F6F] mb-4">
                  {reportResults.sharing.title}
                </h4>
                <p className="text-[14px] text-[#B2B2B2]">
                  {reportResults.sharing.placeholder}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Report Section */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-[48px] font-medium text-black text-right mb-4">
                {reportResults.reportSection.title}
              </h2>
              <p className="text-[18px] text-[#1D1D1B] text-right mb-10 max-w-[800px] mr-0 ml-auto">
                {reportResults.reportSection.description}
              </p>
            </div>
          </div>

          {/* Country Cards */}
          <div className="bg-[#F7F7F7] py-12">
            <div className="container">
              <div className="flex justify-center gap-6 flex-wrap">
                {countries.map((country) => (
                  <CountryCard
                    key={country.id}
                    name={country.name}
                    matchScore={country.matchScore}
                    image={country.image}
                    isSelected={selectedCountryId === country.id}
                    isExpanded={selectedCountryId === country.id}
                    visaType={country.visaType}
                    matchReasons={country.matchReasons}
                    onClick={() =>
                      setSelectedCountryId(
                        selectedCountryId === country.id ? null : country.id
                      )
                    }
                    size={selectedCountryId === country.id ? "lg" : "lg"}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Country Detail Section (when expanded) */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="container py-12">
                <div className="max-w-[1200px] mx-auto">
                  {/* Country Title */}
                  <h2 className="text-[48px] font-medium text-[#215388] text-center mb-6">
                    {selectedCountry.name} {selectedCountry.englishName}
                  </h2>

                  {/* Country Description */}
                  <p className="text-[18px] text-[#1D1D1B] text-right mb-10 leading-relaxed">
                    {selectedCountry.description}
                  </p>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-3 justify-end mb-8">
                    {reportResults.categories.map((category) => (
                      <CategoryTag
                        key={category.id}
                        label={category.label}
                        isSelected={selectedCategory === category.id}
                        onClick={() => setSelectedCategory(category.id)}
                      />
                    ))}
                  </div>

                  {/* Section Content */}
                  {(() => {
                    // Find the section that matches the selected category
                    const section = selectedCountry.sections?.find(
                      (s) => s.key === selectedCategory
                    );

                    // For visa, also check visaInfo as fallback
                    if (selectedCategory === "visa") {
                      const content = section?.content || selectedCountry.visaInfo;
                      if (content) {
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[20px] p-8 shadow-sm"
                          >
                            <h3 className="text-[24px] font-medium text-[#239083] mb-6 text-right flex items-center gap-2 justify-end">
                              {section?.icon && <span>{section.icon}</span>}
                              {section?.title || reportResults.countryDetail.visaPathTitle}
                            </h3>
                            <div className="text-[18px] text-[#1D1D1B] text-right leading-relaxed">
                              {renderMarkdown(content)}
                            </div>
                          </motion.div>
                        );
                      }
                    }

                    // For other categories, show section content if available
                    if (section) {
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-[20px] p-8 shadow-sm"
                        >
                          <h3 className="text-[24px] font-medium text-[#239083] mb-6 text-right flex items-center gap-2 justify-end">
                            {section.icon && <span>{section.icon}</span>}
                            {section.title}
                          </h3>
                          <div className="text-[18px] text-[#1D1D1B] text-right leading-relaxed">
                            {renderMarkdown(section.content)}
                          </div>
                        </motion.div>
                      );
                    }

                    // Fallback: no content available
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[20px] p-8 shadow-sm text-center"
                      >
                        <p className="text-[18px] text-[#706F6F]">
                          מידע נוסף יתווסף בקרוב
                        </p>
                      </motion.div>
                    );
                  })()}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Related Articles Section */}
        <section className="bg-[#F7F7F7] py-12">
          <div className="container">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-[36px] font-medium text-[#1D1D1B] text-center mb-8">
                {reportResults.relatedArticles.title}
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {siteContent.articles.items.slice(0, 3).map((article, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-[20px] overflow-hidden shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative h-[200px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic content image */}
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-right">
                      <h3 className="text-[18px] font-medium text-[#1D1D1B] mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[14px] text-[#706F6F]">
                        {article.date.split(" ")[0]} {article.date.split(" ")[1]}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
