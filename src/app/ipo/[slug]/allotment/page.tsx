import IPOAllotmentCheckerPage from "@/views/IPOAllotmentCheckerPage";
import { fetchIPOMetadata, fetchIPODetail } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 7 Hour Revalidation
export const revalidate = 25200;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const response = await fetchIPODetail(slug);

        if (!response.data) {
            return {
                title: "IPO Allotment Tracker | IPO Hut",
                description: "Track live IPO allotment status and updates."
            };
        }

        const ipo = response.data;
        const ipoName = ipo.basic_info["IPO Name"] || slug;
        const logo = ipo.logo_about?.logo || "";
        const registrarName = ipo.contact_and_registrar?.ipo_registrar_lead_managers?.registrar?.name || "the registrar";

        const title = `${ipoName} Allotment Status: Check Direct Link`;
        const description = `Check ${ipoName} allotment status instantly. Use our direct link for ${registrarName} portal to verify your application via PAN, App No, or DP ID.`;
        const url = `https://ipohut.com/ipo/${slug}/allotment`;

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
                images: logo ? [logo] : [],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: logo ? [logo] : [],
            },
            keywords: [`${ipoName} IPO Allotment`, `${ipoName} Allotment Status`, `${ipoName} allotment link`, `check allotment status`, `IPO Hut`],
        };
    } catch (error) {
        return {
            title: "IPO Allotment Tracker | IPO Hut",
        };
    }
}

export async function generateStaticParams() {
    try {
        const response = await fetchIPOMetadata();
        if (!response.data) return [];

        return response.data.map((ipo) => ({
            slug: ipo.slug,
        }));
    } catch (error) {
        console.error("Error generating static params for allotment:", error);
        return [];
    }
}

export default async function IPOAllotment({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch server-side data for Allotment page
    let startData = null;
    try {
        const res = await fetchIPODetail(slug);
        if (res && res.data) {
            startData = res.data;
        }
    } catch (e) {
        // Fallback
    }

    if (!startData) return notFound();

    return <IPOAllotmentCheckerPage initialData={startData} />;
}
