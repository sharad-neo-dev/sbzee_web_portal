import { baseApi } from "./baseApi";
import {
  setCredentials,
  updateToken,
  logout,
} from "../features/auth/authSlice";
import type { User } from "../features/auth/auth.types";

interface SendOtpRequest {
  phone: string;
}

interface SendOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      uniqueId: string;
      phone: string;
      name: string;
      email: string;
      isPhoneVerified: boolean;
    };
  };
}

interface VerifyOtpRequest {
  otp: string;
  type: string;
  userId: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/user/verify-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const user: User = {
              id: data.data.user.id,
              name: data.data.user.name || "",
              email: data.data.user.email || "",
              phone: data.data.user.phone,
            };

            dispatch(
              setCredentials({
                user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );

            if (typeof window !== "undefined") {
              localStorage.setItem(
                "auth",
                JSON.stringify({
                  user,
                  accessToken: data.data.accessToken,
                  refreshToken: data.data.refreshToken,
                })
              );
            }
          }
        } catch {}
      },
    }),

    login: builder.mutation<AuthResponse, { email: string; password: string }>({
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

    register: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
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
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useRefreshMutation,
} = authApi;
