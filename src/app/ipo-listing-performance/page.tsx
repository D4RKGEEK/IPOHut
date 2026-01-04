import PerformanceTrackerPage from "@/views/PerformanceTrackerPage";
import { fetchGains } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

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
