"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Filter,
  Grid,
  List,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";
import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/redux/services/productsApi";
import { convertToUIProduct } from "@/types/products.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function FavoritesContent() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "name" | "price-low" | "price-high" | "recent"
  >("recent");

  // Fetch favorites with pagination
  const {
    data: favoritesData,
    isLoading,
    isError,
    refetch,
  } = useGetFavoritesQuery({ page: 1, limit: 50 });

  const [toggleFavorite] = useToggleFavoriteMutation();

  // Extract data
  const favorites = favoritesData?.data?.products || [];
  const totalItems = favoritesData?.data?.meta?.total || 0;

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.hindiName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || product.category?.id === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (a.price?.[0]?.price || 0) - (b.price?.[0]?.price || 0);
        case "price-high":
          return (b.price?.[0]?.price || 0) - (a.price?.[0]?.price || 0);
        case "recent":
        default:
          return 0; // API should return in recent order
      }
    });

  // Extract unique categories
  const categories = Array.from(
    new Set(favorites.map((p) => p.category?.id).filter(Boolean))
  ).map((id) => {
    const product = favorites.find((p) => p.category?.id === id);
    return {
      id: id!,
      name: product?.category?.name || "Uncategorized",
      count: favorites.filter((p) => p.category?.id === id).length,
    };
  });

  // Handle favorite toggle
  const handleToggleFavorite = async (productId: string) => {
    try {
      await toggleFavorite({ productId }).unwrap();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Handle clear all
  const handleClearAll = async () => {
    // You might want to implement a batch unfavorite API
    console.log("Clear all favorites");
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <ProductGridSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Failed to load favorites
        </h1>
        <p className="text-gray-600 mb-6">
          There was an error loading your favorite products.
        </p>
        <Button
          onClick={() => refetch()}
          className="bg-green-600 hover:bg-green-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "My Favorite Products",
            description: "A collection of favorite fruits and vegetables",
            numberOfItems: totalItems,
            itemListElement: filteredFavorites
              .slice(0, 10)
              .map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  name: product.name,
                  description: product.description,
                  image: product.thumbnail,
                },
              })),
          }),
        }}
      />

      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-2">
                {totalItems} saved {totalItems === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>

              {totalItems > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                  className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalItems}
              </div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">
                {favorites.filter((p) => p.isInCartForAnyPrice).length}
              </div>
              <div className="text-sm text-gray-500">In Cart</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-500">Fresh Guarantee</div>
            </div>
          </div>
        </motion.header>

        {/* Filters & Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search in favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "cursor-pointer",
                  selectedCategory === "all" &&
                    "bg-green-600 hover:bg-green-700"
                )}>
                All ({totalItems})
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "cursor-pointer",
                    selectedCategory === category.id &&
                      "bg-green-600 hover:bg-green-700"
                  )}>
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>

            {/* View & Sort Controls */}
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "grid"
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-gray-100"
                  )}>
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === "list"
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-gray-100"
                  )}>
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg bg-white">
                <option value="recent">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {filteredFavorites.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16">
              <div className="text-6xl mb-4">❤️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery || selectedCategory !== "all"
                  ? "No matching favorites"
                  : "Your favorites list is empty"}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your filters or search to find what you're looking for."
                  : "Start adding your favorite fruits and vegetables for quick access."}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  router.push("/");
                }}
                className="bg-green-600 hover:bg-green-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}>
              {filteredFavorites.map((product) => {
                const uiProduct = convertToUIProduct(product);

                return viewMode === "grid" ? (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -5 }}>
                    <ProductCard
                      product={uiProduct}
                      variant="default"
                      showFavorite={true}
                      showHindiName={true}
                      onAddToCart={() => {
                        // Handle add to cart
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {product.name}
                            </h3>
                            {product.hindiName && (
                              <p className="text-gray-500 text-sm">
                                {product.hindiName}
                              </p>
                            )}
                            <Badge variant="outline" className="mt-1">
                              {product.category?.name}
                            </Badge>
                          </div>
                          <button
                            onClick={() => handleToggleFavorite(product.id)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors">
                            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold">
                              ₹{product.price?.[0]?.price.toFixed(2)}
                            </span>
                            <span className="text-gray-500 text-sm ml-2">
                              / {product.price?.[0]?.unitTypeDescription}
                            </span>
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
