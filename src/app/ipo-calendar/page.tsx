import IPOCalendarPage from "@/views/IPOCalendarPage";
import { fetchCalendar } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function IPOCalendar() {
    const now = new Date();
    // Fetch for the current month and year initially
    const data = await fetchCalendar({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        limit: 100
    });
    return <IPOCalendarPage initialData={data} />;
}
