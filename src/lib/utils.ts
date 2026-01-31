import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Optimizes an image URL using the Weserv image proxy.
 * Returns the optimized URL with WebP format and specified dimensions.
 */
export function getOptimizedSrc(src: string, width: number = 200, height?: number): string {
  if (!src || src.startsWith('/') || src.startsWith('data:') || src.includes('weserv.nl')) {
    return src;
  }

  const widthParam = `&w=${width}`;
  const heightParam = height ? `&h=${height}&fit=cover` : '';
  return `https://images.weserv.nl/?url=${encodeURIComponent(src)}${widthParam}${heightParam}&output=webp&q=80`;
}
