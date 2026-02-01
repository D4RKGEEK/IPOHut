import ReturnsCalculatorPage from "@/views/tools/ReturnsCalculatorPage";
import { fetchCalendar } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "IPO Returns Calculator | Estimated Profit & Gain",
    description: "Estimate your potential IPO returns and listing gains based on current GMP and expected listing price.",
    alternates: {
        canonical: "https://ipohut.com/tools/returns-calculator/",
    },
    openGraph: {
        title: "IPO Returns Calculator | Estimated Profit & Gain",
        description: "Estimate your potential IPO returns and listing gains based on current GMP and expected listing price.",
        url: "https://ipohut.com/tools/returns-calculator/",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "IPO Returns Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "IPO Returns Calculator | Estimated Profit & Gain",
        description: "Estimate your potential IPO returns and listing gains based on current GMP and expected listing price.",
        images: ["/og-image.png"],
    },
};

// 3 Hour Revalidation
export const revalidate = 25200;

export default async function ReturnsCalculator() {
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

    return <ReturnsCalculatorPage initialIPOList={ipoList} />;
}
