import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;
}

export function LazyImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  aspectRatio,
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={imgRef as any}
      className={cn("relative overflow-hidden bg-muted", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder/skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
    </div>
  );
}
