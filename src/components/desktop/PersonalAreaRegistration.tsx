"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, TextInput, Icon } from "@/components/shared";
import { Header } from "./Header";
import { Footer } from "./Footer";

// Globe watermark SVG for Personal Area (matches Figma design)
const PersonalAreaGlobe = () => (
  <svg
    className="absolute left-1/2 -translate-x-1/2 top-[85px] pointer-events-none"
    width="478"
    height="478"
    viewBox="0 0 478 478"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M453.659 131.959C438.059 100.859 414.359 72.7593 385.259 50.7593C348.459 22.9593 303.459 5.25922 258.559 1.05922C249.159 0.159223 239.659 -0.140777 230.259 0.0592231C176.859 1.55922 124.159 23.0593 81.8591 60.7593C39.6591 98.2593 11.5591 147.859 2.95906 200.359C-13.4409 299.959 39.6591 405.859 129.259 452.259C162.759 469.559 200.059 477.959 237.359 477.959C300.059 477.959 362.759 454.359 407.759 409.959C479.559 339.059 498.859 222.159 453.659 131.959ZM224.659 366.759V447.459C194.559 435.859 177.559 403.959 164.359 373.159C184.259 369.359 204.459 367.159 224.659 366.859V366.759ZM126.559 352.259C108.959 356.059 92.659 364.159 76.259 373.059C48.059 336.859 31.6591 295.059 29.6591 254.259H112.559C115.059 291.959 119.559 323.359 126.559 352.259ZM224.659 31.4592V112.159C213.259 112.059 203.159 111.559 193.959 110.659C187.259 110.059 171.759 107.859 164.059 106.159C177.759 75.7592 193.759 43.0592 224.659 31.4592ZM29.5591 224.659C30.7591 193.359 41.459 159.159 59.259 130.059C64.859 120.859 72.959 109.659 76.559 106.459C79.159 107.659 84.159 110.159 88.059 112.159C94.159 115.259 100.359 118.359 102.859 119.359C109.759 122.059 117.959 125.159 126.459 126.959C118.159 158.959 113.359 191.759 112.359 224.759H29.5591V224.659ZM96.559 84.9592C116.659 66.0592 140.659 51.3593 166.059 42.2593C153.559 59.0593 143.359 78.1592 135.459 99.4592C127.259 97.8592 106.159 89.6593 96.559 84.8593V84.9592ZM135.359 379.259C142.959 399.959 153.259 419.259 166.259 436.759C141.259 427.859 117.259 413.159 96.8591 394.259C107.359 388.859 127.659 380.659 135.259 379.259H135.359ZM224.659 252.759V337.559L154.759 344.259C148.459 318.659 141.759 286.359 141.859 252.759H224.659ZM224.659 141.359V224.659H141.859C142.059 197.159 146.259 167.659 154.759 134.659L224.659 141.359ZM449.259 254.259C446.559 298.559 429.359 341.159 401.659 372.659C383.559 362.259 367.659 355.659 352.459 352.259C359.759 323.059 364.259 291.659 366.559 254.259H449.359H449.259ZM343.359 99.3593C334.859 76.8593 324.859 57.9592 312.859 41.9592C337.459 50.5592 361.559 65.3592 382.359 84.9592C372.859 89.8592 351.759 97.8593 343.359 99.3593ZM254.259 224.659V141.359L324.159 134.659C330.359 159.859 336.959 191.759 337.059 224.659H254.259ZM381.659 394.159C362.959 412.359 338.759 427.259 312.959 436.559C325.359 419.959 335.459 400.959 343.359 379.859C355.959 381.759 367.859 387.559 379.459 393.059C380.259 393.459 380.959 393.759 381.759 394.159H381.659ZM254.259 337.659V254.259H337.059C337.059 284.759 331.059 315.059 324.159 345.859L254.259 337.659ZM254.259 366.759C263.659 366.759 273.559 367.359 284.359 368.459C292.359 369.259 306.559 370.559 315.159 372.259C300.259 405.859 283.859 436.359 254.259 447.559V366.759ZM366.559 224.659C365.159 189.859 360.459 156.959 352.459 126.659C369.459 122.959 386.359 116.059 402.859 106.159C431.359 141.459 447.659 183.159 449.359 224.659H366.559ZM319.659 110.159H319.859L320.059 110.759L319.659 110.159ZM254.259 112.159V31.3593C283.759 42.5593 300.159 72.8592 315.059 106.459C307.159 108.359 292.459 109.759 283.459 110.559C273.459 111.559 263.759 112.059 254.359 112.159H254.259Z"
      fill="#C6C6C6"
      fillOpacity="0.4"
    />
  </svg>
);

interface PersonalAreaRegistrationProps {
  onNavigateToLogin?: () => void;
}

export const PersonalAreaRegistration = ({
  onNavigateToLogin,
}: PersonalAreaRegistrationProps) => {
  const { personalArea } = siteContent;
  const { registration } = personalArea;

  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("TODO: Implement registration", formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-white relative overflow-hidden">
        {/* Globe Watermark - matches Figma positioning */}
        <PersonalAreaGlobe />

        {/* Form Container */}
        <div className="container relative z-10 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[740px] mx-auto"
          >
            {/* Title */}
            <h1 className="text-[32px] lg:text-[40px] font-bold text-[#1D1D1B] text-center leading-tight mb-12">
              {personalArea.title}
            </h1>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Row 1: Full Name | ID Number */}
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label={registration.fullNameLabel}
                  type="text"
                  size="lg"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  placeholder={registration.fullNamePlaceholder}
                />
                <TextInput
                  label={registration.idLabel}
                  type="text"
                  size="lg"
                  value={formData.idNumber}
                  onChange={handleChange("idNumber")}
                  placeholder={registration.idPlaceholder}
                />
              </div>

              {/* Row 2: Birth Date | Phone */}
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label={registration.birthDateLabel}
                  type="date"
                  size="lg"
                  value={formData.birthDate}
                  onChange={handleChange("birthDate")}
                  placeholder={registration.birthDatePlaceholder}
                />
                <TextInput
                  label={registration.phoneLabel}
                  type="tel"
                  size="lg"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  placeholder={registration.phonePlaceholder}
                />
              </div>

              {/* Row 3: Email | Password */}
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label={registration.emailLabel}
                  type="email"
                  size="lg"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder={registration.emailPlaceholder}
                />
                <TextInput
                  label={registration.passwordLabel}
                  type="password"
                  size="lg"
                  value={formData.password}
                  onChange={handleChange("password")}
                  placeholder={registration.passwordPlaceholder}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="min-w-[200px] flex items-center justify-center gap-2"
                >
                  {registration.submitButton}
                  <Icon name="check" size={20} className="text-white" />
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center text-[#706F6F]">
                {registration.hasAccount}{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-[#215388] hover:underline font-medium transition-colors"
                >
                  {registration.login}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PersonalAreaRegistration;
