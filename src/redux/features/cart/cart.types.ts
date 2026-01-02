import { UIProductForCart } from "@/types/cart.types";

export interface AddToCartPayload {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  category: string;
  priceId?: string;
  unitType?: string;
}

export interface UpdateCartItemQuantityPayload {
  productId: string;
  quantity: number;
  priceId?: string;
}

export interface RemoveFromCartPayload {
  productId: string;
  priceId?: string;
}

export interface CartState {
  items: UIProductForCart[];
  loading: boolean;
  error: string | null;
  cartData: any | null;
  lastUpdated: number | null;
}

export interface SyncCartPayload {
  items: UIProductForCart[];
  cartData: any;
}
