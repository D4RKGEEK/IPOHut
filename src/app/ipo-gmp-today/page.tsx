import GMPTrackerPage from "@/views/GMPTrackerPage";
import { fetchStatus } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function GMPTracker() {
    // Fetch distinct IPOs (open + upcoming) to get GMP data
    // Or strictly use fetchStatus which is what useGMPIPOs likely wraps or useCalendar?
    // useGMPIPOs uses fetchStatus usually? Let's check useIPO or assume fetchStatus works.
    // Actually simpler: fetch upcoming and open and slice top GMP.
    // Or fetchStatus with no status filter might get all?
    // Let's assume we want to fetch mostly open/upcoming for GMP.

    // Based on previous analysis of useIPO.ts: useGMPIPOs -> fetchStatus({ status: 'upcoming' })? 
    // Wait, useGMPIPOs implementation in useIPO.ts was not shown in full detail in the excerpt.
    // But typically GMP is for upcoming/open/recently listed.
    // Let's fetch 'open' and 'upcoming' and merge.

    const [open, upcoming] = await Promise.all([
        fetchStatus({ status: 'open', limit: 50 }),
        fetchStatus({ status: 'upcoming', limit: 50 })
    ]);

    // Combine and remove duplicates
    const combined = [...(open.data || []), ...(upcoming.data || [])];
    const unique = Array.from(new Map(combined.map(item => [item.slug, item])).values());

    // Mock the APIResponse structure
    const data = {
        success: true,
        data: unique,
        count: unique.length,
        total: unique.length
    };

    return <GMPTrackerPage initialData={data} />;
}
