import AllotmentStatusPage from "@/views/AllotmentStatusPage";
import { fetchStatus } from "@/lib/api";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 7 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const { title, description } = settings.pages.allotmentStatus;
    const url = "https://ipohut.com/ipo-allotment-status";

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
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        }
    };
}

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
