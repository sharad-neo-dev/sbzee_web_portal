import { Product as UIProduct } from "@/components/ui/ProductCard";
import { Product as APIProduct } from "@/redux/services/productsApi";

export function transformApiProductToUI(apiProduct: APIProduct): UIProduct {
  const defaultPrice = apiProduct.prices[0];

  const discount =
    defaultPrice.originalPrice > defaultPrice.price
      ? Math.round(
          ((defaultPrice.originalPrice - defaultPrice.price) /
            defaultPrice.originalPrice) *
            100
        )
      : 0;

  const unit = defaultPrice.unitTypeDescription.replace("per ", "");

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: defaultPrice.price,
    unit: unit,
    category: apiProduct.category.name,
    image: apiProduct.thumbnail,
    thumbnail: apiProduct.thumbnail,
    discount: discount,
    description: apiProduct.description,
    inStock: true,
    hindiName: apiProduct.hindiName,
    isFeatured: apiProduct.isFeatured,
    isFavourite: apiProduct.isFavourite,
    prices: apiProduct.prices.map((price) => ({
      id: price.id,
      price: price.price,
      originalPrice: price.originalPrice,
      unitType: price.unitType,
      unitTypeDescription: price.unitTypeDescription,
    })),
  };
}

export function getBestPrice(apiProduct: APIProduct): {
  price: number;
  originalPrice: number;
  unit: string;
  discount: number;
} {
  if (!apiProduct.prices || apiProduct.prices.length === 0) {
    return { price: 0, originalPrice: 0, unit: "", discount: 0 };
  }

  const bestPrice = apiProduct.prices.reduce((best, current) => {
    const currentDiscount =
      current.originalPrice > current.price
        ? ((current.originalPrice - current.price) / current.originalPrice) *
          100
        : 0;

    const bestDiscount =
      best.originalPrice > best.price
        ? ((best.originalPrice - best.price) / best.originalPrice) * 100
        : 0;

    if (currentDiscount > bestDiscount) return current;
    if (currentDiscount === bestDiscount && current.price < best.price)
      return current;
    return best;
  });

  const discount =
    bestPrice.originalPrice > bestPrice.price
      ? Math.round(
          ((bestPrice.originalPrice - bestPrice.price) /
            bestPrice.originalPrice) *
            100
        )
      : 0;

  return {
    price: bestPrice.price,
    originalPrice: bestPrice.originalPrice,
    unit: bestPrice.unitTypeDescription.replace("per ", ""),
    discount,
  };
}
