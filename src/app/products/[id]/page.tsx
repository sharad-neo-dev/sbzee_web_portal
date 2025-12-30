// src/app/products/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import { PreSignedImage } from "@/components/ui/PreSignedImage";
export const products = [
  {
    id: "1",
    name: "Fresh Mango",
    price: 80,
    unit: "kg",
    category: "Fruits",
    image: "/images/mango.jpg",
    rating: 4.5,
    description: "Sweet and juicy seasonal mangoes.",
    inStock: true,
  },
  {
    id: "692d7b0f4460828262fdd8cc",
    name: "Organic Tomatoes",
    price: 40,
    unit: "kg",
    category: "Vegetables",
    image: "/images/tomato.jpg",
    rating: 4.2,
    description: "Farm-fresh organic tomatoes.",
    inStock: true,
  },
];
export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const product = useMemo(
    () => products.find((p) => p.id === String(id)),
    [id]
  );

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <p className="text-lg font-medium">Product not found.</p>
      </div>
    );
  }

  const {
    name,
    category,
    image,
    price,
    unit,
    rating = 0,
    description,
    inStock = true,
  } = product;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Card className="overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image */}
          <div className="relative w-full h-72 md:h-full bg-gray-50">
            <PreSignedImage
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!inStock && (
              <Badge className="absolute top-3 left-3 bg-gray-900 text-white">
                Out of Stock
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-white/95 text-gray-700 shadow-sm">
              {category}
            </Badge>
          </div>

          {/* Right: Info */}
          <CardContent className="p-5 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{name}</h1>

              {rating > 0 && (
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)} / 5
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">₹{price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">/ {unit}</span>
              </div>

              {description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="bg-(--accent) hover:bg-(--accent-dark) flex-1"
                disabled={!inStock}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
