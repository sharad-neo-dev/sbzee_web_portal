"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        setShouldRedirect(true);
      }

      if (!requireAuth && isAuthenticated) {
        const redirectPath =
          sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  useEffect(() => {
    if (shouldRedirect) {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== redirectTo) {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
      }
      window.location.href = redirectTo;
    }
  }, [shouldRedirect, redirectTo]);

  if (isLoading || shouldRedirect) {
    return <LoadingScreen />;
  }

  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  return null;
}
