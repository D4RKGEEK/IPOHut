import { MetadataRoute } from 'next';
import { fetchIPOMetadata } from '@/lib/api';

export const dynamic = 'force-static';

const BASE_URL = 'https://ipohut.com';

const STATIC_ROUTES = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/mainboard-ipo", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/sme-ipo", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/ipo-gmp-today", priority: 1.0, changeFrequency: "always" as const }, // GMP is highest priority and changes often
    { url: "/ipo-allotment-status", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/ipo-calendar", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/ipo-listing-performance", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/ipo-statistics", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/tools", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/tools/investment-calculator", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/tools/compare", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/tools/returns-calculator", priority: 0.5, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const response = await fetchIPOMetadata();
    const allIPOs = response.data || [];

    const ipoEntries = allIPOs.map(ipo => ([
        {
            url: `${BASE_URL}/ipo/${ipo.slug}`,
            lastModified: new Date(ipo.updated_at || new Date()),
            changeFrequency: 'hourly' as const, // IPO data can update quickly with GMP/Subscription
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/ipo/${ipo.slug}/allotment`,
            lastModified: new Date(ipo.updated_at || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }
    ])).flat();

    const buildTime = new Date();

    const staticEntries = STATIC_ROUTES.map(route => ({
        url: `${BASE_URL}${route.url}`,
        lastModified: buildTime,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    return [...staticEntries, ...ipoEntries];
}
