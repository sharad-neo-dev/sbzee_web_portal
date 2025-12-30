"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useMeQuery, useRefreshMutation } from "@/redux/services/authApi";
import {
  setCredentials,
  logout,
  updateToken,
} from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    accessToken,
    refreshToken: storedRefreshToken,
  } = useSelector((state: RootState) => state.auth);

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useMeQuery(undefined, {
    skip: !accessToken || !isAuthenticated,
  });

  const [refreshTokenMutation, { isLoading: isRefreshing }] =
    useRefreshMutation();

  useEffect(() => {
    const initializeAuth = () => {
      if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth);
            if (parsedAuth.user && parsedAuth.accessToken) {
              dispatch(setCredentials(parsedAuth));
            }
          } catch (error) {
            console.error("Failed to parse stored auth:", error);
            localStorage.removeItem("auth");
          }
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (userData && accessToken) {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...parsedAuth,
            user: userData,
          })
        );
      }
    }
  }, [userData, accessToken]);

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (storedRefreshToken && !accessToken) {
        try {
          const result = await refreshTokenMutation({
            refreshToken: storedRefreshToken,
          }).unwrap();
          dispatch(
            updateToken({
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            })
          );
        } catch (error) {
          console.error("Token refresh failed:", error);
          dispatch(logout());
        }
      }
    };

    if (!accessToken && storedRefreshToken) {
      refreshAccessToken();
    }
  }, [accessToken, storedRefreshToken, dispatch, refreshTokenMutation]);

  const isLoading = isUserLoading || isRefreshing;

  return {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    userError,
  };
};
