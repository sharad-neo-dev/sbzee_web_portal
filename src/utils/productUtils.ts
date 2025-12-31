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
