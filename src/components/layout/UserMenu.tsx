"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User, ShoppingBag, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/features/auth/authSlice";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
    setIsOpen(false);
  };

  const handleProfile = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  const handleOrders = () => {
    router.push("/orders");
    setIsOpen(false);
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push("/login")}
        className="border-green-500 text-green-600 hover:bg-green-50">
        Login
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 font-semibold">
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase() ||
              user.phone?.charAt(0) ||
              "U"}
          </span>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
            <div className="px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name || "User"}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user.email || user.phone}
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-200 my-2" />

            <button
              onClick={handleProfile}
              className="w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-100">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={handleOrders}
              className="w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-100">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </button>

            <div className="h-px bg-gray-200 my-2" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
