"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  CircleUserRound,
  Search,
  ShoppingCart,
  Bell,
  Package,
  User,
  Settings,
  TicketPercent,
  LogOut,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { RootState } from "@/redux/store";
import { useGetSearchProductQuery } from "@/redux/services/productsApi";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/services/authApi";
import { ProductImage } from "../ui/ProductImage";
import { ProfileModal } from "../ui/profileModal";
import { toast } from "sonner";
import { ConfirmModal } from "../ui";

interface HeaderProps {
  onCartClick?: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [fade, setFade] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();

  const { items } = useAppSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedValue(searchValue.trim());
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  const { data: searchData, isFetching } = useGetSearchProductQuery(
    debouncedValue,
    {
      skip: debouncedValue.length < 2,
    }
  );

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

  const handleLogout = async () => {
    dispatch(logout());
    toast.success("Logout successfully!");
    router.push("/login");
  };

  const handleCardClick = (id: string) => {
    router.push(`/product/${id}`);
    setSearchValue("");
    setDebouncedValue("");
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    setAccountOpen(false);
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
    setAccountOpen(false);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-(--accent) shadow-md">
        {mobileDrawerOpen && (
          <>
            <div
              className={`
      fixed inset-0 bg-black/40 z-40 md:hidden
      transition-opacity duration-500
      ${
        mobileDrawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }
    `}
              onClick={() => setMobileDrawerOpen(false)}
            />

            <div
              className={`
      fixed inset-y-0 right-0 z-50 w-72 max-w-[80%] bg-white shadow-xl md:hidden
      transform transition-transform duration-300 ease-out
      ${mobileDrawerOpen ? "translate-x-0" : "translate-x-full"}
    `}>
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-semibold text-gray-800">
                  {isAuthenticated ? `Hi, ${user?.name || "User"}` : "Welcome"}
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100">
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-4">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileDrawerOpen(false)}>
                  <Package className="w-5 h-5 text-gray-500" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileDrawerOpen(false)}>
                  <Heart className="w-4 h-4 text-gray-500" />
                  Favorites
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileDrawerOpen(false)}>
                  <User className="w-5 h-5 text-gray-500" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileDrawerOpen(false)}>
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span>Settings</span>
                </Link>

                <Link
                  href="/coupons"
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setMobileDrawerOpen(false)}>
                  <TicketPercent className="w-5 h-5 text-gray-500" />
                  <span>Coupons</span>
                </Link>

                <button className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 w-full text-left">
                  <div className="relative">
                    <Bell className="w-6 h-6 text-(--accent)" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <span>Notifications</span>
                </button>

                {isAuthenticated ? (
                  <div className="border-t pt-3 mt-3">
                    <button
                      onClick={openLogoutConfirm}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full text-left">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block mt-4"
                    onClick={() => setMobileDrawerOpen(false)}>
                    <Button className="w-full bg-(--accent) text-white hover:bg-(--accent-dark)">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </>
        )}

        <nav className="container-custom px-4 lg:px-0">
          <div className="hidden md:flex items-center h-18 lg:h-22 w-full gap-8 lg:gap-10">
            <Link
              href="/"
              className="flex items-center space-x-2 mr-4 lg:mr-8 min-w-[90px]">
              <Image
                src="/assets/img/LogoWhite.png"
                alt="Sbzee Logo"
                width={100}
                height={30}
                draggable={false}
              />
              <span className="sr-only">Sbzee</span>
            </Link>
            <div className="hidden md:flex lg:hidden items-center text-(--text-white) gap-1 text-sm">
              <span>Noida</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            <div className="hidden lg:flex flex-col text-sm text-(--text-white)">
              <span className="font-black text-xl">
                Delivery Tomorrow Morning (5-8am)
              </span>
              <div className="flex items-center gap-1">
                <span>City Centre Noida</span>
                <ChevronDown className="text-(--text-white)" />
              </div>
            </div>

            <div className="flex items-center border border-white/30 rounded-md flex-1 min-w-[220px] max-w-[700px] ml-4 bg-(--bg-white)">
              <div className="pl-2 pr-1">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onFocus={() => searchValue && setShowDropdown(true)}
                  placeholder={placeholders[placeholderIndex]}
                  className={`py-3 px-2 outline-none border-none w-full text-base bg-(--bg-white) placeholder:transition-opacity placeholder:duration-300 ${
                    fade ? "placeholder:opacity-0" : "placeholder:opacity-100"
                  }`}
                />

                {/* search Dropdown */}
                {showDropdown && debouncedValue.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 z-50 max-h-72 overflow-auto">
                    {isFetching && (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Searching...
                      </div>
                    )}

                    {!isFetching && searchData?.data?.length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No products found
                      </div>
                    )}

                    {searchData?.data?.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          handleCardClick(product.id);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3">
                        <div className="relative w-10 h-10 shrink-0">
                          {/* <PreSignedImage
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                          sizes="40px"
                        /> */}
                          <ProductImage
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                            isPreSigned={true}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.category?.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label="Account menu"
                  className="flex items-center justify-center bg-(--bg-white) p-2 rounded-lg hover:scale-105 transition cursor-pointer">
                  <CircleUserRound className="w-7 h-7 text-(--accent)" />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-52 rounded-xl bg-white shadow-lg border z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountOpen(false)}>
                          <Package className="w-4 h-4 text-gray-500" />
                          My Orders
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountOpen(false)}>
                          <Heart className="w-4 h-4 text-gray-500" />
                          Favorites
                        </Link>
                      </li>

                      <li>
                        <button
                          onClick={handleProfileClick} // Updated to use handleProfileClick
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left">
                          <User className="w-4 h-4 text-gray-500" />
                          Profile
                        </button>
                      </li>

                      <li>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountOpen(false)}>
                          <Settings className="w-4 h-4 text-gray-500" />
                          Settings
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/coupons"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setAccountOpen(false)}>
                          <TicketPercent className="w-4 h-4 text-gray-500" />
                          Coupons
                        </Link>
                      </li>

                      <li className="border-t mt-1">
                        <button
                          onClick={openLogoutConfirm}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-white text-(--accent) hover:bg-white/90">
                  Login
                </Button>
              </Link>
            )}

            <button
              onClick={onCartClick}
              disabled={items.length == 0}
              className={`flex items-center bg-(--bg-white) p-2 md:p-2 lg:p-3 rounded-lg cursor-pointer ml-4 lg:ml-6 relative group ${
                items.length == 0 && "bg-gray-200"
              }`}>
              <ShoppingCart className="w-7 h-7 text-(--accent)" />
              <span className="ml-1 font-medium text-(--accent) hidden lg:inline text-sm lg:text-base whitespace-nowrap">
                My Cart
              </span>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            <div className="flex items-center bg-(--bg-white) p-2 sm:p-3 rounded-lg cursor-pointer ml-3 relative">
              <Bell className="w-7 h-7 text-(--accent)" />

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                3
              </span>
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

              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-1 rounded-full active:scale-95 transition">
                <CircleUserRound size={30} className="text-(--text-white)" />
              </button>
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

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}
