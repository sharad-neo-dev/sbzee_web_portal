"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const imageCache = new Map<string, string>();

export const usePreSignedImage = (imageUrl?: string) => {
  const [preSignedUrl, setPreSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  Get token from Redux auth slice
  const accessToken = useSelector((state: any) => state.auth.accessToken);

  useEffect(() => {
    if (!imageUrl) {
      setPreSignedUrl(null);
      return;
    }

    const cached = imageCache.get(imageUrl);
    if (cached) {
      setPreSignedUrl(cached);
      return;
    }

    const fetchPreSignedUrl = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const encodedUrl = encodeURIComponent(imageUrl);

        const response = await axios.get(`/api/v1/auth/pre-signed-url`, {
          params: { url: imageUrl },
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && {
              Authorization: `Bearer ${accessToken}`,
            }),
          },
        });

        const data = response.data;

        if (data?.success && data?.preSignedUrl) {
          imageCache.set(imageUrl, data.preSignedUrl);
          setPreSignedUrl(data.preSignedUrl);
        } else {
          throw new Error("Invalid response from pre-signed URL API");
        }
      } catch (err: any) {
        console.error("Error fetching pre-signed URL:", err);
        setError(err?.message ?? "Failed to load image");
        setPreSignedUrl(imageUrl);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreSignedUrl();
  }, [imageUrl, accessToken]);

  return { preSignedUrl, isLoading, error };
};
