import SMEIPOPage from "@/views/SMEIPOPage";
import { fetchStatus } from "@/lib/api";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 7 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const { title, description } = settings.pages.sme;
    const url = "https://ipohut.com/sme-ipo";

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
        }
    };
}

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
