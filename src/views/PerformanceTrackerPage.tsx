"use client";

import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useTopGainers, useTopLosers } from "@/hooks/useIPO";
import { IPOTable, IPOTableColumn, IPOTableRow, BreadcrumbNav } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPercent, getGainLossClass } from "@/lib/api";
import { TrendingUp, TrendingDown, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "ipoType", label: "Type", hideOnMobile: true },
  { key: "listingDate", label: "Listed", hideOnMobile: true },
  { key: "issuePrice", label: "Issue" },
  { key: "currentPrice", label: "Current", hideOnMobile: true },
  { key: "listingGainPercent", label: "Gain/Loss", sortable: true },
  { key: "subscriptionTimes", label: "Subs", hideOnMobile: true },
];

export default function PerformanceTrackerPage() {
  const { settings } = useAdmin();
  const isMobile = useIsMobile();
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
      <div className="container py-4 md:py-6 space-y-4">
        <BreadcrumbNav items={[{ label: "Performance Tracker" }]} />

        {/* Header */}
        <header>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">{pageSettings.h1}</h1>
          <p className="text-sm text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Top 3 Gainers - Mobile optimized */}
        {top3Gainers.length >= 3 && (
          <section className="grid grid-cols-3 gap-2">
            {/* 2nd Place */}
            <Link href={`/ipo/${top3Gainers[1].slug}`}>
              <Card className="card-hover h-full">
                <CardContent className="p-2 md:p-3 text-center">
                  <Medal className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-[10px] text-muted-foreground">#2</div>
                  <h3 className="text-[10px] md:text-xs font-medium mt-1 line-clamp-2">{top3Gainers[1].name.replace(' IPO', '')}</h3>
                  <div className={cn("text-sm md:text-base font-tabular mt-1", getGainLossClass(top3Gainers[1].listing_gain_percent))}>
                    {formatPercent(top3Gainers[1].listing_gain_percent)}
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 1st Place */}
            <Link href={`/ipo/${top3Gainers[0].slug}`}>
              <Card className="border-warning/40 bg-warning/5 card-hover h-full">
                <CardContent className="p-2 md:p-3 text-center">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 text-warning" />
                  <div className="text-[10px] text-warning font-medium">#1</div>
                  <h3 className="text-[10px] md:text-xs font-medium mt-1 line-clamp-2">{top3Gainers[0].name.replace(' IPO', '')}</h3>
                  <div className={cn("text-base md:text-xl font-tabular mt-1", getGainLossClass(top3Gainers[0].listing_gain_percent))}>
                    {formatPercent(top3Gainers[0].listing_gain_percent)}
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 3rd Place */}
            <Link href={`/ipo/${top3Gainers[2].slug}`}>
              <Card className="card-hover h-full">
                <CardContent className="p-2 md:p-3 text-center">
                  <Medal className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 text-amber-700" />
                  <div className="text-[10px] text-muted-foreground">#3</div>
                  <h3 className="text-[10px] md:text-xs font-medium mt-1 line-clamp-2">{top3Gainers[2].name.replace(' IPO', '')}</h3>
                  <div className={cn("text-sm md:text-base font-tabular mt-1", getGainLossClass(top3Gainers[2].listing_gain_percent))}>
                    {formatPercent(top3Gainers[2].listing_gain_percent)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}

        {/* Tabs for Gainers and Losers */}
        <Tabs defaultValue="gainers">
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-md grid grid-cols-2 gap-0.5 text-xs">
            <TabsTrigger value="gainers" className="py-2 gap-1.5 data-[state=active]:bg-background">
              <TrendingUp className="h-3.5 w-3.5" />
              Gainers ({gainers.length})
            </TabsTrigger>
            <TabsTrigger value="losers" className="py-2 gap-1.5 data-[state=active]:bg-background">
              <TrendingDown className="h-3.5 w-3.5" />
              Losers ({losers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="mt-4">
            <Card>
              <CardHeader className="p-3 md:p-4 border-b">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isMobile ? (
                  <div className="divide-y">
                    {loadingGainers ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="p-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      ))
                    ) : gainers.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      gainers.slice(0, 20).map((ipo) => (
                        <Link
                          key={ipo.ipo_id}
                          href={`/ipo/${ipo.slug}`}
                          className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{ipo.name}</div>
                            <div className="text-xs text-muted-foreground">₹{ipo.issue_price}</div>
                          </div>
                          <span className="text-sm font-tabular text-success ml-3">
                            +{ipo.listing_gain_percent?.toFixed(1)}%
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                ) : (
                  <IPOTable
                    columns={tableColumns}
                    data={gainerTableData}
                    isLoading={loadingGainers}
                    emptyMessage="No data available"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="losers" className="mt-4">
            <Card>
              <CardHeader className="p-3 md:p-4 border-b">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Worst Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isMobile ? (
                  <div className="divide-y">
                    {loadingLosers ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="p-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      ))
                    ) : losers.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      losers.slice(0, 20).map((ipo) => (
                        <Link
                          key={ipo.ipo_id}
                          href={`/ipo/${ipo.slug}`}
                          className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{ipo.name}</div>
                            <div className="text-xs text-muted-foreground">₹{ipo.issue_price}</div>
                          </div>
                          <span className="text-sm font-tabular text-destructive ml-3">
                            {ipo.listing_gain_percent?.toFixed(1)}%
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                ) : (
                  <IPOTable
                    columns={tableColumns}
                    data={loserTableData}
                    isLoading={loadingLosers}
                    emptyMessage="No data available"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg md:text-xl font-tabular text-success">
                {gainers.length}
              </div>
              <div className="text-[10px] text-muted-foreground">Gainers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg md:text-xl font-tabular text-destructive">
                {losers.length}
              </div>
              <div className="text-[10px] text-muted-foreground">Losers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg md:text-xl font-tabular text-success">
                {formatPercent(top3Gainers[0]?.listing_gain_percent || 0)}
              </div>
              <div className="text-[10px] text-muted-foreground">Best</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg md:text-xl font-tabular text-destructive">
                {formatPercent(losers[0]?.listing_gain_percent || 0)}
              </div>
              <div className="text-[10px] text-muted-foreground">Worst</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
