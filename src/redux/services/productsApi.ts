import { baseApi } from "./baseApi";

export interface Product {
  id: string;
  uniqueId: string;
  name: string;
  hindiName: string;
  description: string;
  thumbnail: string;
  category: {
    id: string;
    name: string;
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
  tags: string[];
  isInCartForAnyPrice: boolean;
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
    getProductById: builder.query<Product, string>({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
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
} = productsApi;
