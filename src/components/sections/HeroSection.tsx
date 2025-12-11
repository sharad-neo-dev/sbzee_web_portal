import { Download, ArrowRight } from "lucide-react";
import { ParallaxSection } from "@/components/ui/ParallaxSection";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import Image from "next/image";
import { MobileCarousel } from "../ui/MobileCarousel";

export function HeroSection() {
  const chipsPoints = [
    "Get funds in 24-48 hours",
    "No collateral",
    "Transparent flat fee",
  ];

  const keyPoints = [
    "MCA registered entity",
    "Data hosted in India",
    "Backed by partner banks",
  ];

  return (
    <ParallaxSection
      backgroundImage=""
      className="min-h-screen flex items-center text-white">
      <div className="container-custom min-h-screen py-8 sm:py-12 lg:py-0 grid grid-cols-1 lg:grid-cols-2 items-center justify-around gap-8 lg:gap-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-3 space-y-4 lg:space-y-6 order-1 lg:order-1">
          <RevealOnScroll distance={10}>
            <p className="text-xs sm:text-sm text-orange-500 mb-3 sm:mb-4 px-3 py-1.5 sm:py-2 bg-orange-50 rounded-lg border border-orange-500 w-fit">
              Invoice Financing & Receivables Platform for MSMEs
            </p>
            <h1 className="font-black leading-tight mb-4 sm:mb-6">
              <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Turn Unpaid Invoices into
              </span>
              <span className="text-black text-xl sm:text-2xl md:text-3xl lg:text-5xl block mt-2">
                Working Capital
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2} distance={10}>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 max-w-3xl">
              Unlock working capital from unpaid invoices with AssuredPay —
              India's smart receivables platform for MSMEs.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4} distance={10}>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {chipsPoints.map((point, index) => (
                <p
                  key={index}
                  className="text-xs text-orange-500 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-orange-50 rounded-full border border-orange-500 w-fit">
                  {point}
                </p>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.6} distance={10}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="group flex items-center justify-between sm:justify-start gap-3 sm:gap-4 bg-gradient-to-r from-blue-700 to-blue-900 px-4 sm:px-6 py-3 sm:py-4 rounded-full border w-full sm:w-fit shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <p className="text-sm sm:text-base lg:text-lg text-white whitespace-nowrap">
                  Calculate Your Unlockable Cash
                </p>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" />
              </div>
              <div className="w-full sm:w-auto">
                <p className="text-sm sm:text-base text-[--accent] border border-[--accent] rounded-full px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:bg-blue-900 hover:text-white transition-colors duration-200 text-center">
                  Book a 20-Minute Demo
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.6} distance={10}>
            <div className="w-full bg-gray-100 rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Stars */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {/* 4 full stars */}
                  <span className="text-orange-400 text-xl sm:text-2xl">★</span>
                  <span className="text-orange-400 text-xl sm:text-2xl">★</span>
                  <span className="text-orange-400 text-xl sm:text-2xl">★</span>
                  <span className="text-orange-400 text-xl sm:text-2xl">★</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="text-orange-400 w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 24 24">
                    <path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2v15.27z"
                      fill="#E5E7EB"
                    />
                    <path d="M12 17.27V2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1">
                  Based on <span className="font-semibold">5149+</span> reviews:
                </p>
              </div>

              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <div className="sm:hidden w-full h-px bg-gray-300"></div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-bold text-lg sm:text-xl text-black">
                    G<sub className="text-xs sm:text-base">2</sub>
                  </span>
                  <span className="text-black font-semibold text-sm sm:text-base">
                    GetApp
                  </span>
                </div>

                <span className="text-black font-semibold text-sm sm:text-base">
                  Capterra
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.8} distance={10}>
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
              {keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 rounded-full flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-600">{point}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        <div className="flex flex-1 items-center justify-center lg:justify-around order-2 lg:order-2 mt-4 lg:mt-0">
          <RevealOnScroll delay={0.2} distance={100}>
            <Image
              src="/assets/img/hero_section_image.png"
              alt="Mobile Frame"
              className="w-80 sm:w-[28rem] md:w-[32rem] lg:w-[36rem] xl:w-[40rem] h-auto object-contain"
              width={800}
              height={1600}
              priority
              draggable={false}
              sizes="(max-width: 640px) 320px, (max-width: 768px) 448px, (max-width: 1024px) 512px, 640px"
            />
          </RevealOnScroll>
        </div>
      </div>
    </ParallaxSection>
  );
}
