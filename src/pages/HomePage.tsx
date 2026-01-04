import { MainLayout } from "@/components/layout";
import { NewsTicker, IPOCard, TypeBadge } from "@/components/shared";
import { useAdmin } from "@/contexts/AdminContext";
import { useOpenIPOs, useUpcomingIPOs, useRecentlyListedIPOs, useTopGainers, useTopLosers } from "@/hooks/useIPO";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown, Calendar, BarChart3, Clock, Zap, Megaphone, Sparkles, Calculator } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HomePage() {
  const { settings } = useAdmin();
  const homeConfig = settings.site.homePageConfig;
  const { data: openIPOs, isLoading: loadingOpen } = useOpenIPOs(6);
  const { data: upcomingIPOs, isLoading: loadingUpcoming } = useUpcomingIPOs(5);
  const { data: recentlyListed, isLoading: loadingRecent } = useRecentlyListedIPOs(8);
  const { data: gainersData, isLoading: loadingGainers } = useTopGainers(5);
  const { data: losersData, isLoading: loadingLosers } = useTopLosers(5);

  const pageSettings = settings.pages.home;

  return (
    <MainLayout 
      title={pageSettings.title}
      description={pageSettings.description}
    >
      {/* News Ticker */}
      {homeConfig.showNewsTicker && <NewsTicker />}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="container relative py-12 md:py-16">
          {/* Announcement Banner */}
          {homeConfig.announcementEnabled && homeConfig.announcementBanner && (
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-full pl-4 pr-5 py-2">
                <div className="p-1 bg-accent rounded-full">
                  <Megaphone className="h-3.5 w-3.5 text-accent-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{homeConfig.announcementBanner}</p>
              </div>
            </div>
          )}

          <div className="max-w-3xl">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {pageSettings.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              {pageSettings.subheading}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/ipo-gmp-today">
                <Button variant="premium" size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Check GMP Today
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="outline" size="lg" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  IPO Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12 space-y-10">
        {/* Quick Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/ipo-gmp-today" className="group">
            <Card className="card-interactive h-full border-success/20 bg-gradient-to-br from-success/5 to-transparent">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground">GMP Today</div>
                  <div className="text-sm text-muted-foreground">Live premiums</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/ipo-calendar" className="group">
            <Card className="card-interactive h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground">Calendar</div>
                  <div className="text-sm text-muted-foreground">All IPO dates</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/mainboard-ipo" className="group">
            <Card className="card-interactive h-full border-chart-3/20 bg-gradient-to-br from-chart-3/5 to-transparent">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-chart-3/10 rounded-xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground">Mainboard</div>
                  <div className="text-sm text-muted-foreground">All listings</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/sme-ipo" className="group">
            <Card className="card-interactive h-full border-warning/20 bg-gradient-to-br from-warning/5 to-transparent">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground">SME IPO</div>
                  <div className="text-sm text-muted-foreground">NSE & BSE SME</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Open IPOs Section */}
        {homeConfig.showOpenIPOs && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <div className="absolute inset-0 h-3 w-3 rounded-full bg-success animate-ping opacity-50" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold">Open for Subscription</h2>
              </div>
              <Link to="/mainboard-ipo">
                <Button variant="ghost" className="text-primary gap-1 group">
                  View all 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {loadingOpen ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-16 w-full rounded-xl" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : openIPOs?.data?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <CardContent className="p-12 text-center text-muted-foreground">
                  <div className="mx-auto w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Zap className="h-7 w-7 opacity-50" />
                  </div>
                  <p className="font-medium">No IPOs are currently open for subscription</p>
                  <p className="text-sm mt-1">Check back soon for new listings</p>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Upcoming IPOs */}
        {homeConfig.showUpcomingIPOs && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold">Upcoming IPOs</h2>
              </div>
              <Link to="/ipo-calendar">
                <Button variant="ghost" className="text-primary gap-1 group">
                  View calendar 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Card>
              {loadingUpcoming ? (
                <CardContent className="p-5 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </CardContent>
              ) : upcomingIPOs?.data?.length ? (
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-display font-semibold">IPO Name</TableHead>
                        <TableHead className="hidden md:table-cell font-display font-semibold">Type</TableHead>
                        <TableHead className="text-right font-display font-semibold">Opens On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingIPOs.data.slice(0, 5).map((ipo, idx) => (
                        <TableRow 
                          key={ipo.ipo_id} 
                          className="table-row-hover group"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <TableCell>
                            <Link 
                              to={`/ipo/${ipo.slug}`}
                              className="font-medium group-hover:text-primary transition-colors"
                            >
                              {ipo.name.replace(' IPO', '')}
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <TypeBadge type={ipo.ipo_type} />
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full">
                              <Calendar className="h-3.5 w-3.5" />
                              {ipo.open_date}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <CardContent className="p-8 text-center text-muted-foreground">
                  No upcoming IPOs scheduled.
                </CardContent>
              )}
            </Card>
          </section>
        )}

        {/* Recently Listed */}
        {homeConfig.showRecentlyListed && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-chart-3" />
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold">Recently Listed</h2>
              </div>
              <Link to="/ipo-listing-performance">
                <Button variant="ghost" className="text-primary gap-1 group">
                  All performance 
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden">
              {loadingRecent ? (
                <CardContent className="p-5 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </CardContent>
              ) : recentlyListed?.data?.length ? (
                <div className="overflow-x-auto scrollbar-thin">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-display font-semibold">IPO Name</TableHead>
                        <TableHead className="hidden sm:table-cell font-display font-semibold">Type</TableHead>
                        <TableHead className="hidden md:table-cell font-display font-semibold">Listed On</TableHead>
                        <TableHead className="text-right font-display font-semibold">Issue Price</TableHead>
                        <TableHead className="text-right font-display font-semibold">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentlyListed.data.slice(0, 8).map((ipo, idx) => {
                        const gainPercent = ipo.gain_loss_percent;
                        const isPositive = gainPercent !== null && gainPercent !== undefined && gainPercent >= 0;
                        return (
                          <TableRow 
                            key={ipo.ipo_id} 
                            className="table-row-hover group"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <TableCell>
                              <Link 
                                to={`/ipo/${ipo.slug}`}
                                className="font-medium group-hover:text-primary transition-colors"
                              >
                                {ipo.name.replace(' IPO', '')}
                              </Link>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <TypeBadge type={ipo.ipo_type} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                              {ipo.listing_date}
                            </TableCell>
                            <TableCell className="text-right font-tabular font-medium">
                              {ipo.issue_price ? `₹${ipo.issue_price}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {gainPercent !== null && gainPercent !== undefined ? (
                                <span className={cn(
                                  "inline-flex items-center gap-1 font-tabular font-semibold px-2.5 py-1 rounded-full text-sm",
                                  isPositive 
                                    ? "bg-success/10 text-success" 
                                    : "bg-destructive/10 text-destructive"
                                )}>
                                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                                  {gainPercent >= 0 ? "+" : ""}{gainPercent.toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <CardContent className="p-8 text-center text-muted-foreground">
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
            <Card className="border-success/20">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    Top Gainers
                  </CardTitle>
                  <Link to="/ipo-listing-performance">
                    <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 group">
                      View all 
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {loadingGainers ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : gainersData?.data?.length ? (
                  <div className="space-y-1">
                    {gainersData.data.map((ipo, idx) => (
                      <Link 
                        key={ipo.ipo_id} 
                        to={`/ipo/${ipo.slug}`}
                        className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-success/5 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-mono font-medium text-muted-foreground">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="block text-sm font-medium truncate group-hover:text-success transition-colors">
                              {ipo.name.replace(' IPO', '')}
                            </span>
                            <span className="text-xs text-muted-foreground font-tabular">
                              ₹{ipo.issue_price}
                            </span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-tabular font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
                          <TrendingUp className="h-3.5 w-3.5" />
                          +{ipo.listing_gain_percent?.toFixed(1)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card className="border-destructive/20">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    </div>
                    Top Losers
                  </CardTitle>
                  <Link to="/ipo-listing-performance">
                    <Button variant="ghost" size="sm" className="text-primary text-xs gap-1 group">
                      View all 
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {loadingLosers ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                ) : losersData?.data?.length ? (
                  <div className="space-y-1">
                    {losersData.data.map((ipo, idx) => (
                      <Link 
                        key={ipo.ipo_id} 
                        to={`/ipo/${ipo.slug}`}
                        className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-destructive/5 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-mono font-medium text-muted-foreground">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="block text-sm font-medium truncate group-hover:text-destructive transition-colors">
                              {ipo.name.replace(' IPO', '')}
                            </span>
                            <span className="text-xs text-muted-foreground font-tabular">
                              ₹{ipo.issue_price}
                            </span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-tabular font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                          <TrendingDown className="h-3.5 w-3.5" />
                          {ipo.listing_gain_percent?.toFixed(1)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </MainLayout>
  );
}