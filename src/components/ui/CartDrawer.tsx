"use client";

import { ShoppingCart, X } from "lucide-react";
import { PreSignedImage } from "./PreSignedImage";
import { useCart } from "@/hooks/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cartItems: items,
    totalQty,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const handleDecreaseQty = (itemId: string, cartItem: any) => {
    decreaseQuantity(itemId, cartItem);
  };

  const handleIncreaseQty = (itemId: string, cartItem: any) => {
    increaseQuantity(itemId, cartItem);
  };

  const handleRemoveItem = (itemId: string, cartItem: any) => {
    removeFromCart(itemId, cartItem);
  };

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/50 z-99 transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 right-0 h-full z-100 transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:w-[420px] xl:w-[480px] w-full bg-white shadow-2xl
        `}>
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Cart</h2>
            <p className="text-sm text-gray-500">{totalQty || 0} items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-3 p-4 border rounded-xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 relative">
                    <PreSignedImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {item.unitTypeDescription}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{(item.originalPrice * item.qty).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, item)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium">
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDecreaseQty(item.id, item)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-sm font-medium cursor-pointer">
                      -
                    </button>
                    <span className="text-sm font-semibold min-w-5 text-center px-2">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleIncreaseQty(item.id, item)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-sm font-medium cursor-pointer">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50 sticky bottom-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sub Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>₹20</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee</span>
                <span>₹10</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>GST on Fees</span>
                <span>₹0</span>
              </div>

              <div className="flex justify-between text-sm text-green-600">
                <span>Delivery Free Discount</span>
                <span>-₹10</span>
              </div>

              <div className="border-t my-2" />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Order Total:</span>
                <span>₹{(totalPrice + 20 + 10 + 0 - 10).toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-between bg-(--accent) text-white py-3 px-4 rounded-xl font-semibold text-lg active:scale-95 transition mt-4">
              <span>₹{(totalPrice + 20 + 10 + 0 - 10).toFixed(2)}</span>
              <span>Checkout now</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
