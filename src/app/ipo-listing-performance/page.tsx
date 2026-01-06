import PerformanceTrackerPage from "@/views/PerformanceTrackerPage";
import { fetchGains } from "@/lib/api";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 3 Hour Revalidation
export const revalidate = 10800;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const { title, description } = settings.pages.performance;
    return { title, description };
}

export default async function PerformanceTracker() {
    const [gainers, losers] = await Promise.all([
        fetchGains({ sort_by: "listing_gain_percent", order: "desc", limit: 50 }),
        fetchGains({ sort_by: "listing_gain_percent", order: "asc", limit: 50 }),
    ]);

    const initialData = {
        gainers,
        losers
    };

    return <PerformanceTrackerPage initialData={initialData} />;
}
