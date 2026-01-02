import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useAddToCartMutation,
  useRemoveQuantityFromCartMutation,
  useRemoveFromCartMutation,
  useEmptyCartMutation,
  useGetCartQuery,
} from "@/redux/services/cartApi";
import {
  addToCart as addToCartLocal,
  updateCartItemQuantity as updateCartItemQuantityLocal,
  removeFromCart as removeFromCartLocal,
  clearCart as clearCartLocal,
  syncCartWithBackend,
  setCartLoading,
  setCartError,
} from "@/redux/features/cart/cartSlice";
import type {
  AddToCartPayload,
  UpdateCartItemQuantityPayload,
  RemoveFromCartPayload,
} from "@/redux/features/cart/cart.types";
import type { UIProductForCart, CartProduct } from "@/types/cart.types";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, cartData, lastUpdated } = useAppSelector(
    (state) => state.cart
  );
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [addToCartApi] = useAddToCartMutation();
  const [removeQuantityApi] = useRemoveQuantityFromCartMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();
  const [emptyCartApi] = useEmptyCartMutation();

  const {
    data: cartResponse,
    refetch: refetchCart,
    isFetching,
  } = useGetCartQuery(undefined, {
    pollingInterval: items.length > 0 ? 10000 : 0,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (cartResponse?.success && cartResponse.data) {
      const backendProducts: UIProductForCart[] =
        cartResponse.data.products.map((product: CartProduct) => ({
          id: `${product.productId}-${product.priceId}`,
          productId: product.productId,
          name: product.name,
          price: product.unitPrice,
          quantity: product.quantity,
          image: product.thumbnail,
          unit: product.unitTypeDescription,
          category: "",
          priceId: product.priceId,
          unitType: product.unitType,
          thumbnail: product.thumbnail,
          currency: product.currency,
          originalPrice: product.originalPrice,
          unitPrice: product.unitPrice,
        }));

      dispatch(
        syncCartWithBackend({
          items: backendProducts,
          cartData: cartResponse.data,
        })
      );
    }
  }, [cartResponse, dispatch]);

  useEffect(() => {
    if (items.length > 0 && !syncIntervalRef.current) {
      syncIntervalRef.current = setInterval(() => {
        refetchCart();
      }, 15000);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [items.length, refetchCart]);

  // Add to cart
  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      try {
        dispatch(setCartLoading(true));

        dispatch(addToCartLocal(payload));

        const result = await addToCartApi({
          data: [
            {
              productId: payload.productId,
              price: payload.priceId || "",
              quantity: payload.quantity,
            },
          ],
        }).unwrap();

        refetchCart();

        return { success: true, data: result };
      } catch (error) {
        dispatch(removeFromCartLocal({ productId: payload.id }));
        dispatch(setCartError("Failed to add to cart"));
        console.error("Failed to add to cart:", error);
        return { success: false, error };
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, addToCartApi, refetchCart]
  );

  // Update quantity
  const updateCartItemQuantity = useCallback(
    async (payload: UpdateCartItemQuantityPayload) => {
      try {
        dispatch(setCartLoading(true));

        const currentItem = items.find((item) => item.id === payload.productId);
        if (!currentItem) throw new Error("Item not found in cart");

        const difference = payload.quantity - currentItem.quantity;

        if (difference === 0) return { success: true };

        dispatch(updateCartItemQuantityLocal(payload));

        if (difference > 0) {
          await addToCartApi({
            data: [
              {
                productId: currentItem.productId,
                price: payload.priceId || currentItem.priceId || "",
                quantity: difference,
              },
            ],
          }).unwrap();
        } else {
          for (let i = 0; i < Math.abs(difference); i++) {
            await removeQuantityApi({
              productId: currentItem.productId,
              priceId: payload.priceId || currentItem.priceId || "",
            }).unwrap();
          }
        }

        refetchCart();

        return { success: true };
      } catch (error) {
        dispatch(setCartError("Failed to update quantity"));
        console.error("Failed to update quantity:", error);
        return { success: false, error };
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, addToCartApi, removeQuantityApi, items, refetchCart]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (payload: RemoveFromCartPayload) => {
      try {
        dispatch(setCartLoading(true));

        const itemToRemove = items.find(
          (item) => item.id === payload.productId
        );
        if (!itemToRemove) throw new Error("Item not found");

        dispatch(removeFromCartLocal(payload));

        await removeFromCartApi({
          productId: itemToRemove.productId,
          priceId: payload.priceId || itemToRemove.priceId || "",
        }).unwrap();

        refetchCart();

        return { success: true };
      } catch (error) {
        dispatch(setCartError("Failed to remove from cart"));
        console.error("Failed to remove from cart:", error);
        return { success: false, error };
      } finally {
        dispatch(setCartLoading(false));
      }
    },
    [dispatch, removeFromCartApi, items, refetchCart]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      dispatch(setCartLoading(true));

      dispatch(clearCartLocal());

      await emptyCartApi().unwrap();

      refetchCart();

      return { success: true };
    } catch (error) {
      dispatch(setCartError("Failed to clear cart"));
      console.error("Failed to clear cart:", error);
      return { success: false, error };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, emptyCartApi, refetchCart]);

  // Manual sync function
  const syncCart = useCallback(async () => {
    try {
      dispatch(setCartLoading(true));
      await refetchCart();
      return { success: true };
    } catch (error) {
      dispatch(setCartError("Failed to sync cart"));
      console.error("Failed to sync cart:", error);
      return { success: false, error };
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [dispatch, refetchCart]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      totalItems,
      deliveryFee: cartData?.deliveryFee || 0,
      platformFee: cartData?.platformFee || 0,
      taxes: cartData?.taxes || 0,
      total: cartData?.totalAmount || subtotal,
    };
  }, [items, cartData]);

  return {
    items,
    cartData,
    loading: isFetching,
    error: null,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    syncCart,
    calculateTotals,
    refetchCart,
    lastUpdated,
  };
};
