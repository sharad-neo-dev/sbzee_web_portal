"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  ArrowUp,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/showcase/sbzee/about/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/sbzeeapp/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61579758636635",
    icon: Facebook,
  },
];

const exploreLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Grievance Policy", href: "/grievance-policy" },
];

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const shouldHideFooter = pathname?.includes("downloadApp");
  if (shouldHideFooter) return null;

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    router.push(href);
  };

  return (
    <footer
      id="footer"
      className="bg-(--bg-white) border-t border-gray-200 mt-50">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Sbzee Fuels Life
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              A modern guide to why <strong>fresh fruits & vegetables</strong>{" "}
              matter every day—energy, immunity, focus, and sustainability.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 hover:bg-(--accent) text-gray-600 hover:text-(--text-white) rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.name}>
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-gray-600 hover:text-accent-500 transition-colors duration-200">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              <a
                className="text-accent-600 hover:text-accent-700"
                href="https://sbzee.com/">
                <strong>Sbzee</strong>
              </a>{" "}
              is a consumer brand.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="text-gray-500">CIN:</span>{" "}
                U63999DL2024PTC432100
              </div>
              <div>
                <span className="text-gray-500">Registered Office:</span>
                <br />
                <em className="text-xs">
                  Unacademy Center, Infinity Technopark, Unit no 502 5Th Floor
                  56A/16, Block-C, Phase 2, Sector 62, Noida, Uttar Pradesh
                  201309
                </em>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a
                  href="mailto:support@sbzee.com"
                  className="text-accent-500 hover:text-accent-600 transition-colors duration-200">
                  support@sbzee.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal & Download Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3 mb-6">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-accent-500 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 py-8 lg:mt-10">
          <p className="text-center lg:text-left font-semibold leading-snug text-[10px] sm:text-[10px] md:text-[16px] lg:text-[24px] text-(--accent)">
            Bringing freshness to your doorstep, download the Sbzee app.
          </p>

          <div className="flex flex-row gap-2 sm:gap-4 items-center justify-center">
            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps/details?id=com.jvfpl.sbzee"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-[120px] lg:w-[200px] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
              {/* Normal image */}
              <Image
                src="/assets/img/google_store.png"
                alt="Get it on Google Play"
                width={200}
                height={45}
                draggable={false}
                className="rounded-lg shadow-sm w-[120px] lg:w-[200px]"
              />

              {/* Hover image */}
              <Image
                src="/assets/img/google_store_active.png"
                alt="Download on the Play Store Hover"
                width={200}
                height={45}
                draggable={false}
                className="w-full absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              />
            </a>

            {/* Apple App Store */}
            <a
              href="https://apps.apple.com/in/app/sbzee/id6752216196"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-[120px] lg:w-[200px] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
              {/* Normal image */}
              <Image
                src="/assets/img/app_store.png"
                alt="Download on the App Store"
                width={200}
                height={45}
                draggable={false}
                className="w-full block transition-opacity duration-300 hover:opacity-0"
              />

              {/* Hover image */}
              <Image
                src="/assets/img/app_store_active.png"
                alt="Download on the App Store Hover"
                width={200}
                height={45}
                draggable={false}
                className="w-full absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {currentYear} Sbzee. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={handleScrollToTop}
                className="flex items-center space-x-1 text-accent-500 hover:text-accent-600 transition-colors duration-200">
                <ArrowUp className="w-4 h-4" />
                <span>Back to top</span>
              </button>
              <span className="text-gray-500">Made in Delhi-NCR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
