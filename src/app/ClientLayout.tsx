"use client";

import { usePathname } from "next/navigation";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayoutRoutes = ["/login", "/signup", "/forgot-password"];
  const shouldHideLayout = hideLayoutRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <SmoothScrollProvider>
      {!shouldHideLayout && <Header />}
      <main className={!shouldHideLayout ? "pt-18 lg:pt-22" : ""}>
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
      {!shouldHideLayout && <BackToTop />}
    </SmoothScrollProvider>
  );
}
