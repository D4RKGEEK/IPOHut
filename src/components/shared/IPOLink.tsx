"use client";

import Link, { LinkProps } from "next/link";
import { useCallback, useRef } from "react";

interface IPOLinkProps extends LinkProps {
    logoUrl?: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * A wrapper around Next.js Link that pre-loads the IPO logo when the user hovers.
 * This makes the transition to the detail page feel instantaneous as the main 
 * visual asset (the logo) is already in the browser cache.
 */
export function IPOLink({ logoUrl, children, className, ...props }: IPOLinkProps) {
    const preloaded = useRef(false);

    const handleMouseEnter = useCallback(() => {
        if (logoUrl && !preloaded.current) {
            const img = new Image();
            img.src = logoUrl;
            preloaded.current = true;
        }
    }, [logoUrl]);

    return (
        <Link
            {...props}
            className={className}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleMouseEnter} // Also pre-load on touch start for mobile
        >
            {children}
        </Link>
    );
}
