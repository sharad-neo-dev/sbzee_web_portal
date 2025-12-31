"use client";

import Image from "next/image";
import { usePreSignedImage } from "@/hooks/usePreSignedImage";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PreSignedImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function PreSignedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
}: PreSignedImageProps) {
  const { preSignedUrl, isLoading, error } = usePreSignedImage(src);
  const [imgError, setImgError] = useState(false);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div
        className={cn(
          "bg-gray-200 animate-pulse",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={
          !fill && width && height
            ? { width: `${width}px`, height: `${height}px` }
            : undefined
        }
      />
    );
  }

  // Show error or fallback
  if (error || !preSignedUrl || imgError) {
    return (
      <div
        className={cn(
          "bg-gray-100 flex items-center justify-center",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={
          !fill && width && height
            ? { width: `${width}px`, height: `${height}px` }
            : undefined
        }>
        <div className="text-gray-400 text-xs text-center p-2">
          {error ? "Error loading image" : "Image not available"}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={preSignedUrl}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => setImgError(true)}
      unoptimized={true}
    />
  );
}
