import InvestmentCalculatorPage from "@/views/tools/InvestmentCalculatorPage";
import { fetchCalendar } from "@/lib/api";

// 3 Hour Revalidation
export const revalidate = 10800;

export default async function InvestmentCalculator() {
    const data = await fetchCalendar({ limit: 100 });

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
