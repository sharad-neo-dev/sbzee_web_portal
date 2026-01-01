"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  CircleUserRound,
  Search,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";

export function Header() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const dispatch = useAppDispatch();

  const { items, totalQty } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // console.log(items);

  const placeholders = [
    "Search spinach",
    "Search broccoli",
    "Search cabbage",
    "Search apple",
    "Search orange",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setFade(false);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-(--accent) shadow-md">
      <nav className="container-custom px-4 lg:px-15">
        <div className="hidden md:flex items-center h-18 lg:h-22 w-full gap-8 lg:gap-10">
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0 mr-4 lg:mr-8">
            <Image
              src="/assets/img/LogoWhite.png"
              alt="Sbzee Logo"
              width={100}
              height={30}
              draggable={false}
            />
            <span className="sr-only">Sbzee</span>
          </Link>

          <div className="flex flex-col text-sm text-(--text-white)">
            <span className="font-black text-xl">
              Delivery Tomorrow Morning (5-8am)
            </span>
            <div className="flex items-center gap-1">
              <span>City Centre Noida</span>
              <ChevronDown className="text-(--text-white)" />
            </div>
          </div>

          <div className="flex items-center border border-white/30 rounded-md overflow-hidden flex-1 max-w-[700px] ml-4 relative bg-(--bg-white)">
            <div className="pl-2 pr-1">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholders[placeholderIndex]}
              className={`py-3 px-2 outline-none border-none w-full text-base bg-(--bg-white) placeholder:transition-opacity placeholder:duration-300 ${
                fade ? "placeholder:opacity-0" : "placeholder:opacity-100"
              }`}
            />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Hi, {user?.name}</span>
              <Button
                onClick={handleLogout}
                className="bg-white text-(--accent) hover:bg-white/90">
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-white text-(--accent) hover:bg-white/90 hover:scale-110 cursor-pointer transition-all duration-300 text-xl p-6">
                Login
              </Button>
            </Link>
          )}

          <div className="flex items-center bg-(--bg-white) p-2 sm:p-3 rounded-lg cursor-pointer ml-6 relative">
            <ShoppingCart className="w-7 h-7 text-(--accent)" />
            <span className="ml-1 text-lg font-medium text-(--accent)">
              My Cart
            </span>
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col md:hidden w-full gap-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-sm text-(--text-white)">
              <span className="font-black text-lg">
                Delivery Tomorrow Morning (5-8am)
              </span>
              <div className="flex items-center gap-1">
                <span>City Centre Noida</span>
                <ChevronDown className="text-(--text-white)" />
              </div>
            </div>

            <CircleUserRound size={30} className="text-(--text-white)" />
          </div>

          <div className="flex items-center border border-white/30 rounded-md overflow-hidden w-full bg-(--bg-white)">
            <div className="pl-2 pr-1">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholders[placeholderIndex]}
              className={`py-3 px-2 outline-none border-none w-full text-base bg-(--bg-white) placeholder:transition-opacity placeholder:duration-300 ${
                fade ? "placeholder:opacity-0" : "placeholder:opacity-100"
              }`}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
