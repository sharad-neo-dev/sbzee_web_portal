import { baseApi } from "./baseApi";

export interface CartResponse {
  success: boolean;
  message: string;
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

export const cartsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, CartData>({
      query: () => ({
        url: `/order/cart`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
  }),
});

export const { useGetCartQuery } = cartsApi;
