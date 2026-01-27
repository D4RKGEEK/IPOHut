import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import IPODetailPage from "@/views/IPODetailPage";
import { fetchIPODetail, fetchIPOMetadata } from "@/lib/api";
import { applyTemplate } from "@/types/admin";
import { defaultAdminSettings } from "@/types/admin";
import { getAdminSettings } from "@/lib/server-config";

// 3 Hour Revalidation
export const revalidate = 25200;

export async function generateStaticParams() {
    try {
        const response = await fetchIPOMetadata();
        if (!response.data) return [];

        return response.data.map((ipo) => ({
            slug: ipo.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const response = await fetchIPODetail(slug);

        if (!response.data) {
            return {
                title: "IPO Not Found | IPO Hut",
                description: "The requested IPO details could not be found."
            };
        }

        const ipo = response.data;
        const basicInfo = ipo.basic_info;
        const gmpData = ipo.gmp_data;
        const timeline = ipo.ipo_timeline;
        const logo = ipo.logo_about?.logo || "";
        const ipoName = basicInfo["IPO Name"] || slug;

        // SEO content extraction
        const priceBand = basicInfo["Price Band"] || "TBA";
        const lotSize = basicInfo["Lot Size"] || "TBA";
        const gmpValue = gmpData?.current_gmp ?? "TBA";
        const url = `https://ipohut.com/ipo/${slug}`;

        const title = `${ipoName} Details: Price, GMP Today, Review & Analysis`;
        const description = `Get the latest ${ipoName} details: Price Band ${priceBand}, Lot Size ${lotSize}. Should you subscribe? Read our deep-dive review, listing gains potential, and key dates.`;

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
                type: "article",
                images: logo ? [logo] : [],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: logo ? [logo] : [],
            },
            keywords: [`${ipoName} IPO`, `${ipoName} GMP`, `${ipoName} Price Band`, `${ipoName} Review`, `${ipoName} Analysis`, `IPO Hut`],
        };
    } catch (error) {
        return {
            title: "IPO Details | IPO Hut",
        };
    }
}

export default async function IPODetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const response = await fetchIPODetail(slug);

        if (!response.data) {
            notFound();
        }

        return <IPODetailPage initialData={response.data} />;
    } catch (error) {
        notFound();
    }
}
