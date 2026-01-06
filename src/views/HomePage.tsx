"use client";

import { MainLayout } from "@/components/layout";
import { NewsTicker, IPOCard, TypeBadge } from "@/components/shared";
import { useAdmin } from "@/contexts/AdminContext";
import { useOpenIPOs, useUpcomingIPOs, useRecentlyListedIPOs, useTopGainers, useTopLosers } from "@/hooks/useIPO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown, Calendar, BarChart3, Clock, Zap, Megaphone, Sparkles, Calculator } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IPOGMPCard, IPOTable, IPOTableColumn, IPOTableRow } from "@/components/shared";
import { formatCurrency, formatPercent } from "@/lib/api";
import { useRouter } from "next/navigation";

import { IPOStatus, IPOGain, APIResponse, IPONews } from "@/types/ipo";

interface HomePageProps {
  initialData?: {
    openIPOs?: APIResponse<IPOStatus[]>;
    upcomingIPOs?: APIResponse<IPOStatus[]>;
    recentlyListed?: APIResponse<IPOStatus[]>;
    gainersData?: APIResponse<IPOGain[]>;
    losersData?: APIResponse<IPOGain[]>;
    newsData?: APIResponse<IPONews[]>;
  }
}

export default function HomePage({ initialData }: HomePageProps) {
  const router = useRouter();
  const { settings } = useAdmin();
  const homeConfig = settings.site.homePageConfig;

  const { data: qOpen, isLoading: lOpen } = useOpenIPOs(6, { enabled: !initialData?.openIPOs });
  const { data: qUpcoming, isLoading: lUpcoming } = useUpcomingIPOs(5, { enabled: !initialData?.upcomingIPOs });
  const { data: qRecent, isLoading: lRecent } = useRecentlyListedIPOs(8, { enabled: !initialData?.recentlyListed });

  // Note: custom hooks like useTopGainers/Losers wrap useQuery but don't expose options in current implementation
  // We need to update useIPO.ts to allow passing options to these specific hooks too
  const { data: qGainers, isLoading: lGainers } = useTopGainers(5, { enabled: !initialData?.gainersData });
  const { data: qLosers, isLoading: lLosers } = useTopLosers(5, { enabled: !initialData?.losersData });

  const openIPOs = initialData?.openIPOs || qOpen;
  const upcomingIPOs = initialData?.upcomingIPOs || qUpcoming;
  const recentlyListed = initialData?.recentlyListed || qRecent;
  const gainersData = initialData?.gainersData || qGainers;
  const losersData = initialData?.losersData || qLosers;

  const loadingOpen = !initialData?.openIPOs && lOpen;
  const loadingUpcoming = !initialData?.upcomingIPOs && lUpcoming;
  const loadingRecent = !initialData?.recentlyListed && lRecent;
  const loadingGainers = !initialData?.gainersData && lGainers;
  const loadingLosers = !initialData?.losersData && lLosers;

  const pageSettings = settings.pages.home;

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      {/* News Ticker */}
      {homeConfig.showNewsTicker && <NewsTicker initialData={initialData?.newsData?.data} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container relative py-12 md:py-20 lg:py-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">

            {/* Announcement Banner */}
            {homeConfig.announcementEnabled && homeConfig.announcementBanner && (
              <div className="mb-2">
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 transition-colors hover:bg-accent/20">
                  <Megaphone className="h-3.5 w-3.5 text-accent" />
                  <p className="text-sm font-medium text-foreground">{homeConfig.announcementBanner}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                <Sparkles className="mr-1 h-3 w-3" />
                Live GMP Updates & Subscription Status
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                {pageSettings.h1}
              </h1>

              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto leading-relaxed">
                {pageSettings.subheading}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/ipo-gmp-today" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 px-8 text-base gap-2 rounded-full shadow-lg shadow-primary/25 w-full sm:w-auto hover:scale-105 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                  Check GMP Today
                </Button>
              </Link>
              <Link href="/ipo-calendar" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base gap-2 rounded-full w-full sm:w-auto hover:bg-muted/50">
                  <Calendar className="h-5 w-5" />
                  IPO Calendar
                </Button>
              </Link>
            </div>

            {/* Trust Indicator / Mini Stats */}
            <div className="pt-8 flex items-center gap-6 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-warning" />
                <span>Real-time Updates</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-success" />
                <span>Accurate GMP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Instant Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-4 md:py-8 space-y-6 md:space-y-8">
        {/* Quick Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <Link href="/ipo-gmp-today" className="group">
            <Card className="card-hover h-full">
              <CardContent className="p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
                <div className="p-2 bg-success/10 rounded-md">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">GMP Today</div>
                  <div className="text-xs text-muted-foreground">Live premiums</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/ipo-calendar" className="group">
            <Card className="card-hover h-full">
              <CardContent className="p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">Calendar</div>
                  <div className="text-xs text-muted-foreground">All dates</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mainboard-ipo" className="group">
            <Card className="card-hover h-full">
              <CardContent className="p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
                <div className="p-2 bg-chart-3/10 rounded-md">
                  <BarChart3 className="h-4 w-4 text-chart-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">Mainboard</div>
                  <div className="text-xs text-muted-foreground">All listings</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/sme-ipo" className="group">
            <Card className="card-hover h-full">
              <CardContent className="p-3 md:p-4 flex items-center gap-2.5 md:gap-3">
                <div className="p-2 bg-warning/10 rounded-md">
                  <Zap className="h-4 w-4 text-warning" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">SME IPO</div>
                  <div className="text-xs text-muted-foreground">NSE & BSE</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Open IPOs Section */}
        {homeConfig.showOpenIPOs && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <h2 className="text-base md:text-lg font-medium">Open for Subscription</h2>
              </div>
              <Link href="/mainboard-ipo">
                <Button variant="ghost" size="sm" className="text-primary gap-1 text-sm h-8">
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {loadingOpen ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
              </div>
            ) : openIPOs?.data?.length ? (
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-1">
                <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 min-w-max md:min-w-0">
                  {openIPOs.data.slice(0, 5).map((ipo, idx) => (
                    <IPOGMPCard
                      key={ipo.ipo_id}
                      name={ipo.name}
                      slug={ipo.slug}
                      price={ipo.issue_price}
                      gmp={typeof ipo.gmp === 'object' ? (ipo.gmp as any)?.gmp_value : (ipo.gmp || 0)}
                      gmpPercent={ipo.gmp_percent || 0}
                      estListing={ipo.estimated_listing}
                      index={idx}
                      openDate={ipo.open_date}
                      closeDate={ipo.close_date}
                      subscription={ipo.subscription_times ? `${ipo.subscription_times}x` : undefined}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No IPOs are currently open for subscription</p>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Upcoming IPOs */}
        {homeConfig.showUpcomingIPOs && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h2 className="text-base md:text-lg font-medium">Upcoming IPOs</h2>
              </div>
              <Link href="/ipo-calendar">
                <Button variant="ghost" size="sm" className="text-primary gap-1 text-sm h-8">
                  Calendar
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden">
              {loadingUpcoming ? (
                <div className="p-4 space-y-2">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : upcomingIPOs?.data?.length ? (
                <IPOTable
                  columns={[
                    { key: "name", label: "IPO Name" },
                    { key: "ipoType", label: "Type" },
                    { key: "openDate", label: "Opens" },
                    { key: "closeDate", label: "Closes" },
                    { key: "lotSize", label: "Lot Size" },
                  ]}
                  data={upcomingIPOs.data.slice(0, 10).map(ipo => {
                    // Helper function to remove year from date
                    const formatDateWithoutYear = (dateStr: string) => {
                      if (!dateStr) return dateStr;
                      // Remove year patterns like ", 2026" or " 2026"
                      return dateStr.replace(/,?\s*\d{4}/, '');
                    };

                    return {
                      slug: ipo.slug,
                      name: ipo.name.replace(' IPO', ''),
                      ipoType: ipo.ipo_type,
                      openDate: formatDateWithoutYear(ipo.open_date),
                      closeDate: formatDateWithoutYear(ipo.close_date),
                      lotSize: ipo.lot_size ? `${ipo.lot_size} Shares` : "—",
                      rawValue_lotSize: ipo.lot_size || 0,
                    };
                  })}
                  isLoading={false}
                  onRowClick={(row) => router.push(`/ipo/${row.slug}`)}
                  emptyMessage="No upcoming IPOs scheduled."
                />
              ) : (
                <CardContent className="p-6 text-center text-muted-foreground text-sm">
                  No upcoming IPOs scheduled.
                </CardContent>
              )}
            </Card>
          </section>
        )}

        {/* Recently Listed */}
        {homeConfig.showRecentlyListed && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-chart-3" />
                <h2 className="text-base md:text-lg font-medium">Recently Listed</h2>
              </div>
              <Link href="/ipo-listing-performance">
                <Button variant="ghost" size="sm" className="text-primary gap-1 text-sm h-8">
                  All
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden">
              {loadingRecent ? (
                <div className="p-4 space-y-2">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : recentlyListed?.data?.length ? (
                <IPOTable
                  columns={[
                    { key: "name", label: "IPO Name" },
                    { key: "listingDate", label: "Listed On", hideOnMobile: true },
                    { key: "issuePrice", label: "Issue Price", hideOnMobile: true },
                    { key: "listingPrice", label: "Listing Price" },
                    { key: "gain", label: "Gain/Loss" },
                  ]}
                  data={recentlyListed.data.slice(0, 10).map(ipo => ({
                    slug: ipo.slug,
                    name: ipo.name.replace(' IPO', ''),
                    listingDate: ipo.listing_date,
                    issuePrice: formatCurrency(ipo.issue_price),
                    listingPrice: formatCurrency(ipo.current_price || 0),
                    gain: (
                      <span className={cn("font-medium", (ipo.gain_loss_percent || 0) >= 0 ? "text-success" : "text-destructive")}>
                        {(ipo.gain_loss_percent || 0) > 0 ? "+" : ""}{formatPercent(ipo.gain_loss_percent || 0)}
                      </span>
                    ),
                    rawValue_gain: ipo.gain_loss_percent
                  }))}
                  isLoading={false}
                  onRowClick={(row) => router.push(`/ipo/${row.slug}`)}
                  emptyMessage="No recently listed IPOs."
                />
              ) : (
                <CardContent className="p-6 text-center text-muted-foreground text-sm">
                  No recently listed IPOs.
                </CardContent>
              )}
            </Card>
          </section>
        )}

        {/* Gainers & Losers */}
        {homeConfig.showGainersLosers && (
          <section className="grid md:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Top Gainers
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingGainers ? (
                  <div className="p-4 space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : gainersData?.data?.length ? (
                  <div className="divide-y">
                    {gainersData.data.slice(0, 5).map((ipo) => (
                      <Link
                        key={ipo.ipo_id}
                        href={`/ipo/${ipo.slug}`}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm truncate flex-1 min-w-0">
                          {ipo.name.replace(' IPO', '')}
                        </span>
                        <span className="text-xs font-tabular text-success ml-2">
                          +{ipo.listing_gain_percent?.toFixed(1)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center p-4">No data</p>
                )}
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader className="pb-2 px-4 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    Top Losers
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingLosers ? (
                  <div className="p-4 space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : losersData?.data?.length ? (
                  <div className="divide-y">
                    {losersData.data.slice(0, 5).map((ipo) => (
                      <Link
                        key={ipo.ipo_id}
                        href={`/ipo/${ipo.slug}`}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm truncate flex-1 min-w-0">
                          {ipo.name.replace(' IPO', '')}
                        </span>
                        <span className="text-xs font-tabular text-destructive ml-2">
                          {ipo.listing_gain_percent?.toFixed(1)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center p-4">No data</p>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </MainLayout>
  );
}