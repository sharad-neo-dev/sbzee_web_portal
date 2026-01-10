import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { updateToken, logout } from "../features/auth/authSlice";
import type { RootState } from "../store";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://dev.api.fruggies.co.in/api/v1";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = refreshResult.data as any;
            if (data.success && data.data.accessToken) {
              api.dispatch(
                updateToken({
                  accessToken: data.data.accessToken.token,
                  refreshToken: data.data.refreshToken?.token,
                })
              );

              if (typeof window !== "undefined") {
                const authData = localStorage.getItem("auth");
                const current = authData ? JSON.parse(authData) : {};
                localStorage.setItem(
                  "auth",
                  JSON.stringify({
                    ...current,
                    accessToken: data.data.accessToken.token,
                    refreshToken: data.data.refreshToken?.token,
                  })
                );
              }

              result = await baseQuery(args, api, extraOptions);
            } else {
              api.dispatch(logout());
            }
          } else {
            api.dispatch(logout());
          }
        } else {
          api.dispatch(logout());
        }
      } catch (error) {
        api.dispatch(logout());
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Products",
    "Cart",
    "FeaturedProducts",
    "User",
    "Categories",
    "Favorites",
    "Notifications",
    "DeliveryAddress",
  ],
  endpoints: () => ({}),
});
