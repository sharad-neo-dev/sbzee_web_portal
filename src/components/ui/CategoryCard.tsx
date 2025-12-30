"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PreSignedImage } from "./PreSignedImage";

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
}

interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({
  category,
  isActive = false,
  onClick,
  className = "",
}: CategoryCardProps) {
  const { name, image } = category;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 cursor-pointer border rounded-full overflow-hidden transition-colors",
        className
      )}>
      <div
        className={cn(
          "absolute inset-0 bg-(--accent) z-0",
          "transition-all duration-300 ease-in-out",
          isActive ? "w-full left-0" : "w-0 -left-full"
        )}
        style={{ transformOrigin: "left" }}
      />

      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100 shrink-0 z-10">
        <PreSignedImage
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>

      <p
        className={`relative z-10 text-lg font-medium ${
          isActive ? "text-white" : "text-gray-900"
        } truncate`}>
        {name}
      </p>
    </div>
  );
}

// Skeleton loader
export function CategoryCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 animate-pulse border border-gray-200 rounded-full">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>
  );
}
