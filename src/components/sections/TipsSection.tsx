"use client";

import { Coffee, Calendar, RefreshCw } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const tips = [
  {
    icon: Coffee,
    title: "Fruit First",
    description:
      "Start your day with a fruit before tea/coffee for natural hydration.",
  },
  {
    icon: Calendar,
    title: "Seasonal Meal Plan",
    description:
      "Plan weekly meals around seasonal produce for taste and nutrition.",
  },
  {
    icon: RefreshCw,
    title: "Swap a Snack",
    description:
      "Replace one processed snack with a fresh fruit or veggie daily.",
  },
];

export function TipsSection() {
  return (
    <section id="tips" className="section-padding bg-soft">
      <div className="container-custom">
        <div className="text-center mb-12">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Make AssuredPay Effortless
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple habits that stack up to a fresher lifestyle.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <RevealOnScroll key={tip.title} delay={0.2 + index * 0.1}>
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover border border-gray-100">
                  <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
