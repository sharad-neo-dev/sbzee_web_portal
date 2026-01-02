import { baseApi } from "@/redux/services/baseApi";

const imageCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000;

const isCacheValid = (cached: { url: string; expiresAt: number }): boolean => {
  return Date.now() < cached.expiresAt;
};

const extractS3Url = (url: string): string => {
  try {
    if (url.includes("X-Amz-Signature")) {
      return url;
    }

    if (url.includes("s3.ap-south-1.amazonaws.com")) {
      return url;
    }

    return url;
  } catch {
    return url;
  }
};

export const getPreSignedUrl = async (imageUrl: string): Promise<string> => {
  const cleanUrl = extractS3Url(imageUrl);

  const cached = imageCache.get(cleanUrl);
  if (cached && isCacheValid(cached)) {
    return cached.url;
  }

  try {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : null;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/auth/pre-signed-url?url=${encodeURIComponent(cleanUrl)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get pre-signed URL: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data?.preSignedUrl) {
      const signedUrl = data.data.preSignedUrl;

      imageCache.set(cleanUrl, {
        url: signedUrl,
        expiresAt: Date.now() + CACHE_TTL,
      });

      return signedUrl;
    }

    console.warn("Pre-signed URL not found in response, using original URL");
    return cleanUrl;
  } catch (error) {
    console.error("Error getting pre-signed URL:", error);
    return cleanUrl;
  }
};

export const clearImageCache = (): void => {
  imageCache.clear();
};

export const preloadImages = async (urls: string[]): Promise<void> => {
  const uniqueUrls = Array.from(new Set(urls));

  await Promise.all(
    uniqueUrls.map(async (url) => {
      try {
        await getPreSignedUrl(url);
      } catch (error) {
        console.warn(`Failed to preload image: ${url}`, error);
      }
    })
  );
};
