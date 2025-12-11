"use client";

import { useParallax } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  speed?: number;
  overlay?: boolean;
}

export function ParallaxSection({
  children,
  backgroundImage,
  className,
  speed = 0.5,
  overlay = false,
}: ParallaxSectionProps) {
  const parallaxRef = useParallax({ speed });

  return (
    <section className={cn("relative overflow-hidden parallax", className)}>
      {backgroundImage && (
        <div
          ref={parallaxRef}
          className="parallax-bg z-0 absolute inset-0 bg-cover bg-center bg-no-repeat"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}
      {overlay && <div className="absolute inset-0 hero-overlay z-10" />}
      <div className="relative z-20 w-full mx-auto">{children}</div>
    </section>
  );
}
