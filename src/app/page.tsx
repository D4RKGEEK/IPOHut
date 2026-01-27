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
        }
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

    const initialData = {
        openIPOs,
        upcomingIPOs,
        recentlyListed,
        gainersData,
        losersData,
        newsData
    };

    return <HomePage initialData={initialData} />;
}
