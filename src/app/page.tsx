import HomePage from "@/views/HomePage";
import { fetchStatus, fetchGains, fetchNews } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

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
