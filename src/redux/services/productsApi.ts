import { baseApi } from "./baseApi";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
    getProductById: builder.query<Product, string>({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getFeaturedProducts: builder.query<
      Product[],
      { limit: number; page: number }
    >({
      query: ({ limit, page }) => ({
        url: `/user/featured-products?limit=${limit}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["featuredProducts"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
} = productsApi;
