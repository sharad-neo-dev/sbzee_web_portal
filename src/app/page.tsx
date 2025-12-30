import FeaturedProducts from "@/components/sections/FeaturedProducts";
import CategoriesSection from "@/components/sections/Categories";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="py-10">
        <FeaturedProducts />
      </div>

      <CategoriesSection />

      <div className="py-10"></div>
    </main>
  );
}
