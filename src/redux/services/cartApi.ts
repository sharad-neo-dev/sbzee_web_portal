import { RootState } from "../store";
import { baseApi } from "./baseApi";
import type {
  ApiResponse,
  CartData,
  CartUpdateResponse,
  AddToCartRequest,
  RemoveFromCartRequest,
} from "@/types/cart.types";

const createEmptyCartResponse = (): ApiResponse<CartData> => ({
  success: true,
  message: "User not authenticated",
  data: {
    _id: "",
    user: "",
    userBalance: 0,
    products: [],
    subTotalAmount: 0,
    totalAmount: 0,
    taxes: 0,
    coupon: {
      id: "",
      code: "",
      discount: 0,
      ActiveCount: 0,
    },
    isCouponApplied: false,
    freeDelivery: false,
    originalDeliveryFee: 0,
    originalPlatformFee: 0,
    discountedDeliveryFee: 0,
    discountedPlatformFee: 0,
    deliveryFee: 0,
    platformFee: 0,
    deliveryMessage: "",
  },
});
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Cart
    getCart: builder.query<ApiResponse<CartData>, void>({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const accessToken = state.auth.accessToken;

        // If no access token, return empty cart without API call
        if (!accessToken) {
          return { data: createEmptyCartResponse() };
        }

        // If authenticated, make the API call
        try {
          const result = await baseQuery({
            url: "/order/cart",
            method: "GET",
          });

          if (result.error) {
            // Handle 401 errors
            if (result.error.status === 401) {
              return { data: createEmptyCartResponse() };
            }
            return { error: result.error };
          }

          // Transform the response to ensure products array exists
          const response = result.data as ApiResponse<CartData>;
          if (response.data && !response.data.products) {
            response.data.products = [];
          }
          return { data: response };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch cart",
            } as any,
          };
        }
      },
      providesTags: ["Cart"],
      keepUnusedDataFor: 30,
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
