import HomePage from "@/views/HomePage";
import { fetchStatus, fetchGains, fetchNews } from "@/lib/api";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 3 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const { title, description } = settings.pages.home;
    const url = "https://ipohut.com";

    return {
        title: title || "IPOHut - Latest IPO GMP & Status",
        description: description || "Track latest IPO GMP, Subscription Status, and Allotment.",
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: title,
            description: description,
            url: url,
            type: "website",
            images: [
                {
                    url: settings.site.defaultSeo.ogImage || "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: settings.site.branding.siteName,
                }
            ],
        },
    };
}

export default async function Home() {
    const [openIPOs, upcomingIPOs, recentlyListed, gainersData, losersData, newsData] = await Promise.all([
        fetchStatus({ status: 'open', limit: 6 }),
        fetchStatus({ status: 'upcoming', limit: 5 }),
        fetchStatus({ status: 'recently_listed', limit: 8 }),
        fetchGains({ sort_by: "listing_gain_percent", order: "desc", limit: 5 }),
        fetchGains({ sort_by: "listing_gain_percent", order: "asc", limit: 5 }),
        fetchNews({ limit: 20 }),
    ]);

    const settings = getAdminSettings();
    const pageSettings = settings.pages.home;

    const initialData = {
        openIPOs,
        upcomingIPOs,
        recentlyListed,
        gainersData,
        losersData,
        newsData
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": settings.site.branding.siteName,
        "url": "https://ipohut.com/",
        "description": pageSettings.description,
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://ipohut.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": settings.site.branding.siteName,
        "url": "https://ipohut.com/",
        "logo": "https://ipohut.com/logo.png"
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
            <HomePage initialData={initialData} />
        </>
    );
}
