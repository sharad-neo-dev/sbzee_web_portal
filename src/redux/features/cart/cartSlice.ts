import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CartState,
  AddToCartPayload,
  UpdateCartItemQuantityPayload,
  RemoveFromCartPayload,
  SyncCartPayload,
} from "./cart.types";

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  cartData: null,
  lastUpdated: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { id, quantity, ...productData } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          quantity,
          ...productData,
        });
      }
      state.lastUpdated = Date.now();
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<UpdateCartItemQuantityPayload>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
        state.lastUpdated = Date.now();
      }
    },

    removeFromCart: (state, action: PayloadAction<RemoveFromCartPayload>) => {
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.lastUpdated = Date.now();
    },

    clearCart: (state) => {
      state.items = [];
      state.cartData = null;
      state.lastUpdated = Date.now();
    },

    // Sync with backend data
    syncCartWithBackend: (state, action: PayloadAction<SyncCartPayload>) => {
      const { items, cartData } = action.payload;
      state.items = items;
      state.cartData = cartData;
      state.lastUpdated = Date.now();
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    initializeCart: (state) => {
      state.lastUpdated = Date.now();
    },
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  syncCartWithBackend,
  setCartLoading,
  setCartError,
  initializeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
