import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "./cart.types";

export const transformCartProductToCartItem = (product: any): CartItem => ({
  id: `${product.productId}-${product.priceId}`,
  productId: product.productId,
  priceId: product.priceId,
  name: product.name,
  price: product.unitPrice,
  originalPrice: product.originalPrice,
  qty: product.quantity,
  unitTypeDescription: product.unitTypeDescription,
  image: product.thumbnail,
  unit: product.unitTypeDescription,
});

export const transformCartItemToAddRequest = (item: CartItem) => ({
  productId: item.productId,
  price: item.priceId!,
  quantity: item.qty,
});

const calcTotals = (state: CartState) => {
  const { totalQty, totalPrice, totalSavings } = state.items.reduce(
    (acc, item) => {
      acc.totalQty += item.qty;
      acc.totalPrice += item.price * item.qty;
      acc.totalSavings += (item.originalPrice - item.price) * item.qty;
      return acc;
    },
    { totalQty: 0, totalPrice: 0, totalSavings: 0 }
  );
  state.totalQty = totalQty;
  state.totalPrice = parseFloat(totalPrice.toFixed(2));
  state.totalSavings = parseFloat(totalSavings.toFixed(2));
};

interface CartStateWithSync extends CartState {
  isLoading: boolean;
  lastSynced: string | null;
  syncError: string | null;
}

const initialState: CartStateWithSync = {
  items: [],
  totalQty: 0,
  totalPrice: 0,
  totalSavings: 0,
  isLoading: false,
  lastSynced: null,
  syncError: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.priceId === action.payload.priceId
      );
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

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; qty: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.qty = Math.max(0, action.payload.qty);
        if (item.qty === 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
        calcTotals(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      calcTotals(state);
    },

    setCartFromBackend: (state, action: PayloadAction<any>) => {
      if (action.payload?.products) {
        state.items = action.payload.products.map(
          transformCartProductToCartItem
        );
        calcTotals(state);
        state.lastSynced = new Date().toISOString();
        state.syncError = null;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSyncError: (state, action: PayloadAction<string | null>) => {
      state.syncError = action.payload;
    },

    revertCartState: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.totalQty = action.payload.totalQty;
      state.totalPrice = action.payload.totalPrice;
      state.totalSavings = action.payload.totalSavings;
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQty,
  decreaseQty,
  updateQuantity,
  clearCart,
  setCartFromBackend,
  setLoading,
  setSyncError,
  revertCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
