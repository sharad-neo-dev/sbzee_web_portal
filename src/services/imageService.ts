import { baseApi } from "@/redux/services/baseApi";

// Cache for pre-signed URLs (5 minutes TTL)
const imageCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Check if cached URL is still valid
const isCacheValid = (cached: { url: string; expiresAt: number }): boolean => {
  return Date.now() < cached.expiresAt;
};

// Extract S3 URL from various formats
const extractS3Url = (url: string): string => {
  try {
    // Handle already pre-signed URLs
    if (url.includes("X-Amz-Signature")) {
      return url;
    }

    // Handle regular S3 URLs
    if (url.includes("s3.ap-south-1.amazonaws.com")) {
      return url;
    }

    return url;
  } catch {
    return url;
  }
};

// Get pre-signed URL from backend
// Get pre-signed URL from backend
export const getPreSignedUrl = async (imageUrl: string): Promise<string> => {
  const cleanUrl = extractS3Url(imageUrl);

  // Check cache first
  const cached = imageCache.get(cleanUrl);
  if (cached && isCacheValid(cached)) {
    return cached.url;
  }

  try {
    // Get auth token
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : null;

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Call your backend pre-signed URL API
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

      // Cache the URL
      imageCache.set(cleanUrl, {
        url: signedUrl,
        expiresAt: Date.now() + CACHE_TTL,
      });

      return signedUrl;
    }

    // Fallback to original URL
    console.warn("Pre-signed URL not found in response, using original URL");
    return cleanUrl;
  } catch (error) {
    console.error("Error getting pre-signed URL:", error);
    return cleanUrl; // Fallback to original URL
  }
};

// Clear cache (useful on logout or when tokens change)
export const clearImageCache = (): void => {
  imageCache.clear();
};

// Preload multiple images
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
