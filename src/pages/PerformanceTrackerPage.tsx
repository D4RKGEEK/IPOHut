import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useTopGainers, useTopLosers } from "@/hooks/useIPO";
import { IPOTable, IPOTableColumn, IPOTableRow, TypeBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercent, getGainLossClass } from "@/lib/api";
import { TrendingUp, TrendingDown, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "ipoType", label: "Type", hideOnMobile: true },
  { key: "listingDate", label: "Listing Date", hideOnMobile: true },
  { key: "issuePrice", label: "Issue Price" },
  { key: "currentPrice", label: "Current Price", hideOnMobile: true },
  { key: "listingGainPercent", label: "Gain/Loss", sortable: true },
  { key: "subscriptionTimes", label: "Subscription", hideOnMobile: true },
];

export default function PerformanceTrackerPage() {
  const { settings } = useAdmin();
  const { data: gainersData, isLoading: loadingGainers } = useTopGainers(50);
  const { data: losersData, isLoading: loadingLosers } = useTopLosers(50);

  const pageSettings = settings.pages.performance;

  const gainers = gainersData?.data || [];
  const losers = losersData?.data?.filter(i => i.listing_gain_percent < 0) || [];

  const gainerTableData: IPOTableRow[] = gainers.map(ipo => ({
    slug: ipo.slug,
    name: ipo.name,
    ipoType: ipo.ipo_type,
    listingDate: ipo.listing_date,
    issuePrice: ipo.issue_price,
    currentPrice: ipo.current_price,
    listingGainPercent: ipo.listing_gain_percent,
    subscriptionTimes: ipo.subscription_times,
  }));

  const loserTableData: IPOTableRow[] = losers.map(ipo => ({
    slug: ipo.slug,
    name: ipo.name,
    ipoType: ipo.ipo_type,
    listingDate: ipo.listing_date,
    issuePrice: ipo.issue_price,
    currentPrice: ipo.current_price,
    listingGainPercent: ipo.listing_gain_percent,
    subscriptionTimes: ipo.subscription_times,
  }));

  // Top 3 gainers for featured section
  const top3Gainers = gainers.slice(0, 3);

  return (
    <MainLayout 
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageSettings.h1}</h1>
          <p className="text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Top 3 Gainers Podium */}
        {top3Gainers.length >= 3 && (
          <section className="grid grid-cols-3 gap-4">
            {/* 2nd Place */}
            <Link to={`/ipo/${top3Gainers[1].slug}`}>
              <Card className="border card-hover h-full">
                <CardContent className="p-4 text-center">
                  <Medal className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground mb-1">#2</div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{top3Gainers[1].name}</h3>
                  <div className={cn("text-lg font-bold font-tabular", getGainLossClass(top3Gainers[1].listing_gain_percent))}>
                    {formatPercent(top3Gainers[1].listing_gain_percent)}
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 1st Place */}
            <Link to={`/ipo/${top3Gainers[0].slug}`}>
              <Card className="border-2 border-warning/50 bg-warning/5 card-hover h-full">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-10 w-10 mx-auto mb-2 text-warning" />
                  <div className="text-xs text-warning font-semibold mb-1">#1 TOP GAINER</div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{top3Gainers[0].name}</h3>
                  <div className={cn("text-2xl font-bold font-tabular", getGainLossClass(top3Gainers[0].listing_gain_percent))}>
                    {formatPercent(top3Gainers[0].listing_gain_percent)}
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 3rd Place */}
            <Link to={`/ipo/${top3Gainers[2].slug}`}>
              <Card className="border card-hover h-full">
                <CardContent className="p-4 text-center">
                  <Medal className="h-8 w-8 mx-auto mb-2 text-amber-700" />
                  <div className="text-xs text-muted-foreground mb-1">#3</div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{top3Gainers[2].name}</h3>
                  <div className={cn("text-lg font-bold font-tabular", getGainLossClass(top3Gainers[2].listing_gain_percent))}>
                    {formatPercent(top3Gainers[2].listing_gain_percent)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}

        {/* Tabs for Gainers and Losers */}
        <Tabs defaultValue="gainers">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
            <TabsTrigger value="gainers" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Gainers ({gainers.length})
            </TabsTrigger>
            <TabsTrigger value="losers" className="gap-2">
              <TrendingDown className="h-4 w-4" />
              Worst Performers ({losers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="mt-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-success" />
                  All-Time Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <IPOTable
                  columns={tableColumns}
                  data={gainerTableData}
                  isLoading={loadingGainers}
                  emptyMessage="No listing performance data available"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="losers" className="mt-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Worst Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <IPOTable
                  columns={tableColumns}
                  data={loserTableData}
                  isLoading={loadingLosers}
                  emptyMessage="No negative listing performance data"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-tabular text-success">
                {gainers.length}
              </div>
              <div className="text-xs text-muted-foreground">Positive Listings</div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-tabular text-destructive">
                {losers.length}
              </div>
              <div className="text-xs text-muted-foreground">Negative Listings</div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-tabular text-success">
                {formatPercent(top3Gainers[0]?.listing_gain_percent || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Best Return</div>
            </CardContent>
          </Card>
          <Card className="border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-tabular text-destructive">
                {formatPercent(losers[0]?.listing_gain_percent || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Worst Return</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
