import { MainLayout } from "@/components/layout";
import { NewsTicker, IPOCard, IPOTable, IPOTableColumn, IPOTableRow } from "@/components/shared";
import { useAdmin } from "@/contexts/AdminContext";
import { useOpenIPOs, useIPOCalendar, useTopGainers, useTopLosers } from "@/hooks/useIPO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "ipoType", label: "Type", hideOnMobile: true },
  { key: "status", label: "Status" },
  { key: "openDate", label: "Open", hideOnMobile: true },
  { key: "closeDate", label: "Close", hideOnMobile: true },
  { key: "issuePrice", label: "Price", sortable: true },
  { key: "gmp", label: "GMP", sortable: true },
  { key: "subscriptionTimes", label: "Subscription", sortable: true, hideOnMobile: true },
];

export default function HomePage() {
  const { settings } = useAdmin();
  const { data: openIPOs, isLoading: loadingOpen } = useOpenIPOs(5);
  const { data: calendarData, isLoading: loadingCalendar } = useIPOCalendar({ 
    limit: 15, 
    sort_by: "open_date", 
    order: "desc" 
  });
  const { data: gainersData, isLoading: loadingGainers } = useTopGainers(5);
  const { data: losersData, isLoading: loadingLosers } = useTopLosers(5);

  const pageSettings = settings.pages.home;

  // Transform calendar data for table
  const tableData: IPOTableRow[] = calendarData?.data?.map(ipo => ({
    slug: ipo.slug,
    name: ipo.name,
    status: ipo.status,
    ipoType: ipo.ipo_type,
    openDate: ipo.open_date,
    closeDate: ipo.close_date,
    listingDate: ipo.listing_date,
    issuePrice: ipo.issue_price,
    gmp: ipo.gmp,
    gmpPercent: ipo.gmp_percent,
    subscriptionTimes: ipo.subscription_times,
  })) || [];

  return (
    <MainLayout 
      title={pageSettings.title}
      description={pageSettings.description}
    >
      {/* News Ticker */}
      <NewsTicker />

      <div className="container py-6 md:py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {pageSettings.h1}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {pageSettings.subheading}
          </p>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/ipo-gmp-today">
            <Card className="card-hover border h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-md">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-medium text-sm">GMP Today</div>
                  <div className="text-xs text-muted-foreground">Live premiums</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/ipo-calendar">
            <Card className="card-hover border h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Calendar</div>
                  <div className="text-xs text-muted-foreground">Upcoming IPOs</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/mainboard-ipo">
            <Card className="card-hover border h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-md">
                  <BarChart3 className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <div className="font-medium text-sm">Mainboard</div>
                  <div className="text-xs text-muted-foreground">All listings</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/sme-ipo">
            <Card className="card-hover border h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-md">
                  <BarChart3 className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="font-medium text-sm">SME IPO</div>
                  <div className="text-xs text-muted-foreground">NSE & BSE SME</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Open IPOs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Open IPOs</h2>
            <Link to="/mainboard-ipo">
              <Button variant="ghost" size="sm" className="text-primary">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loadingOpen ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : openIPOs?.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openIPOs.data.slice(0, 3).map(ipo => (
                <IPOCard
                  key={ipo.ipo_id}
                  name={ipo.name}
                  slug={ipo.slug}
                  status={ipo.status}
                  ipoType={ipo.ipo_type}
                  issuePrice={ipo.issue_price}
                  subscriptionTimes={ipo.subscription_times}
                  closeDate={ipo.close_date}
                />
              ))}
            </div>
          ) : (
            <Card className="border">
              <CardContent className="p-8 text-center text-muted-foreground">
                No IPOs are currently open for subscription.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Gainers & Losers Section */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Top Gainers
                </CardTitle>
                <Link to="/ipo-listing-performance">
                  <Button variant="ghost" size="sm" className="text-primary text-xs">
                    View all <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {loadingGainers ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : gainersData?.data?.length ? (
                <div className="space-y-2">
                  {gainersData.data.map((ipo, idx) => (
                    <Link 
                      key={ipo.ipo_id} 
                      to={`/ipo/${ipo.slug}`}
                      className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono w-4">{idx + 1}</span>
                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {ipo.name.replace(' IPO', '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground font-tabular">
                          ₹{ipo.issue_price}
                        </span>
                        <span className={cn(
                          "text-sm font-semibold font-tabular",
                          ipo.listing_gain_percent >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {ipo.listing_gain_percent >= 0 ? "+" : ""}{ipo.listing_gain_percent?.toFixed(1)}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Top Losers
                </CardTitle>
                <Link to="/ipo-listing-performance">
                  <Button variant="ghost" size="sm" className="text-primary text-xs">
                    View all <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {loadingLosers ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : losersData?.data?.length ? (
                <div className="space-y-2">
                  {losersData.data.map((ipo, idx) => (
                    <Link 
                      key={ipo.ipo_id} 
                      to={`/ipo/${ipo.slug}`}
                      className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono w-4">{idx + 1}</span>
                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {ipo.name.replace(' IPO', '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground font-tabular">
                          ₹{ipo.issue_price}
                        </span>
                        <span className={cn(
                          "text-sm font-semibold font-tabular",
                          ipo.listing_gain_percent >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {ipo.listing_gain_percent >= 0 ? "+" : ""}{ipo.listing_gain_percent?.toFixed(1)}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Master Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent & Upcoming IPOs</h2>
          </div>
          <IPOTable
            columns={tableColumns}
            data={tableData}
            isLoading={loadingCalendar}
            emptyMessage="No IPO data available"
          />
        </section>
      </div>
    </MainLayout>
  );
}
