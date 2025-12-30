"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export const useLoginRedirect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getRedirectPath = () => {
    const redirect = searchParams.get("redirect");
    return redirect || "/";
  };

  const redirectAfterLogin = () => {
    const redirectPath = getRedirectPath();
    router.push(redirectPath);
  };

  return {
    getRedirectPath,
    redirectAfterLogin,
  };
};
