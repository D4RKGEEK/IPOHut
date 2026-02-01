import CompareIPOPage from "@/views/tools/CompareIPOPage";
import { fetchCalendar } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compare IPOs | Performance & Metric Comparison",
    description: "Compare multiple IPOs side-by-side. Analyze price bands, GMP, subscription status, and listing performance to make informed decisions.",
    alternates: {
        canonical: "https://ipohut.com/tools/compare/",
    },
    openGraph: {
        title: "Compare IPOs | Performance & Metric Comparison",
        description: "Compare multiple IPOs side-by-side. Analyze price bands, GMP, subscription status, and listing performance to make informed decisions.",
        url: "https://ipohut.com/tools/compare/",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Compare IPOs side-by-side",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Compare IPOs | Performance & Metric Comparison",
        description: "Compare multiple IPOs side-by-side. Analyze price bands, GMP, subscription status, and listing performance to make informed decisions.",
        images: ["/og-image.png"],
    },
};

// 3 Hour Revalidation
export const revalidate = 25200;

export default async function CompareIPO() {
    const data = await fetchCalendar({ limit: 1000 });

    const ipoList = data.data?.map((ipo) => ({
        slug: ipo.slug,
        name: ipo.name,
        issuePrice: ipo.issue_price || 0,
        lotSize: ipo.lot_size || 0,
        gmp: ipo.gmp,
        gmpPercent: ipo.gmp_percent,
        subscriptionTimes: ipo.subscription_times,
        ipoType: ipo.ipo_type,
        status: ipo.status,
        openDate: ipo.open_date,
        closeDate: ipo.close_date,
        listingDate: ipo.listing_date,
        issueSize: ipo.issue_size,
    })) || [];

    return <CompareIPOPage initialIPOList={ipoList} />;
}
