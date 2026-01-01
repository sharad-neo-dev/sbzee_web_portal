"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export function useAuthRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (authLoading) return;

    const publicPaths = ["/login", "/verify-otp"];
    const isPublicPath = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    const authData = localStorage.getItem("auth");
    const isLoggedIn = !!authData || isAuthenticated;

    if (!isLoggedIn && !isPublicPath) {
      if (pathname !== "/" && !pathname.includes("/login")) {
        sessionStorage.setItem("redirectAfterLogin", pathname);
      }
      router.push("/login");
      return;
    }

    if (isLoggedIn && isPublicPath) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }, [pathname, router, isAuthenticated, authLoading]);
}
