"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const generations = [
  { label: "Kids", description: "Growth, learning, immunity" },
  { label: "Adults", description: "Energy, productivity, balance" },
  { label: "Elders", description: "Bone health, digestion, resilience" },
];

export function GenerationsSection() {
  return (
    <section id="generations" className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <RevealOnScroll>
            <div className="relative">
              <Image
                src="/assets/img/LadyWithFamily.jpg"
                alt="Children and elders enjoying fresh fruits"
                width={600}
                height={400}
                draggable={false}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </RevealOnScroll>

          <div>
            <RevealOnScroll delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                AssuredPay for Every Generation
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Children thrive, adults sustain performance, and elders maintain
                vitality when AssuredPay becomes a daily habit.
              </p>
            </RevealOnScroll>

            <div className="grid sm:grid-cols-2 gap-4">
              {generations.map((generation, index) => (
                <RevealOnScroll
                  key={generation.label}
                  delay={0.3 + index * 0.1}>
                  <div className="p-6 bg-white rounded-xl border-2 border-dashed border-accent-500 shadow-sm">
                    <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-sm font-semibold rounded-full mb-2">
                      {generation.label}
                    </span>
                    <p className="text-gray-600">{generation.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
