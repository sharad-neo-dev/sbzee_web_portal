export interface CartItem {
  id: string;
  name: string;
  price: number; // per unit
  qty: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  totalQty: number;
  totalPrice: number; // sum of price * qty
}
