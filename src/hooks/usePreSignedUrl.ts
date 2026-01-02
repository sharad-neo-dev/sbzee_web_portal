"use client";

import { useCallback, useEffect, useState } from "react";

interface UsePreSignedUrlProps {
  url?: string;
  enabled?: boolean;
}

interface CacheItem {
  signedUrl: string;
  timestamp: number;
}

const CACHE_DURATION = 55 * 60 * 1000; // 55 minutes
const CACHE_KEY = "signed_url_cache";

export function usePreSignedUrl({ url, enabled = true }: UsePreSignedUrlProps) {
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getCache = useCallback((): Record<string, CacheItem> => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }, []);

  const saveToCache = useCallback(
    (key: string, signedUrl: string) => {
      try {
        const cache = getCache();
        cache[key] = {
          signedUrl,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch (error) {
        console.warn("Failed to cache URL:", error);
      }
    },
    [getCache]
  );

  const isValidCache = useCallback((cacheItem: CacheItem): boolean => {
    if (!cacheItem) return false;
    const age = Date.now() - cacheItem.timestamp;
    return age < CACHE_DURATION;
  }, []);

  const fetchSignedUrl = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(false);

    try {
      let accessToken: string | undefined;

      if (typeof window !== "undefined") {
        const authData = localStorage.getItem("auth");
        accessToken = authData ? JSON.parse(authData)?.accessToken : undefined;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!API_URL) throw new Error("API base URL not configured");

      const response = await fetch(
        `${API_URL}/auth/pre-signed-url?url=${encodeURIComponent(url)}`,
        {
          headers: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              }
            : { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch pre-signed URL");

      const data = await response.json();

      if (data?.preSignedUrl) {
        setSignedUrl(data.preSignedUrl);
        saveToCache(url, data.preSignedUrl);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("Failed to fetch pre-signed URL:", err);
      setError(true);
      setSignedUrl("");
    } finally {
      setLoading(false);
    }
  }, [url, saveToCache]);

  useEffect(() => {
    if (!url || !enabled) {
      setSignedUrl("");
      return;
    }

    const cache = getCache();
    const cachedItem = cache[url];

    if (cachedItem && isValidCache(cachedItem)) {
      setSignedUrl(cachedItem.signedUrl);
      setLoading(false);
      setError(false);
    } else {
      fetchSignedUrl();
    }
  }, [url, enabled, fetchSignedUrl, getCache, isValidCache]);

  const clearCacheForUrl = useCallback(() => {
    if (!url) return;

    try {
      const cache = getCache();
      delete cache[url];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }, [url, getCache]);

  const refetch = useCallback(() => {
    if (url) {
      clearCacheForUrl();
      fetchSignedUrl();
    }
  }, [url, clearCacheForUrl, fetchSignedUrl]);

  return {
    signedUrl,
    loading,
    error,
    refetch,
  };
}
