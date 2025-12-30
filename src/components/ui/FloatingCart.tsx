import { Play, ShoppingCart } from "lucide-react";
import React from "react";

interface FloatingCartProps {
  items: any[];
  onViewCart: () => void;
}
const FloatingCart = ({ items, onViewCart }: FloatingCartProps) => {
  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 bg-green-600 border-t border-gray-200 px-3 py-3 shadow-inner sm:hidden mx-2 rounded-xl">
      <div className="max-w-screen-sm mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative p-2 rounded-xl bg-gray-700/10">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-white">
            <span className="text-sm font-semibold">{items.length} Item</span>
          </div>
        </div>

        <button
          onClick={onViewCart}
          className="flex items-center gap-1 rounded-full text-white text-sm font-medium py-1 px-2 active:scale-95 transition ml-auto">
          <span className="text-lg">View Cart</span>
          <Play className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FloatingCart;
