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
      keepUnusedDataFor: 30,
      transformResponse: (response: ApiResponse<CartData>) => {
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
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              if (draft.data) {
                return draft;
              }
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),

    // Remove Quantity from Cart
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

    // Remove Product from Cart
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
