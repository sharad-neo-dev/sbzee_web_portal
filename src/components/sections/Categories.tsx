"use client";

import React, { useState, useEffect } from "react";
import { ProductCard, Product } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductCard";
import { CategoriesGrid } from "@/components/ui/CategoriesGrid";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} from "@/redux/services/productsApi";
import { transformApiProductToUI } from "@/utils/productUtils";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/features/cart/cartSlice";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount?: number;
}

export default function CategoriesSection() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsByCategoryQuery(
    {
      categoryId: activeCategory === "all" ? undefined : activeCategory,
      limit,
      page: currentPage,
    },
    { skip: !categoriesData }
  );

  const categories: Category[] = React.useMemo(() => {
    if (!categoriesData?.data) return [];

    const apiCategories = categoriesData.data.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      productCount: cat.products?.length || 0,
    }));

    return [...apiCategories];
  }, [categoriesData, productsData]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product, selectedPrice?: any) => {
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
    console.log("View all categories");
  };

  const handleLoadMore = () => {
    if (
      productsData?.data?.meta &&
      currentPage < productsData.data.meta.totalPages
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    refetchProducts();
  };

  if (categoriesLoading) {
    return (
      <section className="py-10 lg:py-14">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Categories
            </h2>
            <p className="text-gray-600 mt-2">Loading categories...</p>
          </div>
          <CategoriesGrid loading={true} skeletonCount={4} />
        </div>
      </section>
    );
  }

  //  error state
  if (categoriesError) {
    return (
      <section className="py-10 lg:py-14">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Categories
            </h2>
            <p className="text-gray-600 mt-2">Failed to load categories</p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              Error loading categories. Please try again.
            </p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50">
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const activeCategoryName =
    categories.find((cat) => cat.id === activeCategory)?.name || "All Products";
  const products = productsData?.data?.product || [];
  const meta = productsData?.data?.meta;
  const hasMoreProducts = meta && currentPage < meta.totalPages;

  return (
    <section className="py-10 lg:py-14">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Categories
            </h1>
            <p className="text-gray-600 mt-2">
              Discover our wide range of fresh products
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Shop by Category
          </h2>
          <CategoriesGrid
            categories={categories}
            activeCategoryId={activeCategory}
            onCategoryClick={handleCategoryClick}
            cols={4}
            gap="md"
          />
        </div>

        {/* Products Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategoryName}
              </h2>
              {meta && (
                <p className="text-gray-600 mt-1">
                  Showing {products.length} of {meta.total} products
                  {meta.totalPages > 1 &&
                    ` • Page ${currentPage} of ${meta.totalPages}`}
                </p>
              )}
            </div>

            {productsError && (
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50">
                Retry Products
              </Button>
            )}
          </div>

          {/* Products Loading State */}
          {productsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-44 bg-gray-200 rounded-t-lg" />
                  <div className="p-3 space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-9 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Error State */}
          {productsError && !productsLoading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-red-600 mb-3">
                Failed to load products for this category
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50">
                Try Again
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && !productsError && products.length > 0 && (
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
              {hasMoreProducts && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="border-green-500 text-green-600 hover:bg-green-50 px-8"
                    disabled={productsLoading}>
                    {productsLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Products
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* No Products State */}
          {!productsLoading && !productsError && products.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-3">
                No products found in this category
              </p>
              <p className="text-sm text-gray-500">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
