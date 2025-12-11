"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MobileCarouselProps {
  slides: string[];
}

export function MobileCarousel({ slides }: MobileCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleClick = (index: number) => setCurrentSlide(index);

  return (
    <div className="flex flex-col items-center mt-10 lg:mt-0">
      <div className="relative w-[200px] h-[400px] lg:w-[340px] lg:h-[680px] overflow-hidden rounded-[30px]">
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Image
            src="/assets/img/mobile_frame.png"
            alt="Mobile Frame"
            className="w-full h-full object-contain"
            width={200}
            height={400}
            priority
            draggable={false}
          />
        </div>

        <div className="absolute top-[2%] left-[6%] w-[88%] h-[95%] overflow-hidden rounded-[25px] z-10">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <Image
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="object-cover rounded-[25px]"
                  fill
                  sizes="(max-width: 768px) 176px, 299px"
                  priority={index === 0}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex space-x-2 mt-4 justify-center w-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index ? "bg-accent-500" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
