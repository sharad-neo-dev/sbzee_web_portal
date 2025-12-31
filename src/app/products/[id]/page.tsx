"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Star, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreSignedImage } from "@/components/ui/PreSignedImage";
import { useCart } from "@/hooks/useCart";
import {
  useGetProductByIdQuery,
  useGetRelatedProductQuery,
} from "@/redux/services/productsApi";
import { HorizontalScrollContainer } from "@/components/ui/HorizontalScrollContainer";
import { ProductCard } from "@/components/ui/ProductCard";
import { transformApiProductToUI } from "@/utils/productUtils";

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-gray-200 ${className}`} />
);

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    addToCart,
    getItemByProductAndPrice,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const {
    data: productResponse,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId);

  const { data: relatedResponse, isLoading: relatedLoading } =
    useGetRelatedProductQuery({ productId }, { skip: !productId });

  const relatedProducts = relatedResponse?.data ?? [];

  const product = productResponse?.data;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !product) {
    const errorMessage =
      (error as any)?.data?.message || "Failed to load product";

    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600">{errorMessage}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const selectedPrice = product.price[selectedPriceIndex];

  // Calculate discount
  const discount =
    selectedPrice.originalPrice > selectedPrice.price
      ? Math.round(
          ((selectedPrice.originalPrice - selectedPrice.price) /
            selectedPrice.originalPrice) *
            100
        )
      : 0;

  const cartItem = getItemByProductAndPrice(product.id, selectedPrice.id);
  const currentQty = cartItem?.qty || 0;

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedPrice.id}`,
      productId: product.id,
      priceId: selectedPrice.id,
      name: product.name,
      price: selectedPrice.price,
      originalPrice: selectedPrice.originalPrice,
      qty: quantity,
      unitTypeDescription: selectedPrice.unitTypeDescription,
      image: product.thumbnail || product.images?.[0] || "",
      unit: selectedPrice.unitTypeDescription,
    };

    addToCart(cartItem);
  };

  return (
    <div className="container mx-auto px-4 py-10 mt-20 space-y-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 lg:sticky lg:top-24 h-fit self-start">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-gray-100">
            <PreSignedImage
              src={product.images?.[selectedImageIndex] || product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                -{discount}%
              </Badge>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}>
                  <PreSignedImage
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.hindiName && (
              <p className="text-lg text-gray-600 mt-1">{product.hindiName}</p>
            )}
          </div>

          <Separator />

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">
                ₹{selectedPrice.price.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{selectedPrice.originalPrice.toFixed(2)}
                  </span>
                  <Badge className="bg-green-100 text-green-800 text-lg">
                    Save {discount}%
                  </Badge>
                </>
              )}
            </div>
            <p className="text-gray-600">
              Per {selectedPrice.unitTypeDescription.replace("per ", "")}
            </p>

            {/* Price Variants */}
            {product.price.length > 1 && (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Available Sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {product.price.map((price, index: number) => (
                    <button
                      key={price.id}
                      onClick={() => {
                        setSelectedPriceIndex(index);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedPriceIndex === index
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <div className="font-medium">
                        {price.unitTypeDescription}
                      </div>
                      <div className="text-sm">
                        ₹{price.price.toFixed(2)}
                        {price.originalPrice > price.price && (
                          <span className="text-gray-400 line-through ml-1">
                            ₹{price.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {price.isInCart && price.cartQuantity > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                          In cart: {price.cartQuantity}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {currentQty === 0 ? (
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-(--accent) hover:bg-(--accent-dark) py-6 text-lg cursor-pointer text-white">
                  <ShoppingCart className="h-5 w-5 mr-2 " />
                  Add to Cart
                </Button>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-(--accent) text-white rounded-lg px-4 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cartItem) {
                        decreaseQuantity(cartItem.id, cartItem);
                      }
                    }}
                    className="px-4 py-2 text-2xl cursor-pointer">
                    -
                  </button>
                  <span className="px-4 py-2 text-xl font-medium w-12 text-center">
                    {currentQty}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cartItem) {
                        increaseQuantity(cartItem.id, cartItem);
                      }
                    }}
                    className="px-4 py-2 text-2xl cursor-pointer">
                    +
                  </button>
                </div>
              )}

              <Button className="flex-1 bg-white border-2 border-(--accent) text-(--accent) hover:bg-(--accent)/10 py-6 text-lg">
                Buy Now
              </Button>
            </div>
          </div>

          <Separator />

          {/* Product Description */}
          {product.description && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Company & Certification Info */}
          <div className="space-y-4 pt-4 border-t">
            {product.companyName && (
              <div>
                <p className="font-medium text-gray-900">Sold by:</p>
                <p className="text-gray-600">{product.companyName}</p>
              </div>
            )}

            {product.fssaiLicenseNumber && (
              <div>
                <p className="font-medium text-gray-900">FSSAI License:</p>
                <p className="text-gray-600">{product.fssaiLicenseNumber}</p>
              </div>
            )}

            {product.additivesInfo && (
              <div>
                <p className="font-medium text-gray-900">Additives Info:</p>
                <p className="text-gray-600">{product.additivesInfo}</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p className="text-sm text-gray-500">On orders above ₹199</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quality Guarantee</p>
                <p className="text-sm text-gray-500">Freshness assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <HorizontalScrollContainer
            title="Related Products"
            subtitle="You might also like"
            className="px-0 -mx-4 sm:-mx-8 lg:-mx-32 xl:-mx-48">
            {relatedProducts.map((apiProduct) => {
              const uiProduct = transformApiProductToUI(apiProduct);

              return (
                <div
                  key={apiProduct.id}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px]">
                  <ProductCard product={uiProduct} />
                </div>
              );
            })}
          </HorizontalScrollContainer>
        </div>
      )}
    </div>
  );
}
