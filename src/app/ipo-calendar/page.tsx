import IPOCalendarPage from "@/views/IPOCalendarPage";
import { fetchCalendar, fetchStatus } from "@/lib/api";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 3 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const { title, description } = settings.pages.calendar;
    const url = "https://ipohut.com/ipo-calendar";

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: [
                {
                    url: settings.site.defaultSeo.ogImage || "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: settings.site.branding.siteName,
                }
            ],
        }
    };
}

export default async function IPOCalendar() {
    // Since the month/year filtering in the calendar API is currently unreliable,
    // we fetch IPOs by status to ensure we have all currently relevant data.
    // We fetch open, upcoming, and recently listed IPOs.
    // To ensure the calendar stays purely static (no CSR calls), we fetch a large 
    // dataset on the server to cover most navigation needs.
    const statuses = ["open", "upcoming", "recently_listed", "listed"];
    const requests = statuses.map(status => fetchStatus({
        status: status as any,
        limit: status === "listed" ? 300 : 50
    }));

    // Also fetch a large calendar chunk
    requests.push(fetchCalendar({ limit: 300 }));

    const responses = await Promise.allSettled(requests);

    // Combine all data
    const allIPOs: any[] = [];
    const seenSlugs = new Set();

    responses.forEach(result => {
        if (result.status === "fulfilled" && result.value.data) {
            const data = Array.isArray(result.value.data) ? result.value.data : [];
            data.forEach((ipo: any) => {
                if (!seenSlugs.has(ipo.slug)) {
                    allIPOs.push(ipo);
                    seenSlugs.add(ipo.slug);
                }
            });
        }
    });

    // Create a combined response object
    const combinedData = {
        success: true,
        status: "success",
        data: allIPOs,
        message: "",
        meta: {
            total: allIPOs.length
        }
    };

    return <IPOCalendarPage initialData={combinedData} />;
}
