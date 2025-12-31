"use client";

import React, { useEffect, useState } from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PreSignedImage } from "@/components/ui/PreSignedImage";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "@/hooks/useCart";
import { useCreateFavouriteProductMutation } from "@/redux/services/productsApi";

export interface ProductPrice {
  id: string;
  price: number;
  originalPrice: number;
  unitType: string;
  unitTypeDescription: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  rating?: number;
  discount?: number;
  description?: string;
  inStock?: boolean;
  hindiName?: string;
  isFeatured?: boolean;
  isFavourite?: boolean;
  prices?: ProductPrice[];
  thumbnail?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, selectedPrice?: ProductPrice) => void;
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
  const router = useRouter();
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getItemByProductAndPrice,
  } = useCart();

  const {
    name,
    category,
    image,
    rating = 0,
    description,
    inStock = true,
    prices = [],
    thumbnail,
  } = product;

  const availablePrices =
    prices.length > 0
      ? prices
      : [
          {
            id: product.id,
            price: product.price,
            originalPrice: product.price,
            unitType: "weight",
            unitTypeDescription: product.unit,
          },
        ];

  const selectedPrice = availablePrices[selectedPriceIndex];
  const currentPrice = selectedPrice?.price || product.price;
  const currentUnit =
    selectedPrice?.unitTypeDescription.replace("per ", "") || product.unit;
  const currentOriginalPrice = selectedPrice?.originalPrice || product.price;

  const discount =
    currentOriginalPrice > currentPrice
      ? Math.round(
          ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
        )
      : 0;

  const cartItem = getItemByProductAndPrice(product.id, selectedPrice?.id);
  const currentQty = cartItem?.qty ?? 0;

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const cartItem = {
      id: `${product.id}-${selectedPrice.id}`,
      productId: product.id,
      priceId: selectedPrice.id,
      name: product.name,
      price: selectedPrice.price,
      originalPrice: selectedPrice.originalPrice,
      qty: 1,
      unitTypeDescription: selectedPrice.unitTypeDescription,
      image: product.image || product.thumbnail || "",
      unit: selectedPrice.unitTypeDescription,
    };

    addToCart(cartItem);

    if (onAddToCart) {
      onAddToCart(product, selectedPrice);
    }
  };

  const handlePriceSelect = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedPriceIndex(index);
  };

  const [isFav, setIsFav] = useState(product.isFavourite);

  useEffect(() => {
    setIsFav(product.isFavourite);
  }, [product.isFavourite]);

  const [createFavouriteProduct, { isLoading }] =
    useCreateFavouriteProductMutation();

  const handleFavourite = async () => {
    const prev = isFav;
    setIsFav(!prev);

    try {
      await createFavouriteProduct(product.id).unwrap();
    } catch (err) {
      setIsFav(prev);
      console.error("Favourite failed", err);
    }
  };

  if (variant === "compact") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <div className="flex" onClick={handleCardClick}>
          <div className="relative w-24 h-24 shrink-0">
            <PreSignedImage
              src={thumbnail}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 256px"
            />
            {discount > 0 && (
              <Badge className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          <CardContent className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-lg font-bold">
                  ₹{currentPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-gray-500 line-through ml-1">
                    ₹{currentOriginalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-1">
                  /{currentUnit}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-(--accent) hover:bg-(--accent-dark)"
              disabled={!inStock}>
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (orientation === "horizontal") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <div className="flex" onClick={handleCardClick}>
          <div className="relative w-32 h-32 shrink-0">
            <PreSignedImage
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

          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <Badge variant="outline" className="mt-1 bg-red-500 text-white">
                  Fresh
                </Badge>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">
                  ₹{currentPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">/{currentUnit}</div>
                {discount > 0 && (
                  <div className="text-sm text-gray-400 line-through">
                    ₹{currentOriginalPrice.toFixed(2)}
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
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`shadow-lg border-none overflow-hidden bg-white hover:scale-105 duration-300 transition-all cursor-pointer ${className}`}>
      <div
        className="relative h-44 w-full overflow-hidden"
        onClick={handleCardClick}>
        <PreSignedImage
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 256px"
        />

        {/* {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{discount}%
          </Badge>
        )} */}

        <div
          className="absolute top-2 left-2 bg-gray-400 text-white shadow-sm p-2 rounded-2xl cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleFavourite();
          }}>
          <Heart
            size={25}
            className={cn(
              "transition-colors",
              isFav ? "fill-white text-white" : "text-white"
            )}
          />
        </div>

        <Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-red-500 text-white shadow-sm">
          Fresh
        </Badge>

        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge className="bg-gray-900 text-white px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
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
            <span className="text-xl font-semibold">
              ₹{currentPrice.toFixed(2)}
            </span>
            <span className="text-gray-500 text-xs ml-1">/{currentUnit}</span>
          </div>

          <div className="h-4 flex items-center">
            {discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through mr-2">
                  ₹{currentOriginalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-2 min-h-8">
            {availablePrices.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {availablePrices.map((price, index) => (
                  <button
                    key={price.id}
                    onClick={(e) => handlePriceSelect(e, index)}
                    className={cn(
                      "text-xs px-2 py-1 rounded border transition-colors",
                      selectedPriceIndex === index
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    )}>
                    {price.unitTypeDescription}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {currentQty === 0 ? (
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-full bg-(--accent) hover:bg-(--accent-dark) cursor-pointer text-white"
            disabled={!inStock}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        ) : (
          <div className="w-[80%] flex mx-auto bg-(--accent) hover:bg-(--accent-dark) rounded-md text-white">
            <div className="flex items-center justify-between px-2 py-1 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (cartItem) {
                    decreaseQuantity(cartItem.id, cartItem);
                  }
                }}
                className="px-3 text-lg font-semibold cursor-pointer"
                disabled={!cartItem}>
                -
              </button>
              <span className="px-3 text-md font-medium cursor-pointer">
                {currentQty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (cartItem) {
                    increaseQuantity(cartItem.id, cartItem);
                  }
                }}
                className="px-3 text-lg font-semibold cursor-pointer"
                disabled={!cartItem}>
                +
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <CardContent className="pb-2">
        <div className="h-5 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </CardContent>
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
