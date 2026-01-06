"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteContent } from "@/content/he";
import { Button, Icon } from "@/components/shared";

export const MobileHeader = () => {
  const { nav, mobile } = siteContent;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white h-[52px] border-b border-[#C6C6C6]">
        <div className="h-full px-4 flex items-center" dir="ltr">
          {/* Menu button - LEFT (visual) */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center"
            aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={isMenuOpen}
          >
            <Icon name="menu" size={24} className="text-[#1D1D1B]" />
          </button>

          {/* CTA Button - next to menu */}
          <Link href="/personal-area">
            <Button variant="primary" size="sm" className="ml-2 text-xs px-3 py-1.5">
              {nav.cta}
            </Button>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Logo - RIGHT (visual) */}
          <a href="/" className="flex items-center">
            <img
              src="/logo-header.svg"
              alt="Relogate"
              style={{ width: '120px', height: '25.5px' }}
            />
          </a>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeMenu}
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="תפריט ניווט"
            >
              {/* Close button */}
              <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#C6C6C6]">
                <button
                  onClick={closeMenu}
                  className="w-10 h-10 flex items-center justify-center"
                  aria-label="סגור תפריט"
                >
                  <Icon name="close" size={24} className="text-[#1D1D1B]" />
                </button>
                <span className="font-medium text-[#1D1D1B]">
                  {mobile.menu.close}
                </span>
              </div>

              {/* Navigation */}
              <nav className="p-6">
                <ul className="space-y-4">
                  {nav.items.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={closeMenu}
                        className="block py-2 text-lg text-[#1D1D1B] hover:text-[#215388] transition-colors"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA in menu */}
                <div className="mt-8">
                  <Link href="/personal-area" onClick={closeMenu}>
                    <Button variant="primary" size="md" fullWidth>
                      {nav.cta}
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
