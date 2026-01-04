import AllotmentStatusPage from "@/views/AllotmentStatusPage";
import { fetchStatus } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function AllotmentStatus() {
    let data;
    try {
        data = await fetchStatus({ status: "closed", limit: 50 });
    } catch (error) {
        console.error("Failed to fetch allotment status:", error);
        // Return empty data/error state structure depending on what the view expects
        // Assuming APIResponse<IPOStatus[]> structure
        data = { data: [], status: "error", message: "Failed to fetch data" } as any;
    }
    return <AllotmentStatusPage initialData={data} />;
}
