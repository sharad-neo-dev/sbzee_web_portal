"use client";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MoveUpRight } from "lucide-react";

export function BuildForCreditSection() {
  const segments = [
    {
      title: "Distributors",
      description:
        "Bridge 60-90 days customer payment terms and keep shelves fully stocked.",
      useCase:
        "Use case: primary and secondary sales funding, festive season pushes, and credit-led expansion.",
    },
    {
      title: "Manufacturers",
      description:
        "Maintain production continuity despite extended payment cycles from bulk buyers.",
      useCase:
        "Use case: raw material procurement, working capital for production cycles, export order financing.",
    },
    {
      title: "Service Providers",
      description:
        "Fund project execution while waiting for client milestone payments.",
      useCase:
        "Use case: IT services, construction contractors, consulting firms with project-based billing.",
    },
  ];

  return (
    <section id="benefits" className="section-padding bg-[#fff]">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 sm:mb-12">
              <div>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Built for credit-Heavy MSME Sectors.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                  Where 60 - 120 day payment terms are standard..
                </p>
              </div>

              <div className="flex items-center">
                <p className="text-base sm:text-lg text-gray-700">
                  Assured pay is relevant wherever a large share of revenue is
                  tied up in trade receivables.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Segments Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {segments.map((segment, index) => (
              <RevealOnScroll key={index} delay={0.2 + index * 0.1}>
                <div className="bg-white shadow-lg p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-gray-100 h-full">
                  <p className="border border-[#FA8334] bg-[#FA8334]/10 rounded-lg w-fit px-3 py-1.5 sm:px-4 sm:py-2 text-[#FA8334] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                    Segment
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    {segment.title}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
                    {segment.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2">
                    {segment.useCase}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              className="bg-gradient-to-r from-[#162acb] to-[#303981] text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
              aria-label="See How it Works">
              See How it works
              <MoveUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
