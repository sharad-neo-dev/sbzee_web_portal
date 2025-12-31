"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCartFromBackend,
  setLoading,
  setSyncError,
} from "@/redux/features/cart/cartSlice";
import { useGetCartQuery } from "@/redux/services/cartApi";

export default function CartInitializer() {
  const dispatch = useDispatch();

  const { data, error, isLoading, refetch } = useGetCartQuery();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (data && data.success && data.data) {
      dispatch(setCartFromBackend(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as any)?.data?.message ||
        (error as any)?.message ||
        "Failed to load cart";

      dispatch(setSyncError(errorMessage));
    }
  }, [error, dispatch]);

  return null;
}
