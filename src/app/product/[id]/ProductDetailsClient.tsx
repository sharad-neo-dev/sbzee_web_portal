"use client";

import { Suspense } from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle,
  Leaf,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ui/ProductCard";
import { HorizontalScrollContainer } from "@/components/ui/HorizontalScrollContainer";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cart/cartSlice";
import {
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useToggleFavoriteMutation,
} from "@/redux/services/productsApi";
import { convertToUIProduct } from "@/types/products.types";
import type {
  SingleProductResponse,
  ProductPrice,
  Product,
} from "@/types/products.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/hooks/useCart";

interface ProductDetailsClientProps {
  productId: string;
  initialProduct?: SingleProductResponse;
}

export default function ProductDetailsClient({
  productId,
}: {
  productId: string;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent productId={productId} />
    </Suspense>
  );
}

function ProductDetailsContent({
  productId,
  initialProduct,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  const { items, addToCart, updateCartItemQuantity, removeFromCart } =
    useCart();

  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });
  console.log(productResponse, "prr");
  const { data: relatedResponse, isLoading: relatedLoading } =
    useGetRelatedProductsQuery(productId, {
      skip: !productId,
    });

  const [toggleFavorite, { isLoading: isTogglingFavorite }] =
    useToggleFavoriteMutation();

  const product = productResponse?.data;
  const relatedProducts = (relatedResponse?.data as unknown as Product[]) || [];
  // Calculate discount for selected price
  const selectedPrice = product?.price?.[selectedPriceIndex];
  const discount =
    selectedPrice && selectedPrice.originalPrice > selectedPrice.price
      ? Math.round(
          ((selectedPrice.originalPrice - selectedPrice.price) /
            selectedPrice.originalPrice) *
            100
        )
      : 0;

  // Handle loading state
  if (isLoading && !initialProduct) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  // Handle error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => refetch()}
              className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  const cartItemId = `${product.id}-${selectedPrice?.id}`;

  const cartItem = items.find((item: any) => item.id === cartItemId);
  const cartQuantity = cartItem?.quantity || 0;
  const isInCart = cartQuantity > 0;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedPrice) return;

    await addToCart({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: selectedPrice.price,
      quantity,
      image: product.thumbnail,
      unit: selectedPrice.unitTypeDescription,
      category: product.category?.name || "Uncategorized",
      priceId: selectedPrice.id,
      unitType: selectedPrice.unitType,
    });
  };

  const handleIncreaseQuantity = async () => {
    if (!cartItem) {
      await handleAddToCart();
      return;
    }

    await updateCartItemQuantity({
      productId: cartItemId,
      quantity: cartQuantity + 1,
      priceId: selectedPrice?.id,
    });
  };

  const handleDecreaseQuantity = async () => {
    if (!cartItem) return;

    if (cartQuantity === 1) {
      await removeFromCart({
        productId: cartItemId,
        priceId: selectedPrice?.id,
      });
    } else {
      await updateCartItemQuantity({
        productId: cartItemId,
        quantity: cartQuantity - 1,
        priceId: selectedPrice?.id,
      });
    }
  };

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite({ productId }).unwrap();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Breadcrumb navigation
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/#categories" },
    {
      name: product.category?.name || "Category",
      href: `/#categories-${product.category?.id}`,
    },
    { name: product.name, href: `#` },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 pt-24 pb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.name} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">{crumb.name}</span>
              ) : (
                <button
                  onClick={() => router.push(crumb.href)}
                  className="hover:text-green-600 transition-colors">
                  {crumb.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.nav>

      {/* Main Product Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 lg:h-[500px] w-full rounded-2xl overflow-hidden bg-white group">
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}

              <ProductImage
                src={product.images?.[selectedImageIndex] || product.thumbnail}
                alt={product.name || "Product Image"}
                fill
                className={cn(
                  "w-full h-full object-contain transition-all duration-500",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                isPreSigned={true}
                priority={true}
              />

              {/* Discount Badge */}
              {discount > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="absolute top-4 left-4">
                  <Badge className="bg-linear-to-r from-red-500 to-orange-500 text-white text-lg px-4 py-2 shadow-lg">
                    -{discount}% OFF
                  </Badge>
                </motion.div>
              )}

              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Heart
                  className={cn(
                    "h-6 w-6 transition-all",
                    product.isFavourite
                      ? "fill-red-500 text-red-500 animate-pulse"
                      : "text-gray-600"
                  )}
                />
              </motion.button>

              {/* Category Badge */}
              <Badge className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2">
                {product.category?.name}
              </Badge>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsImageLoading(true);
                    }}
                    className={cn(
                      "relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-green-500 ring-2 ring-green-500/30"
                        : "border-gray-200 hover:border-gray-300"
                    )}>
                    <ProductImage
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="w-full h-full object-cover"
                      isPreSigned={true}
                      priority={index < 3}
                    />
                    {selectedImageIndex === index && (
                      <motion.div
                        layoutId="imageThumbnail"
                        className="absolute inset-0 bg-green-500/10"
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-500">Orders above ₹199</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Quality Guarantee
                  </p>
                  <p className="text-xs text-gray-500">Freshness Assured</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 lg:sticky lg:top-24 self-start">
            {/* Product Name & Hindi Name */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </motion.h1>
              {product.hindiName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-600 mt-2">
                  {product.hindiName}
                </motion.p>
              )}
            </div>

            <Separator />

            {/* Price Section */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-4xl lg:text-5xl font-bold text-gray-900">
                  ₹{selectedPrice?.price.toFixed(2)}
                </motion.span>
                {discount > 0 && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-2xl text-gray-400 line-through">
                      ₹{selectedPrice?.originalPrice.toFixed(2)}
                    </motion.span>
                    <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white text-lg px-4 py-1">
                      Save {discount}%
                    </Badge>
                  </>
                )}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600">
                Per {selectedPrice?.unitTypeDescription?.replace("per ", "")}
              </motion.p>

              {/* Price Variants */}
              {product.price && product.price.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3">
                  <p className="font-medium text-gray-900">Available Sizes:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <AnimatePresence>
                      {product.price.map(
                        (price: ProductPrice, index: number) => {
                          const priceCartItemId = `${product.id}-${price.id}`;
                          const priceCartItem = items.find(
                            (item: any) => item.id === priceCartItemId
                          );
                          const priceCartQuantity =
                            priceCartItem?.quantity || 0;
                          return (
                            <motion.button
                              key={price.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedPriceIndex(index);
                                setQuantity(
                                  priceCartQuantity > 0 ? priceCartQuantity : 1
                                );
                              }}
                              className={cn(
                                "p-3 rounded-xl border-2 transition-all text-left",
                                selectedPriceIndex === index
                                  ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/30"
                                  : "border-gray-200 hover:border-gray-300"
                              )}>
                              <div className="font-medium">
                                {price.unitTypeDescription}
                              </div>
                              <div className="text-sm mt-1">
                                <span className="font-semibold">
                                  ₹{price.price.toFixed(2)}
                                </span>
                                {price.originalPrice > price.price && (
                                  <span className="text-gray-400 line-through ml-2">
                                    ₹{price.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {priceCartQuantity > 0 && (
                                <div className="text-xs text-green-600 mt-2 flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  In cart: {price.cartQuantity}
                                </div>
                              )}
                            </motion.button>
                          );
                        }
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>

            <Separator />

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4">
              {isInCart ? (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDecreaseQuantity}
                      className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                      <span className="text-xl">-</span>
                    </motion.button>
                    <motion.span
                      key={quantity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold w-12 text-center">
                      {quantity}
                    </motion.span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleIncreaseQuantity}
                      className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                      <span className="text-xl">+</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">In Cart:</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-medium text-sm">
                      {cartQuantity} items in cart
                    </div>
                    <div className="flex items-center border border-green-600 rounded-lg overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDecreaseQuantity}
                        className="h-8 w-8 rounded-none text-green-600 hover:bg-green-50">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-2 font-medium min-w-8 text-center">
                        {cartQuantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleIncreaseQuantity}
                        className="h-8 w-8 rounded-none text-green-600 hover:bg-green-50">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {!isInCart ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                      Buy Now
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleIncreaseQuantity}
                      className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add More
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                      Buy Now
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>

            <Separator />

            {/* Product Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}>
                  {activeTab === "description" && (
                    <div className="space-y-3">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3">
                          {product.tags.map((tag: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div className="space-y-4">
                      {product.companyName && (
                        <div>
                          <p className="font-medium text-gray-900">Sold by:</p>
                          <p className="text-gray-600">{product.companyName}</p>
                        </div>
                      )}
                      {product.companyAddress && (
                        <div>
                          <p className="font-medium text-gray-900">Address:</p>
                          <p className="text-gray-600 text-sm">
                            {product.companyAddress}
                          </p>
                        </div>
                      )}
                      {product.fssaiLicenseNumber && (
                        <div>
                          <p className="font-medium text-gray-900">
                            FSSAI License:
                          </p>
                          <p className="text-gray-600">
                            {product.fssaiLicenseNumber}
                          </p>
                        </div>
                      )}
                      {product.additivesInfo && (
                        <div>
                          <p className="font-medium text-gray-900">
                            Additives:
                          </p>
                          <p className="text-gray-600">
                            {product.additivesInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "benefits" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Fresh from Farm
                          </p>
                          <p className="text-sm text-gray-600">
                            Direct sourcing ensures maximum freshness
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Quality Packed
                          </p>
                          <p className="text-sm text-gray-600">
                            Carefully packed to maintain freshness
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 py-12 mt-12">
          <HorizontalScrollContainer
            title="You Might Also Like"
            subtitle="People who bought this also bought"
            showNavigation={true}
            className="px-0">
            {relatedProducts.map((apiProduct) => {
              const uiProduct = convertToUIProduct(apiProduct);
              return (
                <motion.div
                  key={apiProduct.id}
                  whileHover={{ y: -5 }}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px]">
                  <ProductCard
                    product={uiProduct}
                    variant="default"
                    showFavorite={true}
                    showHindiName={true}
                  />
                </motion.div>
              );
            })}
          </HorizontalScrollContainer>
        </motion.section>
      )}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.thumbnail,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: product.companyName || "Sbzee",
            },
            offers: {
              "@type": "Offer",
              price: selectedPrice?.price,
              priceCurrency: "INR",
              priceValidUntil: new Date(Date.now() + 86400000).toISOString(), // 24 hours
              availability: "https://schema.org/InStock",
              url: window?.location?.href || "",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: 4.5,
              reviewCount: 128,
            },
          }),
        }}
      />
    </>
  );
}

// Skeleton Loader
function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-16" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Skeleton */}
        <div className="space-y-4">
          <div className="h-96 lg:h-[500px] bg-gray-200 rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>

          <div className="h-px bg-gray-200" />

          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
