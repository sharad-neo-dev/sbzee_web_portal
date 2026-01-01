"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CartProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function CartProductImage({
  src,
  alt,
  fill = false,
  className,
  width,
  height,
  priority = false,
}: CartProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Check if it's a pre-signed S3 URL
  const isPreSigned = src.includes("s3.amazonaws.com");

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // For pre-signed URLs, we need to bypass Next.js optimization
  if (isPreSigned) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <img
          src={src}
          alt={alt}
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleLoad}
          onError={handleError}
          style={fill ? { width: "100%", height: "100%" } : { width, height }}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        {error && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Image failed to load</span>
          </div>
        )}
      </div>
    );
  }

  // For regular images, use Next.js Image
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        onLoadingComplete={handleLoad}
        onError={handleError}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 100}
      height={height || 100}
      className={cn("object-cover", className)}
      onLoadingComplete={handleLoad}
      onError={handleError}
      priority={priority}
    />
  );
}
