import { Suspense } from "react";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import { HomePageLoader } from "@/components/ui/HomePageLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<HomePageLoader />}>
        <div className="min-h-screen">
          <FeaturedProducts />
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
