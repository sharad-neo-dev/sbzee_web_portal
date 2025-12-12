import { baseApi } from "./baseApi";
import { setCredentials, updateToken } from "../features/auth/authSlice";
import type { User } from "../features/auth/auth.types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
          if (typeof window !== "undefined") {
            localStorage.setItem("auth", JSON.stringify(data));
          }
        } catch {}
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
          if (typeof window !== "undefined") {
            localStorage.setItem("auth", JSON.stringify(data));
          }
        } catch {}
      },
    }),
    me: builder.query<User, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
      providesTags: ["Auth"],
    }),
    refresh: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            updateToken({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );
          if (typeof window !== "undefined") {
            const raw = localStorage.getItem("auth");
            const current = raw ? JSON.parse(raw) : {};
            localStorage.setItem(
              "auth",
              JSON.stringify({ ...current, ...data })
            );
          }
        } catch {}
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useRefreshMutation,
} = authApi;
