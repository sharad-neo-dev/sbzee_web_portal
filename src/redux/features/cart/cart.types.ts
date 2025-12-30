export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // per unit
  originalPrice: number;
  qty: number;
  image?: string;
  unit: string;
  priceId?: string; // The specific price variant ID
  unitTypeDescription: string;
}

export interface CartState {
  items: CartItem[];
  totalQty: number;
  totalPrice: number; // sum of price * qty
  totalSavings: number; // sum of (originalPrice - price) * qty
}
