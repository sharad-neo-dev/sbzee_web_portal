import { baseApi } from "./baseApi";

export interface CartResponse {
  success: boolean;
  message: string;
  data?: CartData;
}

export interface CartData {
  _id: string;
  user: string;
  userBalance: number;
  products: CartProduct[];
  subTotalAmount: number;
  totalAmount: number;
  taxes: number;
  coupon: Coupon;
  isCouponApplied: boolean;
  freeDelivery: boolean;
  originalDeliveryFee: number;
  originalPlatformFee: number;
  discountedDeliveryFee: number;
  discountedPlatformFee: number;
  deliveryFee: number;
  platformFee: number;
  deliveryMessage: string;
}

export interface CartProduct {
  productId: string;
  name: string;
  thumbnail: string;
  quantity: number;
  priceId: string;
  currency: string;
  unitType: "weight" | "piece";
  unitTypeDescription: string;
  mandiPrice: number;
  unitQuantity: number;
  originalPrice: number;
  unitPrice: number;
  total: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  ActiveCount: number;
}

export interface AddToCartRequest {
  data: Array<{
    productId: string;
    price: string;
    quantity: number;
  }>;
}

export interface RemoveQtyRequest {
  productId: string;
  priceId: string;
}

export interface RemoveProductRequest {
  productId: string;
  priceId: string;
}

export const cartsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: `/order/cart`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (body) => ({
        url: `/order/cart`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeQty: builder.mutation<CartResponse, RemoveQtyRequest>({
      query: (body) => ({
        url: `/order/cart/remove-qty`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeProduct: builder.mutation<CartResponse, RemoveProductRequest>({
      query: (body) => ({
        url: `/order/cart/remove`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    emptyCart: builder.mutation<CartResponse, void>({
      query: () => ({
        url: `/order/cart/empty`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveQtyMutation,
  useRemoveProductMutation,
  useEmptyCartMutation,
} = cartsApi;
