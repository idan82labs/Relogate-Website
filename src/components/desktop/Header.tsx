"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { siteContent } from "@/content/he";
import { Button, NotificationBell } from "@/components/shared";
import { useAuth } from "@/contexts";

// Page-based navigation items (not anchor links)
const pageNavItems = [
  { label: "מאגר הידע", href: "/blog" },
  { label: "כתבו עלינו", href: "/press" },
];

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
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

  // Check if we're on the homepage (to show anchor links) or other pages
  const isHomepage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white h-[88px] border-b border-[#C6C6C6]">
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo-header.svg" alt="Relogate" width={167} height={36} priority />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* Homepage anchor links (only on homepage) */}
          {isHomepage &&
            nav.items.slice(0, 4).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[#1D1D1B] text-base hover:text-[#215388] transition-colors"
              >
                {item.label}
              </a>
            ))}

          {/* Page navigation links (always visible) */}
          {pageNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-[#215388] font-medium"
                  : "text-[#1D1D1B] hover:text-[#215388]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Notifications and CTA */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <Button variant="primary" size="md" onClick={handlePersonalAreaClick}>
            {nav.cta}
          </Button>
        </div>
      </div>
    </header>
  );
};

