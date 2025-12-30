"use client";

import React, { useEffect } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { HorizontalScrollContainer } from "@/components/ui/HorizontalScrollContainer";
import { useGetFeaturedProductsQuery } from "@/redux/services/productsApi";
import { transformApiProductToUI } from "@/utils/productUtils";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/features/cart/cartSlice";
import { getPreSignedUrls } from "@/utils/imageUtils";

function FeaturedProducts() {
  const { data, isLoading, error } = useGetFeaturedProductsQuery({
    limit: 10,
    page: 1,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.data?.products) {
      const imageUrls = data.data.products.map((product) => product.thumbnail);
      getPreSignedUrls(imageUrls).catch((err) => {
        console.error("Failed to pre-fetch image URLs:", err);
      });
    }
  }, [data]);

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

    console.log("Added to cart:", cartItem);
  };

  const handleViewAll = () => {
    console.log("View all products");
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Loading fresh picks for you...
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="min-w-[280px] md:min-w-[300px]">
              <div className="animate-pulse">
                <div className="h-44 bg-gray-200 rounded-t-lg" />
                <div className="p-3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                  <div className="h-9 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Fresh picks just for you
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Failed to load featured products. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-green-600 hover:text-green-700 font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const products = data?.data?.products || [];

  if (products.length === 0) {
    return (
      <div className="container-custom py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Fresh picks just for you
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">
            No featured products available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <HorizontalScrollContainer
      title="Featured Products"
      subtitle="Fresh picks just for you"
      onViewAllClick={handleViewAll}
      className="mt-10 lg:mt-14">
      {products.map((apiProduct) => {
        const uiProduct = transformApiProductToUI(apiProduct);
        return (
          <div key={apiProduct.id} className="min-w-[280px] md:min-w-[300px]">
            <ProductCard
              product={uiProduct}
              onAddToCart={handleAddToCart}
              variant="default"
            />
          </div>
        );
      })}
    </HorizontalScrollContainer>
  );
}

export default FeaturedProducts;
