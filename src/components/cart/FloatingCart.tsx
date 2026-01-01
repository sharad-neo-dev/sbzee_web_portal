"use client";

import React from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface FloatingCartProps {
  onViewCart: () => void;
}

export function FloatingCart({ onViewCart }: FloatingCartProps) {
  const { items, calculateTotals } = useCart();
  const { totalItems, total } = calculateTotals();

  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
      <Button
        onClick={onViewCart}
        className="h-14 px-6 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <div className="text-left">
            <div className="text-sm font-medium">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </div>
            <div className="text-xs opacity-90">View Cart</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold">₹{total.toFixed(2)}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </Button>
    </motion.div>
  );
}
