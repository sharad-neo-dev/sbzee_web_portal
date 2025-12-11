import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCart = () => useAppSelector((state) => state.cart);
export const useAuth = () => useAppSelector((state) => state.auth);
export const useTheme = () => useAppSelector((state) => state.theme);
