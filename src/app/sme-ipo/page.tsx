import SMEIPOPage from "@/views/SMEIPOPage";
import { fetchStatus } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function SMEIPO() {
    // Fetch all statuses in parallel for SME IPOs
    const [open, upcoming, closed, listed] = await Promise.all([
        fetchStatus({ status: "open", ipo_type: "sme", limit: 1000 }),
        fetchStatus({ status: "upcoming", ipo_type: "sme", limit: 1000 }),
        fetchStatus({ status: "closed", ipo_type: "sme", limit: 1000 }),
        fetchStatus({ status: "listed", ipo_type: "sme", limit: 1000 }),
    ]);

    // Combine all data
    const combinedData = {
        success: true,
        data: [...(open.data || []), ...(upcoming.data || []), ...(closed.data || []), ...(listed.data || [])],
        status: "success",
        message: "",
    };

    return <SMEIPOPage initialData={combinedData} />;
}
