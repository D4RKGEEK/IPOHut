"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Enforces trailing slashes on the client side for static builds.
 * When trailingSlash: true is set in next.config.js, Next.js generates
 * directory-based segments. Some hosting providers might serve both
 * /page and /page/ without a redirect. This component ensures the 
 * browser URL always reflects the slash-terminated version for SEO.
 */
export function SlashEnforcer() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Skip for root, empty paths, or files with extensions
        if (!pathname || pathname === "/" || pathname.includes(".")) {
            return;
        }

        if (!pathname.endsWith("/")) {
            // Append a slash and preserve any query parameters
            const search = typeof window !== "undefined" ? window.location.search : "";
            const hash = typeof window !== "undefined" ? window.location.hash : "";

            const target = `${pathname}/${search}${hash}`;

            // Use replace to avoid adding the non-slashed URL to history
            router.replace(target);
        }
    }, [pathname, router]);

    return null;
}
