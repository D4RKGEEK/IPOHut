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

import { IPOStatus, IPOGain, APIResponse, IPONews } from "@/types/ipo";

interface HomePageProps {
  initialData?: {
    openIPOs?: APIResponse<IPOStatus[]>;
    upcomingIPOs?: APIResponse<IPOStatus[]>;
    recentlyListed?: APIResponse<IPOStatus[]>;
    gainersData?: APIResponse<IPOGain[]>;
    losersData?: APIResponse<IPOGain[]>;
  }
}

export default function HomePage({ initialData }: HomePageProps) {
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
      {homeConfig.showNewsTicker && <NewsTicker />}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="container py-6 md:py-10">
          {/* Announcement Banner */}
          {homeConfig.announcementEnabled && homeConfig.announcementBanner && (
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-md px-3 py-1.5">
                <Megaphone className="h-3.5 w-3.5 text-accent" />
                <p className="text-sm text-foreground">{homeConfig.announcementBanner}</p>
              </div>
            </div>
          )}

          <div className="max-w-2xl">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2">
              {pageSettings.h1}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mb-5">
              {pageSettings.subheading}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Link href="/ipo-gmp-today">
                <Button size="sm" className="gap-1.5 h-9">
                  <Sparkles className="h-3.5 w-3.5" />
                  GMP Today
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                  <Calculator className="h-3.5 w-3.5" />
                  Calculator
                </Button>
              </Link>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-12 w-full rounded-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : openIPOs?.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {openIPOs.data.slice(0, 6).map((ipo, idx) => (
                  <IPOCard
                    key={ipo.ipo_id}
                    name={ipo.name}
                    slug={ipo.slug}
                    status={ipo.status}
                    ipoType={ipo.ipo_type}
                    issuePrice={ipo.issue_price}
                    subscriptionTimes={ipo.subscription_times}
                    closeDate={ipo.close_date}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  />
                ))}
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

            <Card>
              {loadingUpcoming ? (
                <CardContent className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </CardContent>
              ) : upcomingIPOs?.data?.length ? (
                <div className="divide-y">
                  {upcomingIPOs.data.slice(0, 5).map((ipo) => (
                    <Link
                      key={ipo.ipo_id}
                      href={`/ipo/${ipo.slug}`}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm font-medium truncate">{ipo.name.replace(' IPO', '')}</span>
                        <TypeBadge type={ipo.ipo_type} />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        {ipo.open_date}
                      </span>
                    </Link>
                  ))}
                </div>
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
                <CardContent className="p-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </CardContent>
              ) : recentlyListed?.data?.length ? (
                <div className="divide-y">
                  {recentlyListed.data.slice(0, 6).map((ipo) => {
                    const gainPercent = ipo.gain_loss_percent;
                    const isPositive = gainPercent !== null && gainPercent !== undefined && gainPercent >= 0;
                    return (
                      <Link
                        key={ipo.ipo_id}
                        href={`/ipo/${ipo.slug}`}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm font-medium truncate">{ipo.name.replace(' IPO', '')}</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">₹{ipo.issue_price}</span>
                        </div>
                        <div className="shrink-0">
                          {gainPercent !== null && gainPercent !== undefined ? (
                            <span className={cn(
                              "text-xs font-tabular",
                              isPositive ? "text-success" : "text-destructive"
                            )}>
                              {gainPercent >= 0 ? "+" : ""}{gainPercent.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
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