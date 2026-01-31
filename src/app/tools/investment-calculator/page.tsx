import InvestmentCalculatorPage from "@/views/tools/InvestmentCalculatorPage";
import { fetchCalendar } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "IPO Investment Calculator | Calculate Application Value",
    description: "Calculate your total IPO investment amount based on lot size and price band. Plan your applications across different categories.",
    alternates: {
        canonical: "https://ipohut.com/tools/investment-calculator",
    },
    openGraph: {
        title: "IPO Investment Calculator | Calculate Application Value",
        description: "Calculate your total IPO investment amount based on lot size and price band. Plan your applications across different categories.",
        url: "https://ipohut.com/tools/investment-calculator",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "IPO Investment Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "IPO Investment Calculator | Calculate Application Value",
        description: "Calculate your total IPO investment amount based on lot size and price band. Plan your applications across different categories.",
        images: ["/og-image.png"],
    },
};

// 3 Hour Revalidation
export const revalidate = 25200;

export default async function InvestmentCalculator() {
    const data = await fetchCalendar({ limit: 1000 });

    // Transform to SelectedIPO format for IPOSelector
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

    return <InvestmentCalculatorPage initialIPOList={ipoList} />;
}
