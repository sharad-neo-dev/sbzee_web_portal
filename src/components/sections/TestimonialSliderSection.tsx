"use client";

import { Star } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useEffect, useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    designation: "Finance Director, ABC Distributors",
    description:
      "AssuredPay helped us reduce DSO from 90 to 30 days. Our cash flow has never been better.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    designation: "CFO, XYZ Manufacturing",
    description:
      "The seamless integration with our ERP saved us countless hours of manual work.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    designation: "Owner, Patel & Sons Trading",
    description:
      "Transparent pricing and no hidden charges. Exactly what MSMEs need.",
    rating: 4,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    designation: "Financial Controller, TechServices Inc.",
    description:
      "24-hour disbursal helped us meet urgent vendor payments during festival season.",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    designation: "CEO, BuildRight Constructions",
    description:
      "No collateral requirement made financing accessible for our growing business.",
    rating: 5,
  },
  {
    id: 6,
    name: "Anjali Mehta",
    designation: "Finance Head, Retail Chain India",
    description:
      "Customer support team is responsive and understands MSME challenges well.",
    rating: 4,
  },
];

const companyLogos = [
  { name: "CNBC", image: "/assets/logo/CNBC.png" },
  { name: "Reader's Digest", image: "/assets/logo/reader_digest.png" },
  { name: "Financial Times", image: "/assets/logo/financial_times.png" },
  { name: "NewYork Post", image: "/assets/logo/new-york-post.png" },
  { name: "Wired", image: "/assets/logo/wired.png" },
  { name: "ZDNet", image: "/assets/logo/zd_net.png" },
];

export function TestimonialSliderSection() {
  const [testimonialsPerView, setTestimonialsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateTestimonialsPerView = () => {
      if (window.innerWidth < 768) setTestimonialsPerView(1);
      else if (window.innerWidth < 1024) setTestimonialsPerView(2);
      else setTestimonialsPerView(3);
    };

    updateTestimonialsPerView();
    window.addEventListener("resize", updateTestimonialsPerView);
    return () =>
      window.removeEventListener("resize", updateTestimonialsPerView);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getCardWidth = () => {
    if (testimonialsPerView === 1) return "70vw";
    if (testimonialsPerView === 2) return "50vw";
    return "33.333vw";
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#152ACB] to-[#303981]">
      <div className="max-w-full">
        <RevealOnScroll>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              What Our Customer Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Outcome-focused not just product-focused.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div
            className="relative mb-8 sm:mb-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
            <Marquee pauseOnHover play={!isPaused} gradient={false} speed={70}>
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0"
                  style={{ width: getCardWidth() }}>
                  <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 h-[180px] sm:h-[200px] lg:h-[220px] flex flex-col hover:shadow-xl transition-shadow duration-300 mx-2">
                    <div className="flex gap-1 mb-3 sm:mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 sm:mb-6">
                      <p className="text-gray-600 italic leading-relaxed text-sm sm:text-base">
                        "{testimonial.description}"
                      </p>
                    </div>

                    <div className="mt-auto">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </RevealOnScroll>

        {/* Featured In */}
        <RevealOnScroll delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20">
            <p className="text-white font-bold text-base sm:text-lg">
              Featured in:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-5">
              {companyLogos.map((company, index) => (
                <div
                  key={index}
                  className="relative h-8 w-16 sm:h-10 sm:w-20 md:h-12 md:w-24 lg:h-14 lg:w-28 hover:bg-yellow-500 transition-all rounded-xl">
                  <Image
                    src={company.image}
                    alt={company.name}
                    fill
                    className="object-contain filter brightness-0 invert transition-opacity duration-300"
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                  />
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
