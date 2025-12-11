"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CableCar, CloudRain, Sun } from "lucide-react";

const seasons = [
  {
    title: "Summer",
    picks: "Mangoes, cucumbers, melons",
    description: "Perfect for hydration and cooling.",
    image: "/assets/img/summer.jpg",
    icon: <Sun className="text-orange-500 h-5 w-5" />,
  },
  {
    title: "Monsoon",
    picks: "Litchi, jamun, gourds",
    description: "Support immunity and balance.",
    image: "/assets/img/monsoon.jpg",
    icon: <CloudRain className="text-blue-500 h-5 w-5" />,
  },
  {
    title: "Winter",
    picks: "Carrots, spinach, citrus fruits",
    description: "Rich in warmth, iron, and Vitamin",
    image: "/assets/img/winter.jpg",
    icon: <CableCar className="text-yellow-500 h-5 w-5" />,
  },
];

export function SeasonalSection() {
  const handleScrollToBottom = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      const yOffset = -80;
      const y =
        footer.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  return (
    // <ParallaxSection
    //   backgroundImage="/assets/img/summer.jpg"
    //   className=" text-white pb-28 pt-[470px]"
    //   speed={0.25}
    // >
    <div className="container-custom section-padding">
      <div className="text-center mb-12">
        <RevealOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Seasonal Vegetables & Fruits : Nature's Own Calendar
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Eat fresh, local, and in-season with AssuredPay, bringing you the
            best from nearby farms, straight to you doorstep
          </p>
        </RevealOnScroll>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {seasons.map((season, index) => (
          <RevealOnScroll key={season.title} delay={0.2 + index * 0.1}>
            <div className="group bg-white rounded-2xl overflow-hidden card-hover border border-gray-100 shadow-lg">
              <div className="relative h-64">
                <Image
                  src={season.image}
                  alt={`${season.title} fruits and vegetables`}
                  fill
                  draggable={false}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3 gap-2">
                  {season.icon}
                  <h3 className="text-xl text-gray-900 font-semibold">
                    {season.title}
                  </h3>
                </div>
                <p className="text-gray-900">
                  <span className="font-semibold">Fresh Picks</span>:{" "}
                  {season.picks}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {season.description}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
      <button
        className="btn-accent flex items-center justify-center space-x-2 text-lg mt-12 mx-auto"
        onClick={handleScrollToBottom}>
        <span>Explore Seasonal Picks on AssuredPay Apps</span>
      </button>
    </div>
    // </ParallaxSection>
  );
}
