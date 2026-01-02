import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useAddToCartMutation,
  useRemoveQuantityFromCartMutation,
  useRemoveFromCartMutation,
  useEmptyCartMutation,
} from "@/redux/services/cartApi";
import {
  addToCart as addToCartLocal,
  updateCartItemQuantity as updateCartItemQuantityLocal,
  removeFromCart as removeFromCartLocal,
  clearCart as clearCartLocal,
  syncCartWithBackend,
} from "@/redux/features/cart/cartSlice";
import type {
  AddToCartPayload,
  UpdateCartItemQuantityPayload,
  RemoveFromCartPayload,
} from "@/redux/features/cart/cart.types";
import type { UIProductForCart } from "@/types/cart.types";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { items, cartData } = useAppSelector((state) => state.cart);

  const [addToCartApi] = useAddToCartMutation();
  const [removeQuantityApi] = useRemoveQuantityFromCartMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();
  const [emptyCartApi] = useEmptyCartMutation();

  // Add to cart
  const addToCart = useCallback(
    async (payload: AddToCartPayload) => {
      try {
        dispatch(addToCartLocal(payload));

        await addToCartApi({
          data: [
            {
              productId: payload.id,
              price: payload.priceId || "",
              quantity: payload.quantity,
            },
          ],
        }).unwrap();

        return { success: true };
      } catch (error) {
        dispatch(removeFromCartLocal({ productId: payload.id }));
        console.error("Failed to add to cart:", error);
        return { success: false, error };
      }
    },
    [dispatch, addToCartApi]
  );

  // Update quantity
  const updateCartItemQuantity = useCallback(
    async (payload: UpdateCartItemQuantityPayload) => {
      try {
        const currentItem = items.find((item) => item.id === payload.productId);
        if (!currentItem) throw new Error("Item not found in cart");

        const difference = payload.quantity - currentItem.quantity;

        if (difference === 0) return { success: true };

        dispatch(updateCartItemQuantityLocal(payload));

        if (difference > 0) {
          await addToCartApi({
            data: [
              {
                productId: payload.productId,
                price: payload.priceId || currentItem.priceId || "",
                quantity: difference,
              },
            ],
          }).unwrap();
        } else {
          for (let i = 0; i < Math.abs(difference); i++) {
            await removeQuantityApi({
              productId: payload.productId,
              priceId: payload.priceId || currentItem.priceId || "",
            }).unwrap();
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to update quantity:", error);
        return { success: false, error };
      }
    },
    [dispatch, addToCartApi, removeQuantityApi, items]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (payload: RemoveFromCartPayload) => {
      try {
        dispatch(removeFromCartLocal(payload));

        await removeFromCartApi({
          productId: payload.productId,
          priceId: payload.priceId || "",
        }).unwrap();

        return { success: true };
      } catch (error) {
        console.error("Failed to remove from cart:", error);
        return { success: false, error };
      }
    },
    [dispatch, removeFromCartApi]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      dispatch(clearCartLocal());

      await emptyCartApi().unwrap();

      return { success: true };
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return { success: false, error };
    }
  }, [dispatch, emptyCartApi]);

  // Sync local cart with backend
  const syncCart = useCallback(
    (backendItems: UIProductForCart[], backendCartData: any) => {
      dispatch(
        syncCartWithBackend({ items: backendItems, cartData: backendCartData })
      );
    },
    [dispatch]
  );

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
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    syncCart,
    calculateTotals,
  };
};
