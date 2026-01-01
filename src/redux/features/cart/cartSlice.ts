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
    // Local cart operations (optimistic updates)
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
          // Remove item if quantity is 0 or negative
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

    // Initialize cart from localStorage or session
    initializeCart: (state) => {
      // You can add logic here to load cart from localStorage if needed
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
