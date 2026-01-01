"use client";

import React, { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HorizontalScrollContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
  viewAllText?: string;
  className?: string;
  containerClassName?: string;
}

export function HorizontalScrollContainer({
  children,
  title,
  subtitle,
  showNavigation = true,
  showViewAll = true,
  onViewAllClick,
  viewAllText = "See All",
  className = "",
  containerClassName = "",
}: HorizontalScrollContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className={`container-custom py-8 ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* {showViewAll && (
            <Button
              variant="ghost"
              onClick={onViewAllClick}
              className="text-(--accent) hover:text-(--accent-dark) hover:bg-transparent p-0 h-auto">
              {viewAllText}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )} */}
        </div>
      )}

      <div className="relative">
        {/* {showNavigation && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border hidden md:flex"
            aria-label="Scroll left">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )} */}

        <div
          ref={scrollContainerRef}
          className={`flex overflow-x-auto scrollbar-hide gap-4 md:gap-6 pb-4 ${containerClassName}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {children}
        </div>

        {/* {showNavigation && (
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border hidden md:flex"
            aria-label="Scroll right">
            <ChevronRight className="h-5 w-5" />
          </Button>
        )} */}
      </div>
    </section>
  );
}
