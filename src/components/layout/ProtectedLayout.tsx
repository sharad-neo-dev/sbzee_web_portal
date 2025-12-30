"use client";

import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import FloatingCart from "../ui/FloatingCart";
import CartDrawer from "../ui/CartDrawer";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { items } = useAppSelector((state: RootState) => state.cart);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={() => setCartDrawerOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      {items.length > 0 && (
        <FloatingCart
          items={items}
          onViewCart={() => setCartDrawerOpen(true)}
        />
      )}

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
}
