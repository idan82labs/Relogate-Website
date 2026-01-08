"use client";

import { siteContent } from "@/content/he";
import { Icon } from "@/components/shared";

export const Footer = () => {
  const { footer } = siteContent;

  return (
    <footer className="bg-[#215388] py-12 lg:py-16">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <a href="/" className="flex items-center mb-6">
            <img src="/logo-white.svg" alt="Relogate" style={{ width: '245px', height: '51px' }} />
          </a>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 text-white">
            <a
              href={`mailto:${footer.email}`}
              className="hover:text-[#239083] transition-colors"
            >
              {footer.email}
            </a>
            <span className="hidden sm:block">|</span>
            <a
              href={`tel:${footer.phone}`}
              className="hover:text-[#239083] transition-colors"
              dir="ltr"
            >
              {footer.phone}
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mb-8">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Facebook"
            >
              <Icon name="facebook" size={20} className="text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Instagram"
            >
              <Icon name="instagram" size={20} className="text-white" />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-white/80">
            {footer.links.map((link, index) => (
              <span key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </a>
                {index < footer.links.length - 1 && (
                  <span className="mr-4">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-white/60">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
