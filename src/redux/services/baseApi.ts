import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  updateToken,
  logout,
  setCredentials,
} from "../features/auth/authSlice";
import type { RootState } from "../store";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/v1"
    : process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://dev.api.fruggies.co.in/api/v1";

// console.log("API Base URL:", BASE_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    try {
      const refreshResult = await baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken, user } = refreshResult.data as any;
        if (accessToken) {
          api.dispatch(updateToken({ accessToken, refreshToken }));
        }
        if (user) {
          api.dispatch(setCredentials({ user, accessToken, refreshToken }));
        }
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } catch {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth as any,
  tagTypes: ["Auth", "Products", "Cart", "featuredProducts", "Categories"],
  endpoints: () => ({}),
});
