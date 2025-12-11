"use client";

import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  rating?: number;
  discount?: number;
  description?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  orientation?: "vertical" | "horizontal";
}

export function ProductCard({
  product,
  onAddToCart,
  className = "",
  variant = "default",
  orientation = "vertical",
}: ProductCardProps) {
  const {
    name,
    price,
    unit,
    category,
    image,
    rating = 0,
    discount = 0,
    description,
    inStock = true,
  } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const calculateOriginalPrice = () => {
    if (discount > 0) {
      return (price * 100) / (100 - discount);
    }
    return null;
  };

  const originalPrice = calculateOriginalPrice();

  if (variant === "compact") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        <div className="flex">
          <div className="relative w-24 h-24 shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 96px"
            />
            {discount > 0 && (
              <Badge className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-lg font-bold">₹{price.toFixed(2)}</span>
                {originalPrice && (
                  <span className="text-xs text-gray-500 line-through ml-1">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-1">/{unit}</span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-(--accent) hover:bg-(--accent-dark)">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (orientation === "horizontal") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        <div className="flex">
          <div className="relative w-32 h-32 shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 128px"
            />
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                -{discount}%
              </Badge>
            )}
          </div>

          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <Badge variant="outline" className="mt-1">
                  {category}
                </Badge>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">₹{price.toFixed(2)}</div>
                <div className="text-sm text-gray-500">/{unit}</div>
                {originalPrice && (
                  <div className="text-sm text-gray-400 line-through">
                    ₹{originalPrice.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {description}
              </p>
            )}

            <div className="flex items-center justify-between mt-4">
              {rating > 0 && (
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {rating.toFixed(1)}
                  </span>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                className="bg-(--accent) hover:bg-(--accent-dark)"
                disabled={!inStock}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`shadow-none border-none overflow-hidden bg-white hover:shadow-md transition-all ${className}`}>
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-b-none"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 256px"
        />

        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{discount}%
          </Badge>
        )}

        <Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-white/95 text-gray-700 shadow-sm">
          {category}
        </Badge>

        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge className="bg-gray-900 text-white px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-medium text-base line-clamp-1">{name}</h3>

        {rating > 0 && (
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <div>
          <div className="flex items-baseline">
            <span className="text-xl font-semibold">₹{price.toFixed(2)}</span>
            <span className="text-gray-500 text-xs ml-1">/{unit}</span>
          </div>

          <div className="h-4 flex items-center">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full bg-(--accent) hover:bg-(--accent-dark) cursor-pointer"
          disabled={!inStock}>
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </Card>
  );
}

// Skeleton Loader
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <CardHeader className="pb-2">
        <div className="h-5 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </CardHeader>
      <CardFooter className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-8 bg-gray-200 rounded w-12" />
      </CardFooter>
    </Card>
  );
}

// Grid Layout Container
interface ProductGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductGrid({
  children,
  cols = 4,
  gap = "md",
  className = "",
}: ProductGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  const gridGap = {
    sm: "gap-3",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gridGap[gap]} ${className}`}>
      {children}
    </div>
  );
}
