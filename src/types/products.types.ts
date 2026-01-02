export interface ApiResponse<T> {
  status?: boolean;
  success?: boolean;
  message: string;
  data: T;
  error?: any;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Category Types
export interface Category {
  id: string;
  uniqueId?: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  products?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryWithProducts extends Category {
  products: string[];
}

// Price/Unit Types
export interface ProductPrice {
  id: string;
  price: number;
  originalPrice: number;
  currency: "INR";
  unitType: "weight" | "piece" | "packet" | "bundle";
  unitTypeDescription: string;
  area?: string;
  isInCart: boolean;
  cartQuantity: number;
}
export interface ApiProduct {
  id: string;
  uniqueId: string;
  name: string;
  hindiName: string;
  description: string;
  thumbnail: string;
  images?: string[];
  category: {
    id: string;
    name: string;
    description?: string;
  };
  // Handle both price and prices
  price?: ProductPrice[];
  prices?: ProductPrice[];
  tags: string[];
  isFeatured: boolean;
  isInCartForAnyPrice: boolean;
  isFavourite: boolean;
  fssaiLicenseNumber?: string;
  additivesInfo?: string;
  companyAddress?: string;
  companyName?: string;
}

// Product Types
export interface Product extends ApiProduct {
  prices: ProductPrice[];
}

// Product List Response
export interface ProductListResponse {
  products?: ApiProduct[];
  product?: ApiProduct[];
  meta: PaginationMeta;
}

// Featured Products Response
export interface FeaturedProductsResponse {
  products: ApiProduct[];
  meta: PaginationMeta;
}

// Single Product Response
export interface SingleProductResponse {
  data: {
    category: Category;
    isInCartForAnyPrice: boolean;
    id: string;
    uniqueId: string;
    name: string;
    hindiName: string;
    description: string;
    thumbnail: string;
    images: string[];
    tags: string[];
    price: ProductPrice[];
    isFavourite: boolean;
    fssaiLicenseNumber?: string;
    additivesInfo?: string;
    companyAddress?: string;
    companyName?: string;
  };
  message: string;
  success: boolean;
}

// Related Products Response
export interface RelatedProductsResponse {
  data: Product[];
  status?: boolean;
  message?: string;
  error?: any;
}

// Favorites Response
export interface FavoritesResponse {
  products: ApiProduct[];
  meta: PaginationMeta;
}

// API Request Params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CategoryProductsParams extends PaginationParams {
  categoryId?: string;
}

export interface FeaturedProductsParams extends PaginationParams {}

// UI Product Card Interface (for display)
export interface UIProduct {
  id: string;
  name: string;
  hindiName: string;
  price: number;
  originalPrice: number;
  unit: string;
  unitType: "weight" | "piece" | "packet" | "bundle";
  category: string;
  categoryId: string;
  image: string;
  images?: string[];
  description: string;
  tags: string[];
  isFavourite: boolean;
  isInCart: boolean;
  cartQuantity: number;
  discount?: number;
  inStock?: boolean;
  rating?: number;
  priceOptions?: ProductPrice[];
}

export const convertToUIProduct = (apiProduct: ApiProduct): UIProduct => {
  const priceArray = apiProduct.price || apiProduct.prices || [];
  const bestPrice = priceArray.length > 0 ? priceArray[0] : null;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    hindiName: apiProduct.hindiName,
    price: bestPrice?.price || 0,
    originalPrice: bestPrice?.originalPrice || 0,
    unit: bestPrice?.unitTypeDescription || "",
    unitType: bestPrice?.unitType || "weight",
    category: apiProduct.category.name,
    categoryId: apiProduct.category.id,
    image: apiProduct.thumbnail,
    images: apiProduct.images,
    description: apiProduct.description,
    tags: apiProduct.tags,
    isFavourite: apiProduct.isFavourite,
    isInCart: apiProduct.isInCartForAnyPrice,
    cartQuantity: priceArray.reduce(
      (total, p) => total + (p.cartQuantity || 0),
      0
    ),
    discount: bestPrice
      ? Math.round(
          ((bestPrice.originalPrice - bestPrice.price) /
            bestPrice.originalPrice) *
            100
        )
      : 0,
    inStock: true,
    priceOptions: priceArray,
  };
};
