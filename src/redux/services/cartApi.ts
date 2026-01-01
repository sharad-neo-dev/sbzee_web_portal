import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  CartData,
  CartUpdateResponse,
  AddToCartRequest,
  RemoveFromCartRequest,
} from "@/types/cart.types";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Cart
    getCart: builder.query<ApiResponse<CartData>, void>({
      query: () => ({
        url: "/order/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
      // Cache for 2 minutes
      keepUnusedDataFor: 120,
      transformResponse: (response: ApiResponse<CartData>) => {
        // Ensure products array exists
        if (!response.data?.products) {
          response.data.products = [];
        }
        return response;
      },
    }),

    // Add Products to Cart
    addToCart: builder.mutation<
      ApiResponse<CartUpdateResponse>,
      AddToCartRequest
    >({
      query: (body) => ({
        url: "/order/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Optimistically update the cart
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              if (draft.data) {
                // We'll update the cart with the new response
                // The actual update will come from the getCart query invalidation
                return draft;
              }
            })
          );
        } catch (error) {
          // Error will be handled by the mutation
        }
      },
    }),

    // Remove Quantity from Cart (Decrease quantity by 1)
    removeQuantityFromCart: builder.mutation<
      ApiResponse<CartUpdateResponse>,
      RemoveFromCartRequest
    >({
      query: (body) => ({
        url: "/order/cart/remove-qty",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove Product from Cart (Remove completely)
    removeFromCart: builder.mutation<
      ApiResponse<CartUpdateResponse>,
      RemoveFromCartRequest
    >({
      query: (body) => ({
        url: "/order/cart/remove",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Empty Cart
    emptyCart: builder.mutation<ApiResponse<CartUpdateResponse>, void>({
      query: () => ({
        url: "/order/cart/empty",
        method: "PATCH",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveQuantityFromCartMutation,
  useRemoveFromCartMutation,
  useEmptyCartMutation,
} = cartApi;
