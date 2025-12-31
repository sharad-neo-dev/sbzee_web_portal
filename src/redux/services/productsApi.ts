import { baseApi } from "./baseApi";

export interface Product {
  id: string;
  uniqueId: string;
  name: string;
  hindiName: string;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  category: {
    id: string;
    name: string;
    description?: string;
  };
  prices: Array<{
    id: string;
    currency: string;
    unitType: string;
    unitTypeDescription: string;
    price: number;
    originalPrice: number;
    isInCart: boolean;
    cartQuantity: number;
  }>;
  isFeatured: boolean;
  isFavourite: boolean;
  isInCartForAnyPrice: boolean;
  fssaiLicenseNumber?: string;
  additivesInfo?: string;
  companyAddress?: string;
  companyName?: string;
}

export interface FeaturedProductsResponse {
  status: boolean;
  message: string;
  data: {
    products: Product[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error: null | string;
}

export interface GetFeaturedProductsParams {
  limit: number;
  page: number;
}

export interface RelatedProductsResponse {
  status: boolean;
  message: string;
  data: Product[];
  error: null | string;
}
export interface GetRelatedProductsParams {
  productId: string;
}

export interface Category {
  id: string;
  uniqueId: string;
  name: string;
  description: string;
  isActive: boolean;
  image: string;
  products: string[];
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Category[];
  error: null | string;
}

export interface ProductsByCategoryParams {
  categoryId?: string;
  limit: number;
  page: number;
}

export interface ProductsByCategoryResponse {
  status: boolean;
  message: string;
  data: {
    product: Product[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error: null | string;
}

export interface searchProduct {
  category: {
    id: string;
    name: string;
  };
  isInCartForAnyPrice: boolean;
  id: string;
  uniqueId: string;
  name: string;
  hindiName: string;
  description: string;
  thumbnail: string;
  tags: string[];
  isFeatured: boolean;
  isFavourite: boolean;
  price: {
    id: string;
    currency: string;
    unitType: string;
    unitTypeDescription: string;
    price: number;
    originalPrice: number;
    isInCart: boolean;
    cartQuantity: number;
  }[];
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeaturedProducts: builder.query<
      FeaturedProductsResponse,
      GetFeaturedProductsParams
    >({
      query: ({ limit, page }) => ({
        url: `/user/featured-products`,
        method: "GET",
        params: {
          limit,
          page,
        },
      }),
      providesTags: ["featuredProducts"],
    }),

    // Get all categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: `/user/categories`,
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Get products by category
    getProductsByCategory: builder.query<
      ProductsByCategoryResponse,
      ProductsByCategoryParams
    >({
      query: ({ categoryId, limit, page }) => {
        const params: any = { limit, page };
        if (categoryId && categoryId !== "all") {
          params.categoryId = categoryId;
        }

        return {
          url: `/product/products-by-category`,
          method: "GET",
          params,
        };
      },
      providesTags: (result, error, arg) => [
        { type: "Products", id: arg.categoryId || "all" },
      ],
    }),

    // Get product by ID
    getProductById: builder.query<
      {
        success: boolean;
        message: string;
        data?: Product;
      },
      string
    >({
      query: (id) => ({
        url: `/user/product/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    // Create favourite Products
    createFavouriteProduct: builder.mutation<
      {
        status: boolean;
        message: string;
        data: { isFavorite: boolean };
      },
      string
    >({
      query: (id) => ({
        url: `/user/favorites/toggle/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        "featuredProducts",
      ],
    }),

    // get favourite Products
    getFavouriteProduct: builder.query<
      FeaturedProductsResponse,
      GetFeaturedProductsParams
    >({
      query: ({ limit, page }) => ({
        url: `/user/favorites`,
        method: "GET",
        params: {
          limit,
          page,
        },
      }),
      providesTags: ["Products"],
    }),
    // get Related Products
    getRelatedProduct: builder.query<
      RelatedProductsResponse,
      GetRelatedProductsParams
    >({
      query: ({ productId }) => ({
        url: `/product/related-products`,
        method: "GET",
        params: {
          productId,
        },
      }),
      providesTags: ["Products"],
    }),
    // get search Products
    getSearchProduct: builder.query<
      {
        status: boolean;
        message: string;
        data: searchProduct[];
      },
      string
    >({
      query: (id) => ({
        url: `/user/search/product/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getProducts: builder.query<Product[], void>({
      query: () => ({ url: "/products", method: "GET" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products" as const, id })),
              { type: "Products" as const, id: "LIST" },
            ]
          : [{ type: "Products" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useCreateFavouriteProductMutation,
  useGetFavouriteProductQuery,
  useGetRelatedProductQuery,
  useGetSearchProductQuery,
} = productsApi;
