import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
