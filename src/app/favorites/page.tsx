import type { Metadata } from "next";
import { Suspense } from "react";
import FavoritesContent from "./FavoritesContent";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: "My Favorite Products | Sbzee - Fresh Fruits & Vegetables",
  description:
    "Browse your favorite fruits and vegetables. Save items for quick reordering and never miss out on your preferred produce.",
  keywords:
    "favorites, saved items, wishlist, favorite products, fruits, vegetables, Sbzee",
  openGraph: {
    title: "My Favorites | Sbzee",
    description:
      "Your saved favorite fruits and vegetables for quick reordering",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Favorites | Sbzee",
    description: "Your saved favorite fruits and vegetables",
  },
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-green-50/30">
      <Suspense fallback={<LoadingScreen />}>
        <FavoritesContent />
      </Suspense>
    </div>
  );
}
