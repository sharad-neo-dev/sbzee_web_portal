"use client";

import { BookOpen, Briefcase, Users } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const benefits = [
  {
    icon: BookOpen,
    title: "Focus",
    description:
      "Apples, berries, and nuts support cognitive function and attention.",
  },
  {
    icon: Briefcase,
    title: "Productivity",
    description: "Greens and whole veggies keep midday slumps at bay.",
  },
  {
    icon: Users,
    title: "Family Joy",
    description: "Seasonal fruits turn everyday dinners into shared memories.",
  },
];

export function EverydaySection() {
  return (
    <section id="everyday" className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Assuredpay in Everyday Life
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From a child's lunchbox to an athlete's recovery bowl, fresh
              produce powers real moments—focus before exams, energy during
              work, and the joy of shared meals.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <RevealOnScroll key={benefit.title} delay={0.2 + index * 0.1}>
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover border border-gray-100">
                  <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
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
