"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const benefits = [
  "Support local growers and fair supply chains",
  "Lower carbon footprint with fewer transport miles",
  "Less packaging, fewer additives, more nutrition",
];

export function SustainabilitySection() {
  return (
    <section id="sustainability" className="section-padding bg-soft">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Fresh Choices, Better Planet
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Choosing fresh, seasonal, and local reduces food miles and
                packaging waste—supporting farmers and protecting our
                environment.
              </p>
            </RevealOnScroll>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <RevealOnScroll key={benefit} delay={0.2 + index * 0.1}>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <RevealOnScroll delay={0.3}>
            <div className="relative">
              <Image
                src="/assets/img/LadyInKitchen.jpg"
                alt="Sustainable produce and local farms"
                width={600}
                height={400}
                draggable={false}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
