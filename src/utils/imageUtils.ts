"use client";

import { store } from "@/redux/store";
import axios from "axios";

const preSignedUrlCache = new Map<string, { url: string; expiry: number }>();
let pendingRequests = new Map<string, Promise<string>>();

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const state = store.getState();
    return state.auth?.accessToken ?? null;
  } catch (error) {
    console.error("Error reading auth token from Redux store:", error);
    return null;
  }
};

export async function getPreSignedUrl(
  imageUrl: string,
  token: string | null = getToken()
): Promise<string> {
  const cached = preSignedUrlCache.get(imageUrl);
  if (cached && cached.expiry > Date.now()) {
    return cached.url;
  }

  if (pendingRequests.has(imageUrl)) {
    return pendingRequests.get(imageUrl)!;
  }
  const request = (async () => {
    try {
      const encodedUrl = encodeURIComponent(imageUrl);

      const response = await axios.get(`/api/v1/auth/pre-signed-url`, {
        params: { url: imageUrl },
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = response.data;

      if (data?.success && data?.preSignedUrl) {
        const expiry = Date.now() + 3600 * 1000;
        preSignedUrlCache.set(imageUrl, {
          url: data.preSignedUrl,
          expiry,
        });
        return data.preSignedUrl;
      }

      throw new Error("Invalid response from pre-signed URL API");
    } catch (err) {
      console.error("Error fetching pre-signed URL:", err);
      return imageUrl;
    } finally {
      pendingRequests.delete(imageUrl);
    }
  })();

  pendingRequests.set(imageUrl, request);
  return request;
}

export async function getPreSignedUrls(
  imageUrls: string[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  const urlsToFetch = imageUrls.filter((url) => {
    const cached = preSignedUrlCache.get(url);
    return !cached || cached.expiry <= Date.now();
  });

  const batchSize = 5;

  for (let i = 0; i < urlsToFetch.length; i += batchSize) {
    const batch = urlsToFetch.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (url) => {
        const preSignedUrl = await getPreSignedUrl(url);
        results.set(url, preSignedUrl);
      })
    );
  }

  // Add cached URLs
  imageUrls.forEach((url) => {
    const cached = preSignedUrlCache.get(url);
    if (cached && cached.expiry > Date.now()) {
      results.set(url, cached.url);
    }
  });

  return results;
}

export function clearImageCache(): void {
  preSignedUrlCache.clear();
  pendingRequests.clear();
}
