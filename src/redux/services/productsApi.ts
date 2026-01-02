import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  Category,
  FeaturedProductsResponse,
  ProductListResponse,
  SingleProductResponse,
  RelatedProductsResponse,
  FavoritesResponse,
  PaginationParams,
  CategoryProductsParams,
  FeaturedProductsParams,
  ApiProduct,
} from "@/types/products.types";

const normalizeProduct = (product: any): ApiProduct => {
  return {
    ...product,
    prices: product.price || product.prices || [],
  };
};

export const productsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get Featured Products
    getFeaturedProducts: builder.query<
      ApiResponse<FeaturedProductsResponse>,
      FeaturedProductsParams
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/user/featured-products",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["FeaturedProducts"],
      keepUnusedDataFor: 300,
    }),

    // Get Categories
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: "/user/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
      keepUnusedDataFor: 600,
    }),

    // Get Products by Category
    getProductsByCategory: builder.query<
      ApiResponse<ProductListResponse>,
      CategoryProductsParams
    >({
      query: ({ categoryId, page = 1, limit = 10 }) => {
        const params: any = { limit, page };
        if (categoryId && categoryId !== "all") {
          params.categoryId = categoryId;
        }
        return { url: "/product/products-by-category", method: "GET", params };
      },
      providesTags: (result, error, { categoryId }) => [
        { type: "Products", id: categoryId || "all" },
        { type: "Products", id: "CATEGORY" },
      ],
    }),

    // Get Single Product Details
    getProductById: builder.query<ApiResponse<SingleProductResponse>, string>({
      query: (productId) => ({
        url: `/user/product/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: "Products", id: productId },
      ],
    }),

    // Get Related Products
    getRelatedProducts: builder.query<
      ApiResponse<RelatedProductsResponse>,
      string
    >({
      query: (productId) => ({
        url: "/product/related-products",
        method: "GET",
        params: { productId },
      }),
      providesTags: (result, error, productId) => [
        { type: "Products", id: `related-${productId}` },
      ],
    }),

    // Get Favorites
    getFavorites: builder.query<
      ApiResponse<FavoritesResponse>,
      PaginationParams
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/user/favorites",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: ApiResponse<FavoritesResponse>) => {
        if (response.data?.products) {
          return {
            ...response,
            data: {
              ...response.data,
              products: response.data.products.map(normalizeProduct),
            },
          };
        }
        return response;
      },
      providesTags: ["Favorites"],
    }),

    // Toggle Favorite
    toggleFavorite: builder.mutation<
      ApiResponse<{ isFavourite: boolean }>,
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `/user/favorites/toggle/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { productId }) => [
        "Favorites",
        { type: "Products", id: productId },
        "FeaturedProducts",
        { type: "Products", id: "CATEGORY" },
      ],
    }),

    // Search Products
    getSearchProduct: builder.query<ApiResponse<ApiProduct[]>, string>({
      query: (searchTerm) => ({
        url: `/user/search/product/${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ApiProduct[]>) => {
        if (response.data) {
          return {
            ...response,
            data: response.data.map(normalizeProduct),
          };
        }
        return response;
      },
      providesTags: (result, error, searchTerm) => [
        { type: "Products", id: `search-${searchTerm}` },
      ],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useGetSearchProductQuery,
} = productsApi;
