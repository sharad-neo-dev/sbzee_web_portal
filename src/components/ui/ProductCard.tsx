"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Star, ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UIProduct } from "@/types/products.types";
import { useToggleFavoriteMutation } from "@/redux/services/productsApi";
import { ProductImage } from "./ProductImage";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: UIProduct;
  onAddToCart?: (product: UIProduct) => void;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  orientation?: "vertical" | "horizontal";
  showFavorite?: boolean;
  showHindiName?: boolean;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export function ProductCard({
  product,
  onAddToCart,
  className = "",
  variant = "default",
  orientation = "vertical",
  showFavorite = true,
  showHindiName = true,
}: ProductCardProps) {
  const router = useRouter();
  const [toggleFavorite, { isLoading: isTogglingFavorite }] =
    useToggleFavoriteMutation();

  const { items, addToCart, updateCartItemQuantity, removeFromCart } =
    useCart();
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const {
    id: productId,
    name,
    hindiName,
    price,
    originalPrice,
    unit,
    category,
    image,
    discount = 0,
    isFavourite,
    description,
    inStock = true,
    priceOptions = [],
  } = product;

  const availablePrices =
    priceOptions.length > 0
      ? priceOptions
      : [
          {
            id: `${productId}-default`,
            price: price,
            originalPrice: originalPrice || price,
            unitType: "piece",
            unitTypeDescription: unit || "per piece",
          },
        ];

  const selectedPrice = availablePrices[selectedPriceIndex];
  const currentPrice = selectedPrice?.price || price;
  const currentUnit =
    selectedPrice?.unitTypeDescription?.replace("per ", "") || unit;
  const currentOriginalPrice =
    selectedPrice?.originalPrice || originalPrice || price;

  // Calculate discount
  const calculateDiscount = () => {
    if (currentOriginalPrice > currentPrice && currentOriginalPrice > 0) {
      return Math.round(
        ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
      );
    }
    return 0;
  };

  const actualDiscount = calculateDiscount();

  const cartItemId = `${productId}-${selectedPrice?.id}`;

  const cartItem = items.find((item: any) => item.id === cartItemId);

  const cartQuantity = cartItem?.quantity || 0;
  const isInCart = cartQuantity > 0;

  useEffect(() => {
    if (selectedPriceIndex >= availablePrices.length) {
      setSelectedPriceIndex(0);
    }
  }, [availablePrices.length, selectedPriceIndex]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const res = await addToCart({
      id: cartItemId,
      productId: productId,
      name,
      price: currentPrice,
      quantity: 1,
      image,
      unit: currentUnit,
      category,
      priceId: selectedPrice?.id,
      unitType: selectedPrice?.unitType,
    });
    toast.success(res.data?.message || "product added successfully");
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleIncreaseQuantity = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!cartItem) {
      await handleAddToCart(e);
      return;
    }

    await updateCartItemQuantity({
      productId: cartItemId,
      quantity: cartQuantity + 1,
      priceId: selectedPrice?.id,
    });

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleDecreaseQuantity = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!cartItem) return;

    if (cartQuantity === 1) {
      await removeFromCart({
        productId: cartItemId,
        priceId: selectedPrice?.id,
      });
    } else {
      await updateCartItemQuantity({
        productId: cartItemId,
        quantity: cartQuantity - 1,
        priceId: selectedPrice?.id,
      });
    }

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await toggleFavorite({ productId: productId }).unwrap();
      toast.success(res?.message || "Favourite toggled!");
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handlePriceSelect = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedPriceIndex(index);
  };

  const handleCardClick = () => {
    router.push(`/product/${productId}`);
  };

  const priceOptionsHeight = "h-8";

  if (variant === "compact") {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}>
        <Card
          className={cn(
            "overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group",
            className
          )}>
          <div className="flex">
            <div className="relative w-24 h-24 shrink-0">
              <ProductImage
                src={image}
                alt={name}
                fill
                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                isPreSigned={true}
              />
              {actualDiscount > 0 && (
                <Badge className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-xs">
                  -{actualDiscount}%
                </Badge>
              )}
            </div>

            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
                {showHindiName && hindiName && (
                  <p className="text-xs text-gray-500 mt-0.5">{hindiName}</p>
                )}
                <div className="flex items-center mt-1">
                  <span className="text-lg font-bold">
                    ₹{currentPrice.toFixed(2)}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <span className="text-xs text-gray-500 line-through ml-1">
                      ₹{currentOriginalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 ml-1">
                    /{currentUnit}
                  </span>
                </div>
              </div>

              {/* Quantity Controls for Compact Variant */}
              {isInCart ? (
                <div className="flex items-center justify-between bg-green-600 rounded-md overflow-hidden h-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecreaseQuantity}
                    className="h-8 w-8 min-w-8 rounded-none bg-green-700 hover:bg-green-800 text-white">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-white font-medium text-sm px-2">
                    {cartQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncreaseQuantity}
                    className="h-8 w-8 min-w-8 rounded-none bg-green-700 hover:bg-green-800 text-white">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-8"
                  disabled={!inStock}>
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {inStock ? "Add" : "Out of Stock"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (orientation === "horizontal") {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}>
        <Card
          className={cn(
            "overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group",
            className
          )}>
          <div className="flex">
            <div className="relative w-32 h-32 shrink-0">
              <ProductImage
                src={image}
                alt={name}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                isPreSigned={true}
              />
              {actualDiscount > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                  -{actualDiscount}%
                </Badge>
              )}
            </div>

            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{name}</h3>
                  {showHindiName && hindiName && (
                    <p className="text-sm text-gray-500 mt-0.5">{hindiName}</p>
                  )}
                  {/* Fresh Tag */}
                  <Badge
                    variant="outline"
                    className="mt-1 bg-green-100 text-green-800 border-green-200">
                    Fresh
                  </Badge>
                </div>

                {showFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFavorite}
                    className="h-8 w-8">
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isFavourite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      )}
                    />
                  </Button>
                )}
              </div>

              <div className="text-right mt-2">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{currentPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">/{currentUnit}</div>
                {currentOriginalPrice > currentPrice && (
                  <div className="text-sm text-gray-400 line-through">
                    ₹{currentOriginalPrice.toFixed(2)}
                  </div>
                )}
              </div>

              {description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {description}
                </p>
              )}

              {/* Price Options for Horizontal Variant  */}
              <div className={cn("mt-2", priceOptionsHeight)}>
                {availablePrices.length > 1 && (
                  <div className="flex flex-wrap gap-1">
                    {availablePrices.map((priceOption, index) => (
                      <button
                        key={priceOption.id}
                        onClick={(e) => handlePriceSelect(e, index)}
                        className={cn(
                          "text-xs px-2 py-1 rounded border transition-colors",
                          selectedPriceIndex === index
                            ? "bg-green-100 border-green-500 text-green-700"
                            : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                        )}>
                        {priceOption.unitTypeDescription}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                {/* Quantity Controls for Horizontal Variant */}
                {isInCart ? (
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-green-600 font-medium">
                      {cartQuantity} in cart
                    </div>
                    <div className="flex items-center border border-green-600 rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDecreaseQuantity}
                        className="h-8 w-8 rounded-none text-green-600 hover:bg-green-50">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 font-medium min-w-8 text-center">
                        {cartQuantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleIncreaseQuantity}
                        className="h-8 w-8 rounded-none text-green-600 hover:bg-green-50">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    {inStock ? "Add to your cart" : "Out of Stock"}
                  </div>
                )}

                {!isInCart && (
                  <Button
                    onClick={handleAddToCart}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default vertical card
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}>
      <Card
        className={cn(
          "shadow-sm border overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer group h-full flex flex-col",
          className
        )}
        onClick={handleCardClick}>
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden flex items-center justify-center">
          <ProductImage
            src={image}
            alt={name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            isPreSigned={true}
            priority={variant === "detailed"}
          />

          {/* Discount Badge */}
          {actualDiscount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 left-2 z-10">
              <Badge className="bg-red-500 text-white shadow-lg">
                -{actualDiscount}%
              </Badge>
            </motion.div>
          )}

          {/* Fresh Tag */}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-green-600 text-white shadow-sm backdrop-blur-sm z-10">
            Fresh
          </Badge>

          {/* Favorite Button */}
          {showFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="absolute top-2 left-2 bg-white/90 hover:bg-white backdrop-blur-sm h-8 w-8 rounded-full shadow-sm z-10">
              <Heart
                className={cn(
                  "h-5 w-5 transition-all",
                  isFavourite
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-gray-500 hover:text-red-400"
                )}
              />
            </Button>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <Badge className="bg-gray-900 text-white px-3 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-base line-clamp-1 text-gray-900">
              {name}
            </h3>

            {showHindiName && hindiName && (
              <p className="text-sm text-gray-500 mt-1">{hindiName}</p>
            )}

            <div className="mt-3">
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">
                  ₹{currentPrice.toFixed(2)}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  /{currentUnit}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 min-h-5">
                {currentOriginalPrice > currentPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{currentOriginalPrice.toFixed(2)}
                    </span>
                    {actualDiscount > 0 && (
                      <span className="text-xs font-medium text-red-500">
                        Save {actualDiscount}%
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Price Options */}
            <div className={cn("mt-2", priceOptionsHeight)}>
              {availablePrices.length > 1 && (
                <div className="flex flex-wrap gap-1">
                  {availablePrices.map((priceOption, index) => (
                    <button
                      key={priceOption.id}
                      onClick={(e) => handlePriceSelect(e, index)}
                      className={cn(
                        "text-xs px-2 py-1 rounded border transition-colors",
                        selectedPriceIndex === index
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                      )}>
                      {priceOption.unitTypeDescription}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {variant === "detailed" && description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* Cart Controls  */}
          <CardFooter className="p-0 mt-4">
            {isInCart ? (
              <div className="flex items-center justify-between w-full bg-green-600 rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDecreaseQuantity}
                  className="h-10 w-12 rounded-none text-white hover:bg-green-700 hover:text-white">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 font-medium text-white text-center flex-1">
                  {cartQuantity} in cart
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleIncreaseQuantity}
                  className="h-10 w-12 rounded-none text-white hover:bg-green-700 hover:text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-10"
                disabled={!inStock}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            )}
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton Loader with Animation
export function ProductCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="flex">
          <div className="w-24 h-24 bg-gray-200" />
          <div className="flex-1 p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    </Card>
  );
}

// Error State
export function ProductCardError({
  message = "Failed to load product",
}: {
  message?: string;
}) {
  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-2">⚠️</div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </Card>
  );
}
