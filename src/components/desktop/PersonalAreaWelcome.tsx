"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark, TextInput } from "@/components/shared";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const PersonalAreaWelcome = () => {
  const { personalArea } = siteContent;
  const { welcome } = personalArea;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = () => {
    console.log("TODO: Implement authentication", {
      email,
      password,
      mode: isLoginMode ? "login" : "register",
    });
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <main className="flex-1 bg-[#F9F6F1] relative overflow-hidden">
        {/* Globe Watermark */}
        <GlobeWatermark position="center" size={400} opacity={0.15} />

        {/* Form Container */}
        <div className="container relative z-10 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[480px] mx-auto"
          >
            {/* Title */}
            <h1 className="text-[32px] lg:text-[40px] font-bold text-[#1D1D1B] text-center leading-tight mb-12">
              {welcome.title}
            </h1>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Email Input */}
              <TextInput
                label={welcome.emailLabel}
                type="email"
                size="lg"
                value={email}
                onChange={setEmail}
                placeholder={welcome.emailPlaceholder}
              />

              {/* Password Input */}
              <TextInput
                label={welcome.passwordLabel}
                type="password"
                size="lg"
                value={password}
                onChange={setPassword}
                placeholder={welcome.passwordPlaceholder}
              />

              {/* Forgot Password Link */}
              {isLoginMode && (
                <div className="text-left">
                  <button
                    type="button"
                    className="text-sm text-[#215388] hover:underline transition-colors"
                  >
                    {welcome.forgotPassword}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoginMode ? welcome.loginButton : welcome.registerButton}
              </Button>

              {/* Toggle Login/Register */}
              <p className="text-center text-[#706F6F]">
                {isLoginMode ? welcome.noAccount : welcome.hasAccount}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#215388] hover:underline font-medium transition-colors"
                >
                  {isLoginMode ? welcome.register : welcome.login}
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

export default PersonalAreaWelcome;
