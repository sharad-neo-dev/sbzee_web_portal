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

// TODO: replace with your actual API base URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://dev.api.fruggies.co.in/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  let result = (await rawBaseQuery(args, api, extraOptions)) as {
    data?: unknown;
    error?: FetchBaseQueryError;
  };

  if (result.error && result.error.status === 401) {
    try {
      // attempt refresh via cookies (no body)
      const refreshResult = (await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      )) as { data?: any; error?: FetchBaseQueryError };

      if (refreshResult.data) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user,
        } = (refreshResult.data as any) ?? {};
        if (newAccessToken) {
          api.dispatch(
            updateToken({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken ?? null,
            })
          );
        }
        if (user) {
          api.dispatch(
            setCredentials({
              user,
              accessToken: newAccessToken ?? null,
              refreshToken: newRefreshToken ?? null,
            })
          );
        }

        // retry original query with new token
        result = (await rawBaseQuery(args, api, extraOptions)) as any;
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
  tagTypes: ["Auth", "Products", "Cart", "featuredProducts"],
  endpoints: () => ({}),
});
