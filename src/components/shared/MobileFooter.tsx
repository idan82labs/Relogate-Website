"use client";

import { siteContent } from "@/content/he";
import { Icon } from "./Icon";

/**
 * MobileFooter - Shared footer component for mobile pages
 * Based on the login/register page design
 */
export const MobileFooter = () => {
  const { footer } = siteContent;

  return (
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

        {/* Contact Info */}
        <div className="text-white/80 text-sm space-y-1 mb-4">
          <p>{footer.email}</p>
          <p>{footer.phone}</p>
        </div>

        {/* Social Icons */}
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

        {/* Copyright */}
        <p className="text-white/60 text-xs">{footer.copyright}</p>
      </div>
    </footer>
  );
};

export default MobileFooter;
