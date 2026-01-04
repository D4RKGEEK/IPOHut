import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useOpenIPOs, useUpcomingIPOs, useRecentlyListedIPOs, useClosedIPOs } from "@/hooks/useIPO";

// Static routes with their priorities and change frequencies
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/mainboard-ipo", priority: "0.9", changefreq: "daily" },
  { path: "/sme-ipo", priority: "0.9", changefreq: "daily" },
  { path: "/ipo-gmp-today", priority: "0.9", changefreq: "hourly" },
  { path: "/ipo-allotment-status", priority: "0.8", changefreq: "daily" },
  { path: "/ipo-calendar", priority: "0.8", changefreq: "daily" },
  { path: "/ipo-listing-performance", priority: "0.8", changefreq: "daily" },
  { path: "/ipo-statistics", priority: "0.7", changefreq: "weekly" },
  { path: "/tools", priority: "0.7", changefreq: "weekly" },
  { path: "/tools/investment-calculator", priority: "0.6", changefreq: "monthly" },
  { path: "/tools/compare", priority: "0.6", changefreq: "monthly" },
  { path: "/tools/returns-calculator", priority: "0.6", changefreq: "monthly" },
];

export default function SitemapPage() {
  const { settings } = useAdmin();
  const { data: openIPOs } = useOpenIPOs();
  const { data: upcomingIPOs } = useUpcomingIPOs();
  const { data: recentlyListedIPOs } = useRecentlyListedIPOs();
  const { data: closedIPOs } = useClosedIPOs(100);
  const [sitemapXml, setSitemapXml] = useState<string>("");

  const baseUrl = settings.site.sitemapConfig?.baseUrl || "https://ipohut.in";

  useEffect(() => {
    // Collect all IPO slugs
    const ipoSlugs = new Set<string>();
    
    openIPOs?.data?.forEach(ipo => {
      if (ipo.slug) ipoSlugs.add(ipo.slug);
    });
    
    upcomingIPOs?.data?.forEach(ipo => {
      if (ipo.slug) ipoSlugs.add(ipo.slug);
    });
    
    recentlyListedIPOs?.data?.forEach(ipo => {
      if (ipo.slug) ipoSlugs.add(ipo.slug);
    });

    closedIPOs?.data?.forEach(ipo => {
      if (ipo.slug) ipoSlugs.add(ipo.slug);
    });

    // Generate sitemap XML
    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static routes
    STATIC_ROUTES.forEach(route => {
      xml += `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    });

    // Add IPO detail pages
    ipoSlugs.forEach(slug => {
      xml += `  <url>
    <loc>${baseUrl}/ipo/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
      // Add allotment page for each IPO
      xml += `  <url>
    <loc>${baseUrl}/ipo/${slug}/allotment</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    xml += `</urlset>`;
    
    setSitemapXml(xml);
  }, [openIPOs, upcomingIPOs, recentlyListedIPOs, closedIPOs, baseUrl]);

  // Render as plain text (browsers will display XML)
  useEffect(() => {
    if (sitemapXml) {
      document.body.innerHTML = `<pre style="word-wrap: break-word; white-space: pre-wrap;">${sitemapXml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    }
    return () => {
      // Cleanup handled by React
    };
  }, [sitemapXml]);

  return null;
}
