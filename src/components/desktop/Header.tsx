"use client";

import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";

export const Header = () => {
  const { nav } = siteContent;

  return (
    <header className="sticky top-0 z-50 bg-white h-[88px] border-b border-[#C6C6C6]">
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src="/logo-header.svg" alt="Relogate" style={{ width: '167px', height: '35.5px' }} />
        </a>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#1D1D1B] text-base hover:text-[#215388] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <Button variant="primary" size="md">
          {nav.cta}
        </Button>
      </div>
    </header>
  );
};

export default Header;
