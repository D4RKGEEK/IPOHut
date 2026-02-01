import ToolsPage from "@/views/ToolsPage";
import { getAdminSettings } from "@/lib/server-config";
import { Metadata } from "next";

// 7 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata(): Promise<Metadata> {
    const settings = getAdminSettings();
    const stats = settings?.pages?.tools || {
        title: "IPO Tools & Calculators",
        description: "Calculate IPO profits, GMP, and investment returns with our professional tools."
    };
    const url = "https://ipohut.com/tools/";

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

export default function Tools() {
    return <ToolsPage />;
}
