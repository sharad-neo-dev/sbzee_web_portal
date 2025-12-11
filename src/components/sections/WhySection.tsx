"use client";

import Image from "next/image";
import { Zap, Shield, Brain, Heart, Phone, ArrowRight } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function WhySection() {
  const keyPoints = [
    "Trusted by MSMEs across India",
    "MCA Registered",
    "Data Secure",
    "Partnered Banks",
  ];

  return (
    <section id="why" className="section-padding bg-[#F3F8FF]">
      <div className="container-custom flex flex-col items-center text-center">
        <RevealOnScroll>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why MSMEs Choose AssuredPay
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-3 sm:mb-4 leading-relaxed">
              Reduce DSO, stabilize cash flow, and fund growth — without
              pledging collateral or waiting 60-120 days for customer payments.
            </p>
            <p className="max-w-lg mx-auto text-sm sm:text-base md:text-md text-gray-400 mb-8 sm:mb-12 leading-relaxed">
              Fast approvals, digital workflows, and predictable pricing
              purpose-built for small and medium businesses.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl w-full mx-auto px-4 sm:px-6">
            {/* Feature Card 1 */}
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl  duration-300 border border-gray-100 hover:scale-105 transition-all">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-[#F77A40] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[#F77A40] text-sm sm:text-md font-medium mb-1">
                    Typical DSO Reduction
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    Up to 50 Days
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl  duration-300 border border-gray-100 hover:scale-105 transition-all">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-[#F77A40] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[#F77A40] text-sm sm:text-md font-medium mb-1">
                    Fee range
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    0.2 - 0.3%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.8} distance={10}>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 px-4">
            {keyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 sm:py-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 rounded-full flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600">{point}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
