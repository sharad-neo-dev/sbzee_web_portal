"use client";

import React from "react";
import { ProductCard, Product } from "@/components/ui/ProductCard";
import { HorizontalScrollContainer } from "@/components/ui/HorizontalScrollContainer";

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Gourds",
    price: 25.0,
    unit: "500 gm",
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    rating: 4.5,
    discount: 10,
    description: "Fresh and organic gourds, perfect for cooking",
  },
  {
    id: 2,
    name: "Organic Cucumber",
    price: 17.0,
    unit: "1 kg",
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1Y3VtYmVyfGVufDB8fDB8fHww",
    rating: 4.2,
    discount: 5,
    description: "Crisp organic cucumbers, great for salads",
  },
  {
    id: 3,
    name: "Premium Onions",
    price: 23.0,
    unit: "1 kg",
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25pb25zfGVufDB8fDB8fHww",
    rating: 4.0,
    description: "Fresh red onions, essential for every kitchen",
  },
  {
    id: 4,
    name: "Red Delicious Apples",
    price: 29.0,
    unit: "1 kg",
    category: "fruits",
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop",
    rating: 4.7,
    discount: 15,
    description: "Sweet and juicy red apples",
  },
  {
    id: 5,
    name: "Fresh Bananas",
    price: 19.0,
    unit: "Dozen",
    category: "fruits",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    rating: 4.3,
    discount: 8,
    description: "Ripe bananas, perfect for snacks",
  },
  {
    id: 6,
    name: "Organic Tomatoes",
    price: 21.0,
    unit: "1 kg",
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
    rating: 4.1,
    description: "Fresh organic tomatoes, rich in flavor",
  },
  {
    id: 7,
    name: "Fresh Potatoes",
    price: 18.0,
    unit: "1 kg",
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
    rating: 4.0,
    discount: 12,
    description: "Premium quality potatoes",
  },
  {
    id: 8,
    name: "Green Grapes",
    price: 35.0,
    unit: "500 gm",
    category: "fruits",
    image:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop",
    rating: 4.6,
    description: "Sweet seedless green grapes",
  },
];

function FeaturedProducts() {
  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
  };

  const handleViewAll = () => {
    console.log("View all products");
  };

  return (
    <HorizontalScrollContainer
      title="Featured Products"
      subtitle="Fresh picks just for you"
      onViewAllClick={handleViewAll}
      className="mt-10 lg:mt-14"
      containerClassName="px-4">
      {featuredProducts.map((product) => (
        <div key={product.id} className="min-w-[280px] md:min-w-[300px]">
          <ProductCard
            product={product}
            onAddToCart={handleAddToCart}
            variant="default"
          />
        </div>
      ))}
    </HorizontalScrollContainer>
  );
}

export default FeaturedProducts;
