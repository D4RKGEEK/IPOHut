import IPOStatisticsPage from "@/views/IPOStatisticsPage";
import { fetchGains, fetchCalendar } from "@/lib/api";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 7 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const stats = settings?.pages?.statistics || {
        title: "IPO Statistics",
        description: "IPO Statistics and Analysis"
    };
    const url = "https://ipohut.com/ipo-statistics";

    return {
        title: stats.title,
        description: stats.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: stats.title,
            description: stats.description,
            url: url,
            type: "website",
        }
    };
}

export default async function IPOStatistics() {
    const [gainsData, calendarData] = await Promise.all([
        fetchGains({ limit: 1000 }),
        fetchCalendar({ limit: 1000 }),
    ]);

    const initialData = {
        gainsData,
        calendarData
    };

    return <IPOStatisticsPage initialData={initialData} />;
}
