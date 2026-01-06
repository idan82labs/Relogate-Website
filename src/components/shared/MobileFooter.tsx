"use client";

import { siteContent } from "@/content/he";
import { Icon } from "./Icon";

interface MobileFooterProps {
  /** Show legal links section (Privacy, Terms, etc.) */
  showLegalLinks?: boolean;
  /** Use compact variant (less padding/margins) - default for login/register pages */
  variant?: "default" | "compact";
}

/**
 * MobileFooter - Shared footer component for mobile pages
 * - compact variant: Used in login/register pages (smaller margins)
 * - default variant: Used in homepage (larger margins, optional legal links)
 */
export const MobileFooter = ({
  showLegalLinks = false,
  variant = "compact",
}: MobileFooterProps) => {
  const { footer } = siteContent;

  const isCompact = variant === "compact";

  return (
    <footer className={`bg-[#215388] ${isCompact ? "py-8" : "py-10"} px-4`}>
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <a href="/" className={`flex items-center ${isCompact ? "mb-4" : "mb-6"}`}>
          <img
            src="/logo-white.svg"
            alt="Relogate"
            className={isCompact ? "" : "h-9 w-auto"}
            style={isCompact ? { width: "140px", height: "29px" } : undefined}
          />
        </a>

        {/* Contact Info */}
        <div className={`text-sm ${isCompact ? "text-white/80 space-y-1" : "text-white"} mb-4`}>
          <p>{footer.email}</p>
          <p>{footer.phone}</p>
        </div>

        {/* Social Icons */}
        <div className={`flex gap-3 ${isCompact ? "mb-4" : "mb-6"}`}>
          {isCompact ? (
            <>
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
            </>
          ) : (
            <img
              src="/icons/social-fb-ig.svg"
              alt="Follow us on social media"
              width={50}
              height={25}
            />
          )}
        </div>

        {/* Legal Links (optional) */}
        {showLegalLinks && footer.links && (
          <div className="text-[10px] text-white/80 mb-2">
            <p>
              {footer.links.map((link, i) => (
                <span key={link.href}>
                  <a href={link.href} className="hover:text-white">
                    {link.label}
                  </a>
                  {i < footer.links.length - 1 && " | "}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Copyright */}
        <p className={`text-white/60 ${isCompact ? "text-xs" : "text-[10px]"}`}>
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
};

export default MobileFooter;
