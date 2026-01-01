import { WebStorage } from "redux-persist";

const createNoopStorage = (): WebStorage => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

export const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  version: 1,
  migrate: (state: any) => {
    return Promise.resolve(state);
  },
};

export const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "accessToken", "refreshToken"],
};
