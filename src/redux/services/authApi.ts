import { baseApi } from "./baseApi";
import {
  setCredentials,
  updateToken,
  sendOtpSuccess,
  verifyOtpSuccess,
  logout,
} from "../features/auth/authSlice";
import type {
  AuthResponse,
  LoginRequest,
  VerifyOtpRequest,
  User,
  AuthTokens,
} from "../features/auth/auth.types";

const saveAuthToStorage = (user: User, tokens: AuthTokens) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user,
        accessToken: tokens.accessToken.token,
        refreshToken: tokens.refreshToken.token,
      })
    );
  }
};

const removeAuthFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth");
  }
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send OTP for login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(sendOtpSuccess({ user: data.data.user }));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Verify OTP
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/user/verify-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data.accessToken && data.data.refreshToken) {
            const tokens: AuthTokens = {
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            };
            dispatch(verifyOtpSuccess({ user: data.data.user, tokens }));
            saveAuthToStorage(data.data.user, tokens);
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Get current user (me)
    me: builder.query<{ success: boolean; data: { user: User } }, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            if (typeof window !== "undefined") {
              const authData = localStorage.getItem("auth");
              if (authData) {
                const { accessToken, refreshToken } = JSON.parse(authData);
                dispatch(
                  setCredentials({
                    user: data.data.user,
                    accessToken,
                    refreshToken,
                  })
                );
              }
            }
          }
        } catch (error) {
          dispatch(logout());
          removeAuthFromStorage();
        }
      },
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          removeAuthFromStorage();
        }
      },
    }),

    // Refresh token
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data.accessToken && data.data.refreshToken) {
            const tokens: AuthTokens = {
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            };
            dispatch(
              updateToken({
                accessToken: tokens.accessToken.token,
                refreshToken: tokens.refreshToken.token,
              })
            );

            if (typeof window !== "undefined") {
              const raw = localStorage.getItem("auth");
              const current = raw ? JSON.parse(raw) : {};
              localStorage.setItem(
                "auth",
                JSON.stringify({
                  ...current,
                  accessToken: tokens.accessToken.token,
                  refreshToken: tokens.refreshToken.token,
                })
              );
            }
          }
        } catch (error) {
          dispatch(logout());
          removeAuthFromStorage();
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOtpMutation,
  useMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;
