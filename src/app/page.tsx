import type { Metadata } from "next";
import { Suspense } from "react";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoriesSection from "@/components/sections/CategoriesSection";
import { HomePageLoader } from "@/components/ui/HomePageLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "Fresh Fruits & Vegetables | Sbzee - Farm to Door Delivery",
  description:
    "Order fresh fruits and vegetables online from Sbzee. Farm-fresh quality, next morning delivery. Best prices on seasonal produce.",
  keywords:
    "fresh fruits, vegetables online, grocery delivery, farm fresh, organic produce, Sbzee",
  openGraph: {
    title: "Fresh Fruits & Vegetables | Sbzee",
    description: "Farm-fresh produce delivered to your doorstep",
    type: "website",
    images: ["/assets/img/og-products.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh Fruits & Vegetables | Sbzee",
    description: "Farm-fresh produce delivered to your doorstep",
  },
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <section className="bg-linear-to-r from-green-50 to-emerald-100 py-12">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Fresh from Farm to{" "}
              <span className="text-green-600">Your Table</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover handpicked seasonal fruits and vegetables, delivered
              fresh every morning. Experience quality that speaks for itself.
            </p>
          </div>
        </section>

        <Suspense fallback={<HomePageLoader />}>
          <FeaturedProducts />
        </Suspense>

        <Suspense fallback={<HomePageLoader />}>
          <CategoriesSection />
        </Suspense>

        <section className="bg-green-600 text-white py-12">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose Sbzee?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold mb-2">
                  Next Morning Delivery
                </h3>
                <p>Order by 11 PM, get fresh produce by next morning</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🥬</div>
                <h3 className="text-xl font-semibold mb-2">
                  Farm Fresh Quality
                </h3>
                <p>Direct from farms, no middlemen, maximum freshness</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p>Competitive prices with regular discounts</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer />
    </ProtectedRoute>
  );
}
