"use client";

import React, { useState } from "react";
import {
  ProductCard,
  ProductGrid,
  ProductCardSkeleton,
} from "@/components/ui/ProductCard";
import { useGetFavouriteProductQuery } from "@/redux/services/productsApi";
import { transformApiProductToUI } from "@/utils/productUtils";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/features/cart/cartSlice";

export default function FavouritesPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const dispatch = useDispatch();
  const {
    data: favouritesData,
    isLoading,
    error,
    isFetching,
  } = useGetFavouriteProductQuery({ limit, page });

  const handleAddToCart = (product: any, selectedPrice?: any) => {
    const cartItem = {
      id: selectedPrice?.id || `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: selectedPrice?.price || product.price,
      originalPrice: selectedPrice?.originalPrice || product.price,
      qty: 1,
      image: product.image,
      unit:
        selectedPrice?.unitTypeDescription.replace("per ", "") || product.unit,
      priceId: selectedPrice?.id,
      unitTypeDescription: selectedPrice?.unitTypeDescription || product.unit,
    };

    dispatch(addItem(cartItem));
  };

  const products = favouritesData?.data?.products || [];
  const meta = favouritesData?.data?.meta;
  const hasMore = meta && page < meta.totalPages;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center py-12 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to load favourites
            </h2>
            <p className="text-gray-600 mb-6">
              Please refresh the page or try again later
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-(--accent) hover:bg-(--accent-dark)">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-(--accent)/10 p-4 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-(--accent)" fill="currentColor" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-(--accent) bg-clip-text text-transparent">
                Your Favourites
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {meta?.total || 0} saved items
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6 opacity-75" />
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              No favourites yet
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
              Tap the heart icon on any product to save it here for quick access
              later.
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-(--accent) hover:bg-(--accent-dark) text-lg px-8 h-12">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <>
            <ProductGrid cols={4} gap="md">
              {products.map((apiProduct) => {
                const uiProduct = transformApiProductToUI(apiProduct);
                return (
                  <ProductCard
                    key={apiProduct.id}
                    product={uiProduct}
                    onAddToCart={handleAddToCart}
                    variant="default"
                  />
                );
              })}
            </ProductGrid>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-20">
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isFetching}
                  size="lg"
                  className="bg-(--accent) hover:bg-(--accent-dark) text-lg px-12 h-12 shadow-xl">
                  {isFetching ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading more favourites...
                    </>
                  ) : (
                    <>
                      Load More ({meta?.total || 0} total)
                      <span className="ml-2">→</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
