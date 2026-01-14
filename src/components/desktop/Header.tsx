"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteContent } from "@/content/he";
import { Button } from "@/components/shared";
import { useAuth } from "@/contexts";

export const Header = () => {
  const router = useRouter();
  const { nav } = siteContent;
  const { isAuthenticated } = useAuth();

  const handlePersonalAreaClick = () => {
    if (isAuthenticated) {
      router.push("/personal-area");
    } else {
      // Store redirect destination for after login
      sessionStorage.setItem("redirectAfterLogin", "/personal-area");
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white h-[88px] border-b border-[#C6C6C6]">
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo-header.svg" alt="Relogate" style={{ width: '167px', height: '35.5px' }} />
        </Link>

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

        {/* CTA Button - Personal Area */}
        <Button variant="primary" size="md" onClick={handlePersonalAreaClick}>
          {nav.cta}
        </Button>
      </div>
    </header>
  );
};

export default Header;
