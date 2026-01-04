import IPOCalendarPage from "@/views/IPOCalendarPage";
import { fetchCalendar } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function IPOCalendar() {
    const now = new Date();
    // Fetch current month and past 11 months (total 1 year)
    const requests = [];
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        requests.push(fetchCalendar({
            month: d.getMonth() + 1,
            year: d.getFullYear(),
            limit: 100
        }));
    }

    const responses = await Promise.all(requests);

    // Combine all data
    const allIPOs = responses.flatMap(r => r.data || []);

    // Create a combined response object
    // Note: status/message from first response, data is combined
    const combinedData = {
        success: responses[0]?.success ?? true,
        status: responses[0]?.status || "success",
        data: allIPOs,
        message: responses[0]?.message || "",
        meta: {
            ...responses[0]?.meta,
            total: allIPOs.length
        }
    };

    return <IPOCalendarPage initialData={combinedData} />;
}
