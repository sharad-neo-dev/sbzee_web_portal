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

export function Header() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(false);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container-custom px-4 lg:px-15">
        <div className="hidden md:flex items-center h-18 lg:h-22 w-full gap-8 lg:gap-10">
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0 mr-4 lg:mr-8">
            <Image
              src="/assets/img/LogoGreen.png"
              alt="Sbzee Logo"
              width={100}
              height={30}
              draggable={false}
            />
            <span className="sr-only">AssuredPay</span>
          </Link>

          <div className="flex flex-col text-sm">
            <span className="font-black text-xl">
              Delivery Tomorrow Morning (5-8am)
            </span>
            <div className="flex items-center gap-1">
              <span>City Centre Noida</span>
              <ChevronDown />
            </div>
          </div>

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden flex-1 max-w-[700px] ml-4 relative">
            <div className="pl-2 pr-1">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholders[placeholderIndex]}
              className={`py-3 px-2 outline-none border-none w-full text-base bg-transparent placeholder:transition-opacity placeholder:duration-300 ${
                fade ? "placeholder:opacity-0" : "placeholder:opacity-100"
              }`}
            />
          </div>

          <Button className="bg-green-600 hover:scale-110 hover:bg-green-700 cursor-pointer transition-all duration-300 text-xl p-6">
            Login
          </Button>

          <div className="flex items-center bg-green-300 p-2 sm:p-3 rounded-lg cursor-pointer ml-6">
            <ShoppingCart className="w-7 h-7" />
            <span className="ml-1 text-lg font-medium">My Cart</span>
          </div>
        </div>

        <div className="flex flex-col md:hidden w-full gap-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-sm">
              <span className="font-black text-lg">
                Delivery Tomorrow Morning (5-8am)
              </span>
              <div className="flex items-center gap-1">
                <span>City Centre Noida</span>
                <ChevronDown />
              </div>
            </div>

            <CircleUserRound size={30} />
          </div>

          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
            <div className="pl-2 pr-1">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholders[placeholderIndex]}
              className={`py-3 px-2 outline-none border-none w-full text-base placeholder:transition-opacity placeholder:duration-300 ${
                fade ? "placeholder:opacity-0" : "placeholder:opacity-100"
              }`}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
