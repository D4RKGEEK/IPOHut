import MainboardIPOPage from "@/views/MainboardIPOPage";
import { fetchCalendar } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function MainboardIPO() {
    const data = await fetchCalendar({ ipo_type: "mainboard", limit: 1000 });
    return <MainboardIPOPage initialData={data} />;
}
