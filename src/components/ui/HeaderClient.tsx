"use client";

import { useState, useEffect } from "react";
import { Menu, X, Download, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderClientProps {
  navigation: { name: string; href: string }[];
}

export function HeaderClient({ navigation }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("drawer-open");
    } else {
      document.body.style.overflow = original;
      document.body.classList.remove("drawer-open");
    }
    return () => {
      document.body.style.overflow = original;
      document.body.classList.remove("drawer-open");
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(href);
  };

  const handleScrollToBottom = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      const yOffset = -80;
      const y =
        footer.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        {navigation.map((item) => (
          <div
            key={item.name}
            className=" hover:underline hover:text-[--accent] px-3 "
          >
            <button
              onClick={() => handleNavClick(item.href)}
              className="font-normal select-none text-gray-700 hover:text-[--accent] transition-colors duration-300 after:content-[''] after:block after:w-0 after:h-0.5 after:bg-[--accent] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </button>
          </div>
        ))}
        <button
          className="btn-accent flex items-center rounded-full space-x-2"
          onClick={handleScrollToBottom}
        >
          <span>Login/Register</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[--accent] hover:bg-gray-100 transition-colors duration-200"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-drawer"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        {/* Overlay */}
        <button
          aria-hidden={!isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300",
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        />

        <aside
          id="mobile-drawer"
          aria-hidden={!isMobileMenuOpen}
          className={cn(
            "fixed top-0 right-0 z-[70] h-screen bg-white shadow-xl transition-transform duration-300 ease-out w-[100vw]",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="font-semibold">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:text-accent-500 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-4 py-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-3 py-3 rounded-lg text-gray-800 hover:text-accent-600 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
