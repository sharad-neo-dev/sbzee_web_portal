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
  Search,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/showcase/assuredPay/about/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/assuredPay/",
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
    <footer id="footer" className="bg-white border-t border-gray-200">
      <div className="container-custom py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:pl-20">
        {/* Search Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6 sm:mb-8">
          {/* Logo */}
          <div className="flex items-center space-x-2 font-bold text-xl lg:text-2xl w-full lg:w-auto">
            <Image
              src="/assets/logo/assuredpay.svg"
              alt="AssuredPay Logo"
              width={140}
              height={56}
              className="w-32 sm:w-36 lg:w-40 xl:w-44"
              draggable={false}
            />
            <span className="sr-only">AssuredPay</span>
          </div>

          {/* Search Bar */}
          <div className="flex items-center w-full lg:w-auto">
            <div className="flex items-center border border-gray-300 rounded-l-md overflow-hidden flex-1 lg:flex-initial">
              <div className="pl-2 sm:pl-3 pr-1 sm:pr-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your email to get the latest news"
                className="py-1.5 sm:py-2 px-1 outline-none border-none w-full lg:w-64 xl:w-80 text-sm sm:text-base"
              />
            </div>
            <button className="bg-[#303981] text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-r-md border border-[#303981] text-sm sm:text-base whitespace-nowrap">
              Search
            </button>
          </div>
        </div>

        <hr className="border-gray-300 my-6 sm:my-8 lg:my-10" />

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {/* Explore Section */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">
              Explore
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-gray-600 hover:text-accent-500 transition-colors duration-200 text-sm sm:text-base">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">
              Company
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              <a
                className="text-accent-600 hover:text-accent-700"
                href="https://assuredPay.com/">
                <strong>AssuredPay</strong>
              </a>{" "}
              is a consumer brand.
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div>
                <span className="text-gray-500">CIN:</span>{" "}
                U63999DL2024PTC432100
              </div>
              <div>
                <span className="text-gray-500">Registered Office:</span>
                <br />
                <em className="text-[10px] xs:text-xs">
                  Unacademy Center, Infinity Technopark, Unit no 502 5Th Floor
                  56A/16, Block-C, Phase 2, Sector 62, Noida, Uttar Pradesh
                  201309
                </em>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 pt-1">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                <a
                  href="mailto:support@assuredpay.com"
                  className="text-accent-500 hover:text-accent-600 transition-colors duration-200 text-xs sm:text-sm">
                  support@assuredpay.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">
              Legal
            </h4>
            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-accent-500 transition-colors duration-200 text-sm sm:text-base">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Social Platforms
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Join Us
            </p>

            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gray-100 hover:bg-accent-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.name}>
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-0">
            <p className="text-xs sm:text-sm text-gray-600 text-center md:text-left">
              AssuredPay @ {currentYear}. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <button
                onClick={handleScrollToTop}
                className="flex items-center space-x-1 transition-colors duration-200 hover:text-accent-500">
                <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
