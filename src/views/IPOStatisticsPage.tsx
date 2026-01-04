"use client";

import { useState, useMemo, lazy, Suspense } from "react";
import { MainLayout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/BreadcrumbNav";
import { useIPOGains, useIPOCalendar } from "@/hooks/useIPO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Building2, Factory, Briefcase, Heart, Cpu, Car, ShoppingBag } from "lucide-react";
import { useScrollTracking, useTimeOnPage, trackEvent } from "@/hooks/useAnalytics";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

// Lazy load charts for code splitting
const LazyAreaChart = lazy(() => import("recharts").then(m => ({ default: m.AreaChart })));
const LazyArea = lazy(() => import("recharts").then(m => ({ default: m.Area })));
const LazyBarChart = lazy(() => import("recharts").then(m => ({ default: m.BarChart })));
const LazyBar = lazy(() => import("recharts").then(m => ({ default: m.Bar })));

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend } from "recharts";

// Sector definitions
const SECTORS = [
  { key: "all", label: "All Sectors", icon: BarChart3 },
  { key: "finance", label: "Finance & Banking", icon: Building2 },
  { key: "manufacturing", label: "Manufacturing", icon: Factory },
  { key: "it", label: "IT & Technology", icon: Cpu },
  { key: "pharma", label: "Pharma & Healthcare", icon: Heart },
  { key: "auto", label: "Automotive", icon: Car },
  { key: "retail", label: "Retail & Consumer", icon: ShoppingBag },
  { key: "services", label: "Services", icon: Briefcase },
];

const SECTOR_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
];

// Helper to extract year from date string
function extractYear(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1]) : null;
}

// Helper to detect sector from IPO name (simple heuristic)
function detectSector(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("bank") || lowerName.includes("finance") || lowerName.includes("capital") || lowerName.includes("fund")) return "finance";
  if (lowerName.includes("pharma") || lowerName.includes("health") || lowerName.includes("med") || lowerName.includes("bio")) return "pharma";
  if (lowerName.includes("tech") || lowerName.includes("soft") || lowerName.includes("info") || lowerName.includes("digital") || lowerName.includes("cyber")) return "it";
  if (lowerName.includes("auto") || lowerName.includes("motor") || lowerName.includes("vehicle")) return "auto";
  if (lowerName.includes("retail") || lowerName.includes("consumer") || lowerName.includes("food") || lowerName.includes("fmcg")) return "retail";
  if (lowerName.includes("steel") || lowerName.includes("metal") || lowerName.includes("engineering") || lowerName.includes("industrial")) return "manufacturing";
  return "services";
}

