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
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const { isAuthenticated, isLoading: authLoading } = useAppSelector(
    (state) => state.auth
  );
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (cartDrawerOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll position when drawer closes
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [cartDrawerOpen]);

  useEffect(() => {
    const publicPaths = ["/login", "/verify-otp"];
    const isPublicPath = publicPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (authLoading) return;

    const authData = localStorage.getItem("auth");
    const isLoggedIn = !!authData || isAuthenticated;

    if (!isLoggedIn && !isPublicPath) {
      setShouldRedirect(true);
      return;
    }

    if (isLoggedIn && isPublicPath) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
      return;
    }

    setIsCheckingAuth(false);
  }, [pathname, router, isAuthenticated, authLoading]);

  useEffect(() => {
    if (shouldRedirect) {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== "/login") {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
      }
      window.location.href = "/login";
    }
  }, [shouldRedirect]);

  const hideLayoutRoutes = ["/login", "/verify-otp"];
  const shouldHideLayout = hideLayoutRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isCheckingAuth || authLoading || shouldRedirect) {
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
