"use client";

import { useEffect } from "react";
import { getPreSignedUrl } from "@/services/imageService";

export function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    if (imageUrls.length === 0) return;

    // Preload images
    imageUrls.forEach((url) => {
      if (url.includes("s3.ap-south-1.amazonaws.com")) {
        getPreSignedUrl(url).catch(console.error);
      }
    });
  }, [imageUrls]);
}
