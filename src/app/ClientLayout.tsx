"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import { Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/login"];

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isPublicRoute) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname || "/")}`;
      router.push(loginUrl);
    }

    if (isAuthenticated && isPublicRoute) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  if (isAuthenticated && isPublicRoute) {
    return null;
  }

  if (isPublicRoute) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
}
