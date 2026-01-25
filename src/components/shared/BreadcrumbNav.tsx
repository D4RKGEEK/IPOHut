import Link from "next/link";
import { usePathname } from "next/navigation";

import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Route to breadcrumb mapping for auto-generation
const routeLabels: Record<string, string> = {
  "": "Home",
  "mainboard-ipo": "Mainboard IPO",
  "sme-ipo": "SME IPO",
  "ipo-gmp-today": "GMP Today",
  "ipo-allotment-status": "Allotment Status",
  "ipo-calendar": "IPO Calendar",
  "ipo-listing-performance": "Performance Tracker",
  "ipo-statistics": "IPO Statistics",
  "tools": "Tools",
  "investment-calculator": "Investment Calculator",
  "compare": "Compare IPOs",
  "returns-calculator": "Returns Calculator",
  "ipo": "IPO",
};

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const pathname = usePathname();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Generate JSON-LD schema for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: item.href ? `${baseUrl}${item.href}` : undefined,
      })),
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1" aria-label="Home">
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {items.map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbSeparator />
              {index === items.length - 1 || !item.href ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

// Helper hook to auto-generate breadcrumbs from current path
export function useBreadcrumbs(customLabel?: string): BreadcrumbItem[] {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    // Use custom label for the last item if provided
    const label = isLast && customLabel
      ? customLabel
      : routeLabels[segment] || segment.split("-").map(s =>
        s.charAt(0).toUpperCase() + s.slice(1)
      ).join(" ");

    items.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return items;
}
