import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  addItem,
  removeItem,
  increaseQty,
  decreaseQty,
  updateQuantity,
  clearCart,
  setLoading,
  setSyncError,
  revertCartState,
} from "@/redux/features/cart/cartSlice";
import type { CartItem } from "@/redux/features/cart/cart.types";
import {
  useAddToCartMutation,
  useRemoveQtyMutation,
  useRemoveProductMutation,
  useEmptyCartMutation,
} from "@/redux/services/cartApi";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);

  const [addToCartApi] = useAddToCartMutation();
  const [removeQtyApi] = useRemoveQtyMutation();
  const [removeProductApi] = useRemoveProductMutation();
  const [emptyCartApi] = useEmptyCartMutation();

  const backupCartState = useCallback(
    () => ({
      items: [...cartState.items],
      totalQty: cartState.totalQty,
      totalPrice: cartState.totalPrice,
      totalSavings: cartState.totalSavings,
    }),
    [
      cartState.items,
      cartState.totalQty,
      cartState.totalPrice,
      cartState.totalSavings,
    ]
  );

  const addToCart = useCallback(
    async (item: CartItem) => {
      const backup = backupCartState();

      try {
        const existingItem = cartState.items.find(
          (i) => i.productId === item.productId && i.priceId === item.priceId
        );

        if (existingItem) {
          dispatch(increaseQty(existingItem.id));
        } else {
          dispatch(addItem(item));
        }

        const request = {
          data: [
            {
              productId: item.productId,
              price: item.priceId!,
              quantity: existingItem ? existingItem.qty + item.qty : item.qty,
            },
          ],
        };

        dispatch(setLoading(true));
        await addToCartApi(request).unwrap();
        dispatch(setSyncError(null));
      } catch (error: any) {
        console.error("Failed to add item to cart:", error);
        dispatch(revertCartState(backup));
        dispatch(
          setSyncError(error?.data?.message || "Failed to add item to cart")
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, addToCartApi, cartState.items, backupCartState]
  );

  const removeFromCart = useCallback(
    async (itemId: string, cartItem?: CartItem) => {
      const backup = backupCartState();

      try {
        dispatch(removeItem(itemId));

        if (cartItem?.productId && cartItem?.priceId) {
          dispatch(setLoading(true));
          const request = {
            productId: cartItem.productId,
            priceId: cartItem.priceId,
          };
          const result = await removeProductApi(request).unwrap();
          dispatch(setSyncError(null));
        } else {
          console.warn(
            "Cannot sync remove with backend: missing cartItem data"
          );
        }
      } catch (error: any) {
        console.error("Failed to remove item from cart:", error);
        dispatch(revertCartState(backup));
        dispatch(
          setSyncError(
            error?.data?.message || "Failed to remove item from cart"
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, removeProductApi, backupCartState]
  );

  const increaseQuantity = useCallback(
    async (itemId: string, cartItem?: CartItem) => {
      const backup = backupCartState();

      try {
        dispatch(increaseQty(itemId));

        if (cartItem?.productId && cartItem?.priceId) {
          dispatch(setLoading(true));
          const request = {
            data: [
              {
                productId: cartItem.productId,
                price: cartItem.priceId,
                quantity: 1,
              },
            ],
          };
          await addToCartApi(request).unwrap();
          dispatch(setSyncError(null));
        }
      } catch (error: any) {
        console.error("Failed to increase quantity:", error);
        dispatch(revertCartState(backup));
        dispatch(
          setSyncError(error?.data?.message || "Failed to update quantity")
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, addToCartApi, backupCartState]
  );

  const decreaseQuantity = useCallback(
    async (itemId: string, cartItem?: CartItem) => {
      const backup = backupCartState();

      try {
        const currentItem = cartState.items.find((i) => i.id === itemId);
        const currentQty = currentItem?.qty || 0;

        dispatch(decreaseQty(itemId));

        if (cartItem?.productId && cartItem?.priceId) {
          dispatch(setLoading(true));

          if (currentQty <= 1) {
            const request = {
              productId: cartItem.productId,
              priceId: cartItem.priceId,
            };
            await removeProductApi(request).unwrap();
          } else {
            const request = {
              productId: cartItem.productId,
              priceId: cartItem.priceId,
            };
            await removeQtyApi(request).unwrap();
          }

          dispatch(setSyncError(null));
        }
      } catch (error: any) {
        console.error("Failed to decrease quantity:", error);
        dispatch(revertCartState(backup));
        dispatch(
          setSyncError(error?.data?.message || "Failed to update quantity")
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, removeQtyApi, removeProductApi, cartState.items, backupCartState]
  );

  const updateItemQuantity = useCallback(
    async (itemId: string, newQty: number, cartItem?: CartItem) => {
      const backup = backupCartState();

      try {
        dispatch(updateQuantity({ id: itemId, qty: newQty }));

        if (cartItem?.productId && cartItem?.priceId) {
          dispatch(setLoading(true));

          if (newQty === 0) {
            const request = {
              productId: cartItem.productId,
              priceId: cartItem.priceId,
            };
            await removeProductApi(request).unwrap();
          } else {
            const removeRequest = {
              productId: cartItem.productId,
              priceId: cartItem.priceId,
            };
            await removeProductApi(removeRequest);

            const addRequest = {
              data: [
                {
                  productId: cartItem.productId,
                  price: cartItem.priceId,
                  quantity: newQty,
                },
              ],
            };
            await addToCartApi(addRequest).unwrap();
          }

          dispatch(setSyncError(null));
        }
      } catch (error: any) {
        console.error("Failed to update quantity:", error);
        dispatch(revertCartState(backup));
        dispatch(
          setSyncError(error?.data?.message || "Failed to update quantity")
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, addToCartApi, removeProductApi, backupCartState]
  );

  const emptyCart = useCallback(async () => {
    const backup = backupCartState();

    try {
      dispatch(clearCart());
      dispatch(setLoading(true));
      await emptyCartApi().unwrap();
      dispatch(setSyncError(null));
    } catch (error: any) {
      console.error("Failed to empty cart:", error);
      dispatch(revertCartState(backup));
      dispatch(setSyncError(error?.data?.message || "Failed to empty cart"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, emptyCartApi, backupCartState]);

  return {
    cartItems: cartState.items,
    totalQty: cartState.totalQty,
    totalPrice: cartState.totalPrice,
    totalSavings: cartState.totalSavings,
    isLoading: cartState.isLoading,
    syncError: cartState.syncError,
    lastSynced: cartState.lastSynced,

    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateItemQuantity,
    emptyCart,

    getItemById: (itemId: string) =>
      cartState.items.find((item) => item.id === itemId),
    getItemByProductAndPrice: (productId: string, priceId?: string) =>
      cartState.items.find(
        (item) =>
          item.productId === productId && (!priceId || item.priceId === priceId)
      ),
  };
};
