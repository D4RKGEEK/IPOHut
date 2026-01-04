import SMEIPOPage from "@/views/SMEIPOPage";
import { fetchCalendar } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function SMEIPO() {
    const data = await fetchCalendar({ ipo_type: "sme", limit: 1000 });
    return <SMEIPOPage initialData={data} />;
}
