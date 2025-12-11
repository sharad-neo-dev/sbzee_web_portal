"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function BenefitsSection() {
  const keyPoints = [
    "Trusted by MSMEs across India",
    "MCA Registered",
    "Data Secure",
    "Partnered Banks",
  ];

  const benefits = [
    "Reduce DSO by upto 50 days",
    "Keep cash flow smooth for payroll and inventory",
    "Simple digital KYC + zero collateral",
    "Transparent fees starting 0.2%",
  ];

  return (
    <section id="benefits" className="section-padding bg-[#F3F8FF]">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <RevealOnScroll>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Benefits for your Business
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Working capital, control and predictability in one platform.
              </p>
            </div>
          </RevealOnScroll>

          {/* Benefits Grid */}
          <RevealOnScroll delay={0.2}>
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
                {/* Left Card - Check Benefits */}
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 w-full">
                  <div className="space-y-3 sm:space-y-4">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 sm:gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="bg-[#303981] rounded-full p-1 flex-shrink-0">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm sm:text-base lg:text-lg">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card - Key Points */}
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 w-full">
                  <div className="h-full flex flex-col">
                    <p className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                      Designed for MSME finance leaders
                    </p>

                    <div className="space-y-3 sm:space-y-4 flex-grow">
                      {keyPoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 sm:gap-3">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FA8334] rounded-full flex-shrink-0" />
                          <p className="text-gray-700 text-sm sm:text-base">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
