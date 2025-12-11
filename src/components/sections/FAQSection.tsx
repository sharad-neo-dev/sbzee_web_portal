"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Why are fresh fruits and vegetables better than processed?",
    answer:
      "Fresh produce retains vitamins, antioxidants, and fiber without preservatives—supporting natural energy and immunity.",
  },
  {
    question: "How much fresh produce should I eat daily?",
    answer:
      "Aim for at least five servings daily—two fruits and three portions of vegetables across meals.",
  },
  {
    question: "Why eat seasonally?",
    answer:
      "Seasonal produce is tastier, often cheaper, and aligns with the body's needs for that time of year.",
  },
  {
    question: "Does AssuredPay impact children differently?",
    answer:
      "Yes—fresh, nutrient-dense produce supports growth, focus, and stronger immunity during key development years.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
          </RevealOnScroll>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <RevealOnScroll key={index} delay={0.1 + index * 0.1}>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      openIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    )}>
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
