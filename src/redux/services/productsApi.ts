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
} from "@/types/products.types";

export const productsApi = baseApi.injectEndpoints({
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
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get Categories
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: "/user/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
      // Cache for 10 minutes
      keepUnusedDataFor: 600,
    }),

    // Get Products by Category
    getProductsByCategory: builder.query<
      ApiResponse<ProductListResponse>,
      CategoryProductsParams
    >({
      query: ({ categoryId, page = 1, limit = 10 }) => ({
        url: "/product/products-by-category",
        method: "GET",
        params: { categoryId, page, limit },
      }),
      providesTags: (result, error, { categoryId }) => [
        { type: "Products", id: categoryId },
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
      providesTags: ["Favorites"],
    }),

    // Toggle Favorite
    toggleFavorite: builder.mutation<
      ApiResponse<{ isFavourite: boolean }>,
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `/user/toggle-favorite/${productId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { productId }) => [
        "Favorites",
        { type: "Products", id: productId },
        "FeaturedProducts",
      ],
      // Optimistic update
      async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          productsApi.util.updateQueryData(
            "getFavorites",
            { page: 1, limit: 10 },
            (draft) => {
              if (draft?.data?.products) {
                const product = draft.data.products.find(
                  (p) => p.id === productId
                );
                if (product) {
                  product.isFavourite = !product.isFavourite;
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
} = productsApi;
