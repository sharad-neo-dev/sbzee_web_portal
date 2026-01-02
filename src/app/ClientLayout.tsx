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

  useEffect(() => {
    const publicPaths = ["/login", "/verify-otp"];
    const isPublicPath = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (authLoading) return;

    const checkAuth = () => {
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

  const hideLayoutRoutes = ["/login", "/verify-otp"];
  const shouldHideLayout = hideLayoutRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

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
