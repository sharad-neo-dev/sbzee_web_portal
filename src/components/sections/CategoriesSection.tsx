"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} from "@/redux/services/productsApi";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import { convertToUIProduct } from "@/types/products.types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoriesSEO } from "@/components/seo/CategoriesSEO";

export default function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();

  // Fetch products by category - FIXED: Added skip condition
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts, // Added refetch function
  } = useGetProductsByCategoryQuery(
    {
      categoryId: selectedCategory,
      page: currentPage,
      limit: itemsPerPage,
    },
    {
      skip: !selectedCategory, // Skip if no category selected
      refetchOnMountOrArgChange: true, // Refetch when args change
    }
  );

  // Extract categories from API response
  const categories = categoriesData?.data || [];

  // Extract products and pagination info
  const products =
    productsData?.data?.product || productsData?.data?.products || [];
  const totalProducts = productsData?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Log for debugging
  // useEffect(() => {
  //   console.log("Selected Category:", selectedCategory);
  //   console.log("Current Page:", currentPage);
  //   console.log("Products Data:", productsData);
  //   console.log("Products:", products);
  //   console.log("Total Products:", totalProducts);
  // }, [selectedCategory, currentPage, productsData, products, totalProducts]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    // console.log("Category selected:", categoryId);
    setSelectedCategory(categoryId);
    // Page will be reset by useEffect
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle page number click
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );

  return (
    <>
      <CategoriesSEO
        selectedCategory={selectedCategoryData}
        totalProducts={totalProducts}
      />

      <section className="py-12 bg-linear-to-b from-white to-green-50/30">
        <div className="container-custom px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our fresh selection of fruits and vegetables. All products
              are sourced directly from farms for maximum freshness.
            </p>
          </motion.div>

          {/* Categories Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-10">
            {isLoadingCategories ? (
              <div className="flex justify-center space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : isCategoriesError ? (
              <div className="text-center text-red-500">
                Failed to load categories
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "px-6 py-3 rounded-full font-medium transition-all duration-300 relative",
                      "border-2 hover:shadow-lg",
                      selectedCategory === category.id
                        ? "bg-green-600 text-white border-green-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:text-green-600"
                    )}>
                    {category.name}
                    {selectedCategory === category.id && (
                      <motion.span
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-green-600 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Category Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCategoryData?.name || "All Products"}
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  {selectedCategoryData?.description ||
                    "Browse through all our fresh fruits and vegetables. Quality guaranteed!"}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Page {currentPage} of {totalPages} • {totalProducts} products
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${currentPage}-products`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              {isLoadingProducts ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <ProductCardSkeleton />
                    </motion.div>
                  ))}
                </motion.div>
              ) : isProductsError ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">😞</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Failed to load products
                  </h3>
                  <p className="text-gray-500 mb-4">Please try again later</p>
                  <Button
                    onClick={() => refetchProducts()}
                    className="bg-green-600 hover:bg-green-700">
                    Retry
                  </Button>
                </div>
              ) : products.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => {
                      const uiProduct = convertToUIProduct(product);
                      return (
                        <motion.div
                          key={`${product.id}-${index}`}
                          variants={itemVariants}
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}>
                          <ProductCard
                            product={uiProduct}
                            variant="default"
                            showFavorite={true}
                            showHindiName={true}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-12 flex flex-col items-center">
                      <div className="text-gray-600 mb-4 text-sm">
                        Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                        {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
                        {totalProducts} products
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className="h-10 w-10 rounded-full"
                          aria-label="Previous page">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {getPageNumbers().map((pageNumber) => (
                          <Button
                            key={pageNumber}
                            variant={
                              currentPage === pageNumber ? "default" : "outline"
                            }
                            onClick={() => handlePageClick(pageNumber)}
                            className={cn(
                              "h-10 w-10 rounded-full",
                              currentPage === pageNumber &&
                                "bg-green-600 hover:bg-green-700"
                            )}>
                            {pageNumber}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="h-10 w-10 rounded-full"
                          aria-label="Next page">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Go to page:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                              handlePageClick(page);
                            }
                          }}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                        <span className="text-sm text-gray-500">
                          of {totalPages}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12">
                  <div className="text-5xl mb-4">🥬</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any products in this category. Try
                    selecting a different category.
                  </p>
                  {selectedCategory !== "all" && (
                    <Button
                      onClick={() => setSelectedCategory("all")}
                      className="bg-green-600 hover:bg-green-700">
                      Browse All Products
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stats  */}
          {!isLoadingProducts && products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalProducts}
                  </div>
                  <div className="text-sm text-gray-500">Total Products</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {categories.length}
                  </div>
                  <div className="text-sm text-gray-500">Categories</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-500">Fresh Guarantee</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                  <div className="text-2xl font-bold text-green-600">24h</div>
                  <div className="text-sm text-gray-500">Delivery Window</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
