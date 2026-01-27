import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  aspectRatio,
  className,
  width,
  height,
  priority = false,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const imageSrc = hasError ? fallback : src;
  const isFill = !width && !height;

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder/skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-muted z-10" />
      )}

      {/* Actual image */}
      <Image
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        width={width}
        height={height}
        fill={isFill}
        className={cn(
          "transition-opacity duration-300",
          isFill ? "object-cover" : "",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        sizes={isFill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
        {...(props as any)}
      />
    </div>
  );
}
