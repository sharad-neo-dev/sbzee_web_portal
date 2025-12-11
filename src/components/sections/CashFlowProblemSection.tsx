"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Phone } from "lucide-react";

const keyPoints = [
  "Working capital gets locked in invoices and credit notes.",
  "Vendors demand shorter payment cycles and early payment.",
  "Growth initiatives are delayed to manage near-term liquidity.",
];

export function CashFlowProblemSection() {
  return (
    <section id="science" className="section-padding bg-soft">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* Content Column - Order changed for mobile */}
          <RevealOnScroll className="flex flex-col h-full order-2 lg:order-1">
            <div className="mb-6 lg:mb-8">
              <p className="border border-[#FA8334] bg-[#FA8334]/10 rounded-lg w-fit px-3 py-1.5 sm:px-4 sm:py-2 text-[#FA8334] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                The Problem
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                The Cash Flow Problem for MSMEs
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Delayed receivables, immediate obligations.
              </p>
            </div>

            <div className="bg-[#F4F3F8] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between">
              <div>
                <p className="text-gray-800 font-bold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  73% of MSMEs wait 60-120 days for customer payments.
                </p>
                <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
                  During that wait, salaries, suppliers, and GST bills keep
                  piling up.
                </p>

                <RevealOnScroll delay={0.2} distance={10}>
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-orange-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                        <p className="text-black text-sm sm:text-base">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-[#FF3A3C] p-2 sm:p-3 rounded-full flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <p className="text-[#FF3A3C] font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
                    Stop Waiting
                  </p>
                </div>

                <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-300">
                  |
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-[#34C759] p-2 sm:p-3 rounded-full flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <p className="text-[#34C759] font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
                    Start Growing
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Image Column */}
          <div className="w-full h-full flex items-center order-1 lg:order-2 mb-8 lg:mb-0">
            <RevealOnScroll delay={0.1} className="w-full">
              <div className="relative w-full h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[500px]">
                <Image
                  src="/assets/img/cash_flow_image.png"
                  alt="Cash Flow Problem for MSMEs showing payment delays and working capital challenges"
                  width={600}
                  height={600}
                  draggable={false}
                  className="rounded-lg shadow-sm w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
