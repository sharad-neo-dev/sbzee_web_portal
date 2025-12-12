import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "./cart.types";

const calcTotals = (state: CartState) => {
  const { totalQty, totalPrice } = state.items.reduce(
    (acc, item) => {
      acc.totalQty += item.qty;
      acc.totalPrice += item.price * item.qty;
      return acc;
    },
    { totalQty: 0, totalPrice: 0 }
  );
  state.totalQty = totalQty;
  state.totalPrice = parseFloat(totalPrice.toFixed(2));
};

const initialState: CartState = {
  items: [],
  totalQty: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.items.push({ ...action.payload });
      }
      calcTotals(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      calcTotals(state);
    },
    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.qty += 1;
        calcTotals(state);
      }
    },
    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.qty = Math.max(0, item.qty - 1);
        if (item.qty === 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
        calcTotals(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      calcTotals(state);
    },
  },
});

export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
