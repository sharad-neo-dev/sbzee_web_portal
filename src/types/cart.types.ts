export interface CartProduct {
  productId: string;
  priceId: string;
  name: string;
  thumbnail: string;
  quantity: number;
  currency: string;
  unitType: "weight" | "piece" | "pack";
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CartItem {
  product: string;
  price: string;
  quantity: number;
}

export interface CartUpdateResponse {
  user: string;
  products: CartItem[];
  coupon: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface AddToCartRequest {
  data: {
    productId: string;
    price: string; // priceId
    quantity: number;
  }[];
}

export interface RemoveFromCartRequest {
  productId: string;
  priceId: string;
}

export interface UIProductForCart {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  category: string;
  priceId?: string;
  unitType?: string;
  thumbnail?: string;
  currency?: string;
  originalPrice?: number;
  unitPrice?: number;
}

export interface CartState {
  items: UIProductForCart[];
  loading: boolean;
  error: string | null;
  cartData: CartData | null;
  lastUpdated: number | null;
}
