"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Shield,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useGetCartQuery } from "@/redux/services/cartApi";
import { CartProductImage } from "./CartProductImage";
import { cn } from "@/lib/utils";
import { ProductImage } from "../ui/ProductImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    cartData,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    calculateTotals,
  } = useCart();
  const {
    data: cartResponse,
    isLoading,
    error,
    refetch,
  } = useGetCartQuery(undefined, {
    // Poll every 10 seconds when drawer is open
    pollingInterval: isOpen ? 10000 : 0,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cartResponse?.data) {
      const backendItems = cartResponse.data.products.map((product: any) => ({
        id: product.productId,
        name: product.name,
        price: product.unitPrice,
        quantity: product.quantity,
        image: product.thumbnail,
        unit: product.unitTypeDescription,
        category: "",
        priceId: product.priceId,
        unitType: product.unitType,
        thumbnail: product.thumbnail,
        currency: product.currency,
        originalPrice: product.originalPrice,
        unitPrice: product.unitPrice,
      }));
    }
  }, [isOpen, cartResponse]);

  const handleIncreaseQuantity = async (
    productId: string,
    priceId?: string
  ) => {
    const item = items.find((item) => item.id === productId);
    if (!item) return;

    setIsProcessing(productId);
    await updateCartItemQuantity({
      productId,
      quantity: item.quantity + 1,
      priceId,
    });
    setIsProcessing(null);
  };

  const handleDecreaseQuantity = async (
    productId: string,
    priceId?: string
  ) => {
    const item = items.find((item) => item.id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      await handleRemoveItem(productId, priceId);
      return;
    }

    setIsProcessing(productId);
    await updateCartItemQuantity({
      productId,
      quantity: item.quantity - 1,
      priceId,
    });
    setIsProcessing(null);
  };

  const handleRemoveItem = async (productId: string, priceId?: string) => {
    setIsProcessing(productId);
    await removeFromCart({ productId, priceId });
    setIsProcessing(null);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsProcessing("clear");
      await clearCart();
      setIsProcessing(null);
    }
  };

  const { subtotal, totalItems, deliveryFee, platformFee, total } =
    calculateTotals();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col",
          "h-full"
        )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold">My Cart</h2>
              {totalItems > 0 && (
                <p className="text-sm text-gray-500">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {items.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">
              Add some fresh fruits and vegetables to get started!
            </p>
            <Button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700">
              Continue Shopping
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load cart</h3>
            <p className="text-gray-500 mb-4">
              There was an error loading your cart. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Cart Items */}
        {items.length > 0 && !isLoading && !error && (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cartData?.deliveryMessage && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {cartData.deliveryMessage}
                    </span>
                  </div>
                </div>
              )}

              {/* Products List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.priceId}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden ">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        isPreSigned={true}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveItem(item.id, item.priceId)
                          }
                          disabled={isProcessing === item.id}
                          className="h-6 w-6 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-500 mb-2">{item.unit}</p>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ₹{item.price.toFixed(2)} per item
                            </span>
                          </div>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{item.originalPrice.toFixed(2)}
                              </span>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDecreaseQuantity(item.id, item.priceId)
                            }
                            disabled={isProcessing === item.id}
                            className="h-8 w-8 rounded-full">
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="min-w-8 text-center font-medium">
                            {isProcessing === item.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-green-600 mx-auto"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleIncreaseQuantity(item.id, item.priceId)
                            }
                            disabled={isProcessing === item.id}
                            className="h-8 w-8 rounded-full">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isProcessing === "clear"}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  {isProcessing === "clear" ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-600 mr-2"></div>
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer with Summary */}
            <div className="border-t p-4 bg-white">
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secure checkout • 100% Safe & Secure</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      ₹{deliveryFee.toFixed(2)}
                    </span>
                  </div>
                )}

                {platformFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">
                      ₹{platformFee.toFixed(2)}
                    </span>
                  </div>
                )}

                {cartData?.coupon?.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{cartData.coupon.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-3" />

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">Total</p>
                  <p className="text-sm text-gray-500">
                    Inclusive of all taxes
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{total.toFixed(2)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  onClick={() => {
                    onClose();
                  }}>
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Prices and availability are subject to change</p>
                <p>Free delivery on orders above ₹199</p>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
