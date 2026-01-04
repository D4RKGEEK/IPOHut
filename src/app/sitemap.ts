import { MetadataRoute } from 'next';
import { fetchStatus } from '@/lib/api';

const BASE_URL = 'https://ipohut.in';

const STATIC_ROUTES = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/mainboard-ipo", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/sme-ipo", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/ipo-gmp-today", priority: 0.9, changeFrequency: "hourly" as const },
    { url: "/ipo-allotment-status", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/ipo-calendar", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/ipo-listing-performance", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/ipo-statistics", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/tools", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/tools/investment-calculator", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/tools/compare", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/tools/returns-calculator", priority: 0.6, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [open, upcoming, recently, closed] = await Promise.all([
        fetchStatus({ status: 'open', limit: 100 }),
        fetchStatus({ status: 'upcoming', limit: 100 }),
        fetchStatus({ status: 'recently_listed', limit: 100 }),
        fetchStatus({ status: 'closed', limit: 100 }),
    ]);

    const allIPOs = [
        ...(open.data || []),
        ...(upcoming.data || []),
        ...(recently.data || []),
        ...(closed.data || [])
    ];

    // Dedup by slug
    const uniqueSlugs = new Set();
    const ipoEntries = allIPOs
        .filter(ipo => {
            if (!ipo.slug || uniqueSlugs.has(ipo.slug)) return false;
            uniqueSlugs.add(ipo.slug);
            return true;
        })
        .flatMap(ipo => ([
            {
                url: `${BASE_URL}/ipo/${ipo.slug}`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.8,
            },
            {
                url: `${BASE_URL}/ipo/${ipo.slug}/allotment`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.7,
            }
        ]));

    const staticEntries = STATIC_ROUTES.map(route => ({
        url: `${BASE_URL}${route.url}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    return [...staticEntries, ...ipoEntries];
}