export default function IPOStatisticsPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedSector, setSelectedSector] = useState<string>("all");

  useScrollTracking("ipo_statistics");
  useTimeOnPage("ipo_statistics");

  const { data: gainsData, isLoading: loadingGains } = useIPOGains({ limit: 500 });
  const { data: calendarData, isLoading: loadingCalendar } = useIPOCalendar({ limit: 500 });

  const allIPOs = gainsData?.data || [];
  const calendarIPOs = calendarData?.data || [];

  // Calculate year-wise statistics
  const yearStats = useMemo(() => {
    const stats: Record<number, {
      total: number;
      gainers: number;
      losers: number;
      avgGain: number;
      totalRaised: number;
      mainboard: number;
      sme: number;
      bestPerformer: { name: string; gain: number } | null;
      worstPerformer: { name: string; gain: number } | null;
    }> = {};

    allIPOs.forEach(ipo => {
      const year = extractYear(ipo.listing_date);
      if (!year) return;

      if (!stats[year]) {
        stats[year] = {
          total: 0,
          gainers: 0,
          losers: 0,
          avgGain: 0,
          totalRaised: 0,
          mainboard: 0,
          sme: 0,
          bestPerformer: null,
          worstPerformer: null,
        };
      }

      stats[year].total++;
      if (ipo.listing_gain_percent >= 0) stats[year].gainers++;
      else stats[year].losers++;

      stats[year].avgGain += ipo.listing_gain_percent;

      if (ipo.ipo_type === "mainboard") stats[year].mainboard++;
      else stats[year].sme++;

      if (!stats[year].bestPerformer || ipo.listing_gain_percent > stats[year].bestPerformer.gain) {
        stats[year].bestPerformer = { name: ipo.name, gain: ipo.listing_gain_percent };
      }
      if (!stats[year].worstPerformer || ipo.listing_gain_percent < stats[year].worstPerformer.gain) {
        stats[year].worstPerformer = { name: ipo.name, gain: ipo.listing_gain_percent };
      }
    });

    // Calculate averages
    Object.keys(stats).forEach(year => {
      const y = parseInt(year);
      if (stats[y].total > 0) {
        stats[y].avgGain = stats[y].avgGain / stats[y].total;
      }
    });

    return stats;
  }, [allIPOs]);

  // Sector-wise data
  const sectorStats = useMemo(() => {
    const stats: Record<string, { count: number; avgGain: number; totalGain: number }> = {};

    allIPOs.forEach(ipo => {
      const sector = detectSector(ipo.name);
      if (!stats[sector]) {
        stats[sector] = { count: 0, avgGain: 0, totalGain: 0 };
      }
      stats[sector].count++;
      stats[sector].totalGain += ipo.listing_gain_percent;
    });

    Object.keys(stats).forEach(sector => {
      if (stats[sector].count > 0) {
        stats[sector].avgGain = stats[sector].totalGain / stats[sector].count;
      }
    });

    return stats;
  }, [allIPOs]);

  // Filter by sector
  const filteredIPOs = useMemo(() => {
    if (selectedSector === "all") return allIPOs;
    return allIPOs.filter(ipo => detectSector(ipo.name) === selectedSector);
  }, [allIPOs, selectedSector]);

  // Chart data
  const yearChartData = useMemo(() => {
    return Object.entries(yearStats)
      .map(([year, data]) => ({
        year,
        total: data.total,
        gainers: data.gainers,
        losers: data.losers,
        avgGain: parseFloat(data.avgGain.toFixed(2)),
        successRate: parseFloat(((data.gainers / data.total) * 100).toFixed(1)),
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [yearStats]);

  const sectorChartData = useMemo(() => {
    return Object.entries(sectorStats).map(([sector, data]) => ({
      name: SECTORS.find(s => s.key === sector)?.label || sector,
      value: data.count,
      avgGain: parseFloat(data.avgGain.toFixed(2)),
    }));
  }, [sectorStats]);

  const years = Object.keys(yearStats).sort((a, b) => parseInt(b) - parseInt(a));
  const currentYearStats = yearStats[parseInt(selectedYear)];

  const isLoading = loadingGains || loadingCalendar;

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    trackEvent("statistics_year_change", { year });
  };

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    trackEvent("statistics_sector_change", { sector });
  };

  return (
    <MainLayout
      title="IPO Statistics"
      description="Year-wise IPO statistics, performance trends, sector analysis, and historical data for Indian IPO market."
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "Indian IPO Statistics",
            "description": "Comprehensive year-wise statistics and analysis of Indian IPO market including performance metrics, sector breakdown, and trends.",
            "keywords": ["IPO", "Statistics", "India", "Stock Market", "Performance"],
            "temporalCoverage": "2020/2025",
          })}
        </script>
      </Helmet>

      <div className="container py-4 md:py-6 space-y-4">
        <BreadcrumbNav items={[{ label: "IPO Statistics" }]} />

        <header>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">IPO Statistics & Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Year-wise performance, sector breakdown, and historical trends
          </p>
        </header>

        {/* Year Selector & Quick Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">Success Rate:</span>
              <span className="font-medium">
                {currentYearStats ? ((currentYearStats.gainers / currentYearStats.total) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Total IPOs:</span>
              <span className="font-medium">{currentYearStats?.total || 0}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Gainers</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <p className="text-xl font-semibold text-success">
                  {currentYearStats?.gainers || 0}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">Losers</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <p className="text-xl font-semibold text-destructive">
                  {currentYearStats?.losers || 0}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Avg Return</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <p className={cn(
                  "text-xl font-semibold",
                  (currentYearStats?.avgGain || 0) >= 0 ? "text-success" : "text-destructive"
                )}>
                  {currentYearStats?.avgGain.toFixed(1) || 0}%
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-chart-3" />
                <span className="text-xs text-muted-foreground">Mainboard</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <p className="text-xl font-semibold">
                  {currentYearStats?.mainboard || 0}
                  <span className="text-sm text-muted-foreground ml-1">/ {currentYearStats?.sme || 0} SME</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="yearly" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="yearly">Yearly Trend</TabsTrigger>
            <TabsTrigger value="sector">Sector Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="yearly" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">IPOs per Year</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={yearChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="gainers" name="Gainers" fill="hsl(var(--success))" stackId="a" />
                      <Bar dataKey="losers" name="Losers" fill="hsl(var(--destructive))" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={yearChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, "Success Rate"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="successRate"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.2)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sector" className="space-y-4">
            {/* Sector Filter */}
            <div className="flex gap-2 flex-wrap">
              {SECTORS.map(sector => {
                const Icon = sector.icon;
                return (
                  <button
                    key={sector.key}
                    onClick={() => handleSectorChange(sector.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                      selectedSector === sector.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {sector.label}
                  </button>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">IPOs by Sector</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[250px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie>
                        <Pie
                          data={sectorChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sectorChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Sector Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))
                  ) : (
                    sectorChartData
                      .sort((a, b) => b.avgGain - a.avgGain)
                      .slice(0, 6)
                      .map((sector, idx) => (
                        <div key={sector.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}
                            />
                            <span className="text-sm">{sector.name}</span>
                          </div>
                          <span className={cn(
                            "text-sm font-medium",
                            sector.avgGain >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {sector.avgGain >= 0 ? "+" : ""}{sector.avgGain.toFixed(1)}%
                          </span>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Best Performers */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Best Performer {selectedYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : currentYearStats?.bestPerformer ? (
                    <div>
                      <p className="font-medium">{currentYearStats.bestPerformer.name.replace(" IPO", "")}</p>
                      <p className="text-2xl font-bold text-success">
                        +{currentYearStats.bestPerformer.gain.toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No data</p>
                  )}
                </CardContent>
              </Card>

              {/* Worst Performer */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    Worst Performer {selectedYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : currentYearStats?.worstPerformer ? (
                    <div>
                      <p className="font-medium">{currentYearStats.worstPerformer.name.replace(" IPO", "")}</p>
                      <p className="text-2xl font-bold text-destructive">
                        {currentYearStats.worstPerformer.gain.toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No data</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Average Returns Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Listing Returns by Year</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={yearChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, "Avg Return"]}
                      />
                      <Bar
                        dataKey="avgGain"
                        name="Avg Return"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
