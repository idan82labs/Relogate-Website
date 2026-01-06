"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, GlobeWatermark, TextInput, Icon } from "@/components/shared";
import { MobileHeader } from "./MobileHeader";

export const MobilePersonalAreaWelcome = () => {
  const { personalArea, footer } = siteContent;
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
      <MobileHeader />

      {/* Main Content */}
      <main className="flex-1 bg-[#F9F6F1] relative overflow-hidden">
        {/* Globe Watermark */}
        <GlobeWatermark position="center" size={280} opacity={0.12} />

        {/* Form Container */}
        <div className="relative z-10 px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-full"
          >
            {/* Title */}
            <h1 className="text-[24px] font-bold text-[#1D1D1B] text-center leading-tight mb-8">
              {welcome.title}
            </h1>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-5"
            >
              {/* Email Input */}
              <TextInput
                label={welcome.emailLabel}
                type="email"
                size="md"
                value={email}
                onChange={setEmail}
                placeholder={welcome.emailPlaceholder}
              />

              {/* Password Input */}
              <TextInput
                label={welcome.passwordLabel}
                type="password"
                size="md"
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
                size="md"
                fullWidth
              >
                {isLoginMode ? welcome.loginButton : welcome.registerButton}
              </Button>

              {/* Toggle Login/Register */}
              <p className="text-center text-sm text-[#706F6F]">
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

      {/* Mobile Footer */}
      <footer className="bg-[#215388] py-8 px-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <a href="/" className="flex items-center mb-4">
            <img
              src="/logo-white.svg"
              alt="Relogate"
              style={{ width: "140px", height: "29px" }}
            />
          </a>

          <div className="text-white/80 text-sm space-y-1 mb-4">
            <p>{footer.email}</p>
            <p>{footer.phone}</p>
          </div>

          <div className="flex gap-3 mb-4">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              aria-label="Facebook"
            >
              <Icon name="facebook" size={16} className="text-white" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              aria-label="Instagram"
            >
              <Icon name="instagram" size={16} className="text-white" />
            </a>
          </div>

          <p className="text-white/60 text-xs">{footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default MobilePersonalAreaWelcome;
