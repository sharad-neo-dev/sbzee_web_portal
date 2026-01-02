// components/ui/ProductImage.tsx
"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePreSignedUrl } from "@/hooks/usePreSignedUrl";

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  isPreSigned?: boolean;
}

// Memoize to prevent unnecessary re-renders
function ProductImageComponent({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  quality = 85,
  onLoad,
  onError,
  fallbackSrc = "/assets/img/placeholder.jpg",
  isPreSigned = false,
}: ProductImageProps) {
  const isS3Url = src?.includes("s3.ap-south-1.amazonaws.com");

  const { signedUrl, loading, error, refetch } = usePreSignedUrl({
    url: isS3Url || isPreSigned ? src : undefined,
    enabled: (isS3Url || isPreSigned) && !!src,
  });

  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const finalSrc = (isS3Url || isPreSigned) && signedUrl ? signedUrl : src;
  const shouldUseImgTag = isS3Url || isPreSigned;
  const showSkeleton = loading && (isS3Url || isPreSigned) && !hasError;

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Don't render anything if no src
  if (!src) {
    return (
      <div className={cn("relative overflow-hidden bg-gray-100", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full aspect-square flex items-center justify-center",
        className
      )}>
      {/* Skeleton */}
      {showSkeleton && !isLoaded && !hasError && (
        <motion.div
          className="absolute inset-0 bg-gray-200 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Error State */}
      {error || hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <span className="text-2xl mb-2">🖼️</span>
          <p className="text-xs text-gray-500">Image failed to load</p>
          {(isS3Url || isPreSigned) && (
            <div
              onClick={refetch}
              className="text-xs text-blue-600 underline mt-1 cursor-pointer">
              Retry
            </div>
          )}
        </div>
      ) : shouldUseImgTag ? (
        // Use regular img tag for pre-signed URLs
        <img
          src={finalSrc || fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "max-w-full max-h-full object-contain transition-opacity duration-300",
            loading && !isLoaded ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        // Use Next.js Image for local images
        <Image
          src={finalSrc || fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          sizes={sizes}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "object-contain transition-opacity duration-300",
            loading && !isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </div>
  );
}

// Export memoized component
export const ProductImage = memo(ProductImageComponent);
