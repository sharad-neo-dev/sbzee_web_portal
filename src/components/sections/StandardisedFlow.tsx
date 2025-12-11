"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const keyPoints = [
  "Submit outstanding invoices throught the AssuredPay dashboard.",
  "Tag Buyers, due dates and invoice ageing.",
  "Secure upload with role-based access.",
];

export function StandardisedFlow() {
  return (
    <section id="science" className="section-padding bg-soft">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* Image Column - Order changed for mobile */}
          <div className="w-full h-full flex items-center order-1 lg:order-1 mb-8 lg:mb-0">
            <RevealOnScroll delay={0.1} className="w-full">
              <div className="relative w-full h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[500px]">
                <Image
                  src="/assets/img/cash_flow_image.png"
                  alt="Standardised 3-step invoice financing flow for MSMEs"
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

          {/* Content Column */}
          <RevealOnScroll className="flex flex-col h-full order-2 lg:order-2">
            <div className="mb-6 lg:mb-8">
              <p className="border border-[#FA8334] bg-[#FA8334]/10 rounded-lg w-fit px-3 py-1.5 sm:px-4 sm:py-2 text-[#FA8334] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                How AssuredPay Works
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Standardised 3-Step Flow
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-3">
                From invoice upload to disbursal within 24-48 hours.
              </p>
              <p className="text-lg sm:text-xl text-[#303981]">
                A digital, auditable process for MSMEs, finance teams and
                partner banks.
              </p>
            </div>

            <div className="bg-[#F4F3F8] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between">
              <div>
                {/* Step 1 */}
                <div className="mb-4 sm:mb-6">
                  <div className="bg-[#303981] text-white w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                    1
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">
                    Intake
                  </p>
                  <p className="text-black text-base sm:text-lg lg:text-lg font-bold">
                    Upload your unpaid invoices.
                  </p>
                </div>

                <RevealOnScroll delay={0.2} distance={10}>
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-orange-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                        <p className="text-gray-700 text-sm sm:text-base">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
