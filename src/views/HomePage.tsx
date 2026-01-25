"use client";

import { MainLayout } from "@/components/layout";
import { NewsTicker } from "@/components/shared";
import { useAdmin } from "@/contexts/AdminContext";
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

  const openIPOs = initialData?.openIPOs;
  const upcomingIPOs = initialData?.upcomingIPOs;
  const recentlyListed = initialData?.recentlyListed;
  const gainersData = initialData?.gainersData;
  const losersData = initialData?.losersData;

  const loadingOpen = false;
  const loadingUpcoming = false;
  const loadingRecent = false;
  const loadingGainers = false;
  const loadingLosers = false;

  const pageSettings = settings.pages.home;

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      {/* News Ticker */}
      {homeConfig.showNewsTicker && <NewsTicker initialData={initialData?.newsData?.data} />}

      {/* Modern Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Announcement Banner */}
              {homeConfig.announcementEnabled && homeConfig.announcementBanner && (
                <div className="inline-flex items-center gap-2 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-1.5 mb-2 group cursor-default">
                  <Megaphone className="h-3.5 w-3.5 text-primary animate-bounce" />
                  <span className="text-xs md:text-sm font-medium">{homeConfig.announcementBanner}</span>
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <div className="inline-flex items-center self-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] md:text-xs font-semibold text-primary backdrop-blur-sm">
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  Live GMP Updates & Subscription Status
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground bg-clip-text">
                  {pageSettings.h1}
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-[750px] mx-auto leading-relaxed">
                  {pageSettings.subheading}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
              <Link href="/ipo-gmp-today" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-10 text-base gap-2 rounded-2xl shadow-xl shadow-primary/20 w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <TrendingUp className="h-5 w-5" />
                  Check GMP Today
                </Button>
              </Link>
              <Link href="/ipo-calendar" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-14 px-10 text-base gap-2 rounded-2xl w-full sm:w-auto hover:bg-muted/80 backdrop-blur-sm border-2">
                  <Calendar className="h-5 w-5" />
                  IPO Calendar
                </Button>
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full pt-12 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">
              {[
                { label: "GMP Today", sub: "Live premiums", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/ipo-gmp-today" },
                { label: "Calendar", sub: "All IPO dates", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10", href: "/ipo-calendar" },
                { label: "Mainboard", sub: "Big listings", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10", href: "/mainboard-ipo" },
                { label: "SME IPO", sub: "NSE & BSE", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", href: "/sme-ipo" }
              ].map((item, i) => (
                <Link key={i} href={item.href} className="group">
                  <Card className="border-none shadow-none bg-muted/40 backdrop-blur-sm hover:bg-muted/60 transition-all rounded-3xl p-4 text-left h-full group-hover:-translate-y-1">
                    <div className={cn("p-2.5 rounded-2xl w-fit mb-3", item.bg)}>
                      <item.icon className={cn("h-5 w-5", item.color)} />
                    </div>
                    <div className="font-bold text-sm md:text-base mb-0.5">{item.label}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{item.sub}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container pb-20 space-y-16">
        {/* Open IPOs Section */}
        {homeConfig.showOpenIPOs && (
          <section className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl md:text-2xl font-bold">Open for Subscription</h2>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Don't miss out on these live IPO opportunities</p>
              </div>
              <Link href="/mainboard-ipo">
                <Button variant="link" className="text-primary gap-1 p-0 h-auto font-semibold">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loadingOpen ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-3xl" />
                ))}
              </div>
            ) : openIPOs?.data?.length ? (
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-2">
                <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 min-w-max md:min-w-0">
                  {openIPOs.data.slice(0, 5).map((ipo, idx) => (
                    <IPOGMPCard
                      key={ipo.ipo_id}
                      name={ipo.name}
                      slug={ipo.slug}
                      price={ipo.issue_price}
                      gmp={typeof ipo.gmp === 'object' ? (ipo.gmp as any)?.gmp_value : ipo.gmp}
                      gmpPercent={ipo.gmp_percent}
                      estListing={ipo.estimated_listing}
                      index={idx}
                      openDate={ipo.open_date}
                      closeDate={ipo.close_date}
                      subscription={ipo.subscription_times}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border-2 border-dashed bg-muted/20">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-muted rounded-2xl">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No IPOs are currently open for subscription</p>
                  <Link href="/ipo-calendar">
                    <Button variant="outline" size="sm" className="rounded-xl">Check Calendar</Button>
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Info Grid: Upcoming & Recent */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Upcoming IPOs */}
          {homeConfig.showUpcomingIPOs && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming IPOs
                </h2>
                <Link href="/ipo-calendar" className="text-xs font-semibold text-primary hover:underline">
                  View Full Calendar
                </Link>
              </div>

              <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                {loadingUpcoming ? (
                  <div className="p-6 space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                  </div>
                ) : upcomingIPOs?.data?.length ? (
                  <IPOTable
                    columns={[
                      { key: "name", label: "IPO Name" },
                      { key: "ipoType", label: "Type" },
                      { key: "openDate", label: "Opens" },
                    ]}
                    data={upcomingIPOs.data.slice(0, 6).map(ipo => {
                      const formatDateWithoutYear = (dateStr: string) => {
                        if (!dateStr) return dateStr;
                        return dateStr.replace(/,?\s*\d{4}/, '');
                      };

                      return {
                        slug: ipo.slug,
                        name: ipo.name.replace(' IPO', ''),
                        ipoType: ipo.ipo_type?.toLowerCase() as "mainboard" | "sme" | undefined,
                        openDate: formatDateWithoutYear(ipo.open_date),
                      };
                    })}
                    isLoading={false}
                    onRowClick={(row) => router.push(`/ipo/${row.slug}`)}
                    className="text-sm"
                  />
                ) : (
                  <div className="p-12 text-center text-sm text-muted-foreground italic">No upcoming IPOs scheduled.</div>
                )}
              </div>
            </div>
          )}

          {/* Recently Listed */}
          {homeConfig.showRecentlyListed && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Recently Listed
                </h2>
                <Link href="/ipo-listing-performance" className="text-xs font-semibold text-primary hover:underline">
                  Full Performance
                </Link>
              </div>

              <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                {loadingRecent ? (
                  <div className="p-6 space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
                  </div>
                ) : recentlyListed?.data?.length ? (
                  <IPOTable
                    columns={[
                      { key: "name", label: "IPO Name" },
                      { key: "listingPrice", label: "Listing" },
                      { key: "gain", label: "Gain" },
                    ]}
                    data={recentlyListed.data.slice(0, 6).map(ipo => ({
                      slug: ipo.slug,
                      name: ipo.name.replace(' IPO', ''),
                      listingPrice: formatCurrency(ipo.current_price || 0),
                      gain: (
                        <span className={cn("font-bold", (ipo.gain_loss_percent || 0) >= 0 ? "text-emerald-500" : "text-rose-500")}>
                          {(ipo.gain_loss_percent || 0) > 0 ? "+" : ""}{formatPercent(ipo.gain_loss_percent || 0)}
                        </span>
                      ),
                      rawValue_gain: ipo.gain_loss_percent
                    }))}
                    isLoading={false}
                    onRowClick={(row) => router.push(`/ipo/${row.slug}`)}
                    className="text-sm"
                  />
                ) : (
                  <div className="p-12 text-center text-sm text-muted-foreground italic">No recently listed IPOs.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Performance Highlights: Gainers & Losers */}
        {homeConfig.showGainersLosers && (
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Listing Highlights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Gainers */}
              <Card className="rounded-3xl border-none bg-emerald-500/5 shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-emerald-500/10">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">
                    <TrendingUp className="h-5 w-5" />
                    Bumper Listings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingGainers ? (
                    <div className="p-6 space-y-4">
                      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
                    </div>
                  ) : gainersData?.data?.length ? (
                    <div className="divide-y divide-emerald-500/10">
                      {gainersData.data.slice(0, 5).map((ipo) => (
                        <Link
                          key={ipo.ipo_id}
                          href={`/ipo/${ipo.slug}`}
                          className="flex items-center justify-between p-4 hover:bg-emerald-500/10 transition-colors"
                        >
                          <span className="text-sm font-medium">{ipo.name.replace(' IPO', '')}</span>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold font-tabular">
                            {ipo.listing_gain_percent ? `+${ipo.listing_gain_percent.toFixed(1)}%` : '—'}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-muted-foreground italic">No data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card className="rounded-3xl border-none bg-rose-500/5 shadow-none overflow-hidden">
                <CardHeader className="pb-4 border-b border-rose-500/10">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-rose-700 dark:text-rose-400 uppercase tracking-tight">
                    <TrendingDown className="h-5 w-5" />
                    Poor Listings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingLosers ? (
                    <div className="p-6 space-y-4">
                      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
                    </div>
                  ) : losersData?.data?.length ? (
                    <div className="divide-y divide-rose-500/10">
                      {losersData.data.slice(0, 5).map((ipo) => (
                        <Link
                          key={ipo.ipo_id}
                          href={`/ipo/${ipo.slug}`}
                          className="flex items-center justify-between p-4 hover:bg-rose-500/10 transition-colors"
                        >
                          <span className="text-sm font-medium">{ipo.name.replace(' IPO', '')}</span>
                          <span className="px-2 py-1 bg-rose-500/20 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold font-tabular">
                            {ipo.listing_gain_percent ? `${ipo.listing_gain_percent.toFixed(1)}%` : '—'}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-muted-foreground italic">No data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Newsletter / Tools Callout */}
        <section className="bg-primary rounded-[40px] p-8 md:p-14 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Master your IPO investments with our free tools.</h2>
              <p className="text-primary-foreground/80 md:text-lg">Calculate returns, compare companies, and track allotment sessions with ease.</p>
            </div>
            <Link href="/tools">
              <Button size="lg" variant="secondary" className="h-14 px-10 rounded-2xl font-bold gap-2 text-primary shadow-xl hover:scale-105 active:scale-95 transition-all">
                <Calculator className="h-5 w-5" />
                Explore Tools
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}