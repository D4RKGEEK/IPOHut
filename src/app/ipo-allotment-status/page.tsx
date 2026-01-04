import AllotmentStatusPage from "@/views/AllotmentStatusPage";
import { fetchStatus } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function AllotmentStatus() {
    const data = await fetchStatus({ status: "closed", limit: 50 });
    return <AllotmentStatusPage initialData={data} />;
}
