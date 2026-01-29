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

export default async function SMEIPO() {
    // Fetch all statuses in parallel for SME IPOs
    const [open, upcoming, closed, listed] = await Promise.all([
        fetchStatus({ status: "open", ipo_type: "sme", limit: 1000 }),
        fetchStatus({ status: "upcoming", ipo_type: "sme", limit: 1000 }),
        fetchStatus({ status: "closed", ipo_type: "sme", limit: 1000 }),
        fetchStatus({ status: "listed", ipo_type: "sme", limit: 1000 }),
    ]);

    const settings = getAdminSettings();
    const pageSettings = settings.pages.sme;

    const combinedData = {
        success: true,
        data: [...(open.data || []), ...(upcoming.data || []), ...(closed.data || []), ...(listed.data || [])],
        status: "success",
        message: "",
    };

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": pageSettings.title,
        "description": pageSettings.description,
        "url": "https://ipohut.com/sme-ipo",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": combinedData.data.length,
            "itemListElement": combinedData.data.slice(0, 10).map((ipo, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://ipohut.com/ipo/${ipo.slug}`,
                "name": ipo.name
            }))
        }
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <div style={{ display: 'none' }}>
                <h1>{pageSettings.h1}</h1>
            </div>
            <SMEIPOPage initialData={combinedData} />
        </>
    );
}
