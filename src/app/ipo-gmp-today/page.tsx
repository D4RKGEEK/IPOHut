import GMPTrackerPage from "@/views/GMPTrackerPage";
import { IPOGMPResponse } from "@/types/ipo";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// Revalidate every hour
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const { title, description } = settings.pages.gmpTracker;
    const url = "https://ipohut.com/ipo-gmp-today/";

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

async function getGMPData(): Promise<IPOGMPResponse> {
    try {
        const res = await fetch("https://ipo-api-production.up.railway.app/api/ipos/gmp", {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch GMP data: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching GMP data:", error);
        return { success: false, data: [] };
    }
}

export default async function GMPTracker() {
    const data = await getGMPData();
    return <GMPTrackerPage initialData={data} />;
}
