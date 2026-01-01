"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );
  const { items } = useAppSelector((state) => state.cart);

  // Check auth and redirect if needed
  useEffect(() => {
    // Skip check for public pages that don't need auth
    const publicPaths = ["/login", "/verify-otp"];
    const isPublicPath = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    // If we're still loading auth state, wait
    if (authLoading) return;

    const checkAuth = () => {
      const authData = localStorage.getItem("auth");
      const isLoggedIn = !!authData || isAuthenticated;

      // If NOT logged in AND trying to access protected page (not public)
      if (!isLoggedIn && !isPublicPath) {
        // Store current path for redirect after login
        if (pathname !== "/" && !pathname.includes("/login")) {
          sessionStorage.setItem("redirectAfterLogin", pathname);
        }
        router.push("/login");
        return;
      }

      // If IS logged in AND trying to access auth pages (login/verify-otp)
      if (isLoggedIn && isPublicPath) {
        const redirectPath =
          sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
        return;
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [pathname, router, isAuthenticated, authLoading]);

  // Hide layout for auth pages
  const hideLayoutRoutes = ["/login", "/verify-otp"];
  const shouldHideLayout = hideLayoutRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Show loading while checking auth
  if (isCheckingAuth || authLoading) {
    return <LoadingScreen />;
  }

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col">
        {!shouldHideLayout && (
          <Header onCartClick={() => setCartDrawerOpen(true)} />
        )}
        <main
          className={!shouldHideLayout ? "pt-18 lg:pt-22 flex-1" : "flex-1"}>
          {children}
        </main>
        {!shouldHideLayout && <Footer />}
        {!shouldHideLayout && <BackToTop />}

        {/* Cart Components */}
        {!shouldHideLayout && items.length > 0 && (
          <FloatingCart onViewCart={() => setCartDrawerOpen(true)} />
        )}

        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
        />
      </div>
    </SmoothScrollProvider>
  );
}
