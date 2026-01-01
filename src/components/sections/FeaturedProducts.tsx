"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useGetFeaturedProductsQuery } from "@/redux/services/productsApi";
import { convertToUIProduct } from "@/types/products.types";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { HorizontalScrollContainer } from "@/components/ui/HorizontalScrollContainer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePreloadImages } from "@/hooks/usePreloadImages";

export default function FeaturedProducts() {
  const router = useRouter();

  const {
    data: featuredData,
    isLoading,
    isError,
    error,
  } = useGetFeaturedProductsQuery({ limit: 10, page: 1 });

  const imageUrls = useMemo(() => {
    if (!featuredData?.data?.products) return [];
    return featuredData.data.products.map((p) => p.thumbnail);
  }, [featuredData]);

  usePreloadImages(imageUrls);

  const handleAddToCart = (product: any) => {
    console.log("Added to cart:", product);
  };

  const handleViewAll = () => {
    router.push("/products");
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  if (isError) {
    return (
      <section className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-500">Failed to load featured products</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  const products = featuredData?.data?.products || [];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-12 bg-linear-to-b from-white to-green-50/50">
      <HorizontalScrollContainer
        title="Featured Products"
        subtitle="Fresh picks handpicked for you"
        onViewAllClick={handleViewAll}
        className="mt-8 lg:mt-10"
        containerClassName="px-4"
        showViewAll={products.length > 0}>
        {isLoading ? (
          // Skeleton Loaders
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="min-w-[280px] md:min-w-[300px]">
              <ProductCardSkeleton />
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product, index) => {
            const uiProduct = convertToUIProduct(product);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="min-w-[280px] md:min-w-[300px] cursor-pointer"
                onClick={() => handleProductClick(product.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <ProductCard
                  product={uiProduct}
                  onAddToCart={handleAddToCart}
                  variant="default"
                  showFavorite={true}
                  showHindiName={true}
                />
              </motion.div>
            );
          })
        ) : (
          // Empty State
          <div className="min-w-full py-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">🍎</div>
            <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
            <p className="text-gray-500">Check back later for fresh picks!</p>
          </div>
        )}
      </HorizontalScrollContainer>

      {/* Stats Section */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="container-custom mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.length}
              </div>
              <div className="text-sm text-gray-500">Featured Items</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.min(...products.map((p) => p.prices[0]?.price || 0))}
              </div>
              <div className="text-sm text-gray-500">Starting From</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter((p) => p.isFavourite).length}
              </div>
              <div className="text-sm text-gray-500">Popular Favorites</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-100">100%</div>
              <div className="text-sm text-gray-500">Fresh Guarantee</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
