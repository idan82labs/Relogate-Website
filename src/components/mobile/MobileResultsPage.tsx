"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { MobileHeader } from "./MobileHeader";
import { MobileFooter } from "./MobileFooter";
import { CategoryTag, MatchScoreCircle } from "@/components/shared";

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
}

interface MobileResultsPageProps {
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
 * MobileResultsPage - Mobile results page showing personalized relocation recommendations
 */
export const MobileResultsPage = ({
  userData = siteContent.reportResults.mockData,
  countries = siteContent.reportResults.mockData.countries,
}: MobileResultsPageProps) => {
  const { reportResults } = siteContent;
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("visa");
  const carouselRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.id === selectedCountryId);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileHeader />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[180px] overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[rgba(33,83,136,0.7)]" />
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[26px] font-medium text-white text-center leading-tight"
            >
              {reportResults.heroBanner.title}
            </motion.h1>
          </div>
        </section>

        {/* Profile Summary Section */}
        <section className="px-4 py-6 relative">
          {/* Globe watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="/globe-watermark.svg"
              alt=""
              className="w-[200px] h-[200px] object-contain opacity-10"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10">
            {/* Greeting */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[36px] font-medium text-black text-right mb-1"
            >
              {reportResults.greeting} {userData.userName}
            </motion.h2>

            <p className="text-[14px] text-[#1D1D1B] text-right mb-6">
              {reportResults.profileSummary.title}
            </p>

            {/* Profile Data */}
            <h3 className="text-[24px] font-medium text-[#239083] mb-3 text-right">
              {reportResults.profileSummary.profileDataTitle}
            </h3>
            <div className="space-y-1 text-[14px] text-right">
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
        </section>

        {/* Report Section */}
        <section className="px-4 py-6">
          <h2 className="text-[24px] font-medium text-black text-right mb-2">
            {reportResults.reportSection.title}
          </h2>
          <p className="text-[14px] text-[#1D1D1B] text-right mb-6">
            {reportResults.reportSection.description}
          </p>
        </section>

        {/* Country Cards Carousel */}
        <section className="bg-[#F7F7F7] py-6">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {countries.map((country) => (
              <motion.div
                key={country.id}
                className={`flex-shrink-0 rounded-[20px] overflow-hidden cursor-pointer relative ${
                  selectedCountryId === country.id
                    ? "w-[261px] h-[360px]"
                    : "w-[171px] h-[280px]"
                }`}
                style={{ scrollSnapAlign: "center" }}
                onClick={() =>
                  setSelectedCountryId(
                    selectedCountryId === country.id ? null : country.id
                  )
                }
                whileTap={{ scale: 0.98 }}
                layout
              >
                {/* Background image */}
                <img
                  src={country.image}
                  alt={country.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 ${
                    selectedCountryId === country.id
                      ? "bg-[rgba(33,83,136,0.9)]"
                      : "bg-gradient-to-t from-[rgba(29,29,27,0.6)] via-transparent to-transparent"
                  }`}
                />

                {/* Content */}
                {selectedCountryId === country.id ? (
                  // Expanded content
                  <div className="absolute inset-0 p-4 text-white text-right flex flex-col">
                    <h3 className="font-medium text-[24px] mb-2">{country.name}</h3>
                    <div className="text-[14px] leading-relaxed">
                      <p className="mb-1">
                        <span>מסלול ויזה: </span>
                        <span>{country.visaType}</span>
                      </p>
                      <p className="mb-1">
                        <span>ציון התאמה כללי: </span>
                        <span>{country.matchScore}%</span>
                      </p>
                      {country.matchReasons.length > 0 && (
                        <>
                          <p className="mb-1">סיבות התאמה:</p>
                          <ul className="list-disc list-inside mr-2 text-[12px]">
                            {country.matchReasons.slice(0, 3).map((reason, index) => (
                              <li key={index} className="mb-1 leading-snug">
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  // Collapsed content
                  <>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-right">
                      <h3 className="font-medium text-[24px] mb-1">{country.name}</h3>
                      <p className="text-[16px]">
                        ציון התאמה: {country.matchScore}%
                      </p>
                    </div>
                    <div className="absolute top-3 left-3">
                      <MatchScoreCircle score={country.matchScore} size="sm" />
                    </div>
                  </>
                )}
              </motion.div>
            ))}
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
              <div className="px-4 py-6">
                {/* Country Title */}
                <h2 className="text-[24px] font-medium text-[#215388] text-center mb-4">
                  {selectedCountry.name} {selectedCountry.englishName}
                </h2>

                {/* Country Description */}
                <p className="text-[16px] text-[#1D1D1B] text-right mb-6 leading-relaxed">
                  {selectedCountry.description}
                </p>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-2 justify-end mb-6">
                  {reportResults.categories.slice(0, 6).map((category) => (
                    <CategoryTag
                      key={category.id}
                      label={category.label}
                      isSelected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-[12px] px-3 py-1.5"
                    />
                  ))}
                </div>

                {/* Visa Info (shown when visa category selected) */}
                {selectedCategory === "visa" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[10px] p-4 shadow-sm border border-[#C6C6C6]"
                  >
                    <h3 className="text-[18px] font-medium text-[#239083] mb-4 text-right">
                      {reportResults.countryDetail.visaPathTitle}
                    </h3>
                    <div className="text-[16px] text-[#1D1D1B] text-right leading-relaxed whitespace-pre-line">
                      {selectedCountry.visaInfo}
                    </div>
                  </motion.div>
                )}

                {/* Other categories placeholder */}
                {selectedCategory !== "visa" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[10px] p-4 shadow-sm border border-[#C6C6C6] text-center"
                  >
                    <p className="text-[16px] text-[#706F6F]">
                      מידע נוסף יתווסף בקרוב
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Related Articles Section */}
        <section className="bg-[#F7F7F7] px-4 py-6">
          <h2 className="text-[24px] font-medium text-[#1D1D1B] text-center mb-6">
            {reportResults.relatedArticles.title}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {siteContent.articles.items.slice(0, 2).map((article, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-[10px] overflow-hidden shadow-sm cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-[100px] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-right">
                  <h3 className="text-[14px] font-medium text-[#1D1D1B] mb-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[12px] text-[#706F6F]">
                    {article.date.split(" ")[0]} {article.date.split(" ")[1]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <MobileFooter />
    </div>
  );
};

export default MobileResultsPage;
