"use client";

import { CategoryCard, CategoryCardSkeleton, Category } from "./CategoryCard";

interface CategoriesGridProps {
  categories?: Category[];
  activeCategoryId?: string;
  onCategoryClick?: (categoryId: string) => void;
  loading?: boolean;
  skeletonCount?: number;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function CategoriesGrid({
  categories,
  activeCategoryId,
  onCategoryClick,
  loading = false,
  skeletonCount = 6,
  cols = 3,
  gap = "md",
  className = "",
}: CategoriesGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const gridGap = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[cols]} ${gridGap[gap]} ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (categories?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No categories available</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[cols]} ${gridGap[gap]} ${className}`}>
      {categories?.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isActive={activeCategoryId === category.id}
          onClick={() => onCategoryClick?.(category.id)}
        />
      ))}
    </div>
  );
}
