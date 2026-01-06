"use client";

import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { IPOTable, IPOTableColumn, IPOTableRow, GMPCalculator, TypeBadge, BreadcrumbNav } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/api";
import { TrendingUp, Calculator, Flame, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { IPOGMPResponse, IPOGMPListItem } from "@/types/ipo";
import { Badge } from "@/components/ui/badge";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "dates", label: "Dates", hideOnMobile: true },
  { key: "price", label: "Price" },
  { key: "gmp", label: "GMP", sortable: true },
  { key: "estListing", label: "Est. Listing", sortable: true, hideOnMobile: true },
  { key: "rating", label: "Rating" },
];

interface GMPTrackerPageProps {
  initialData?: IPOGMPResponse;
}

export default function GMPTrackerPage({ initialData }: GMPTrackerPageProps) {
  const { settings } = useAdmin();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIPO, setSelectedIPO] = useState<{
    name: string;
    issuePrice: number;
    gmp: number;
    lotSize: number;
  } | null>(null);

  const pageSettings = settings.pages.gmpTracker;
  const ipos = initialData?.data || [];

  // Filter and Sort
  const filteredIPOs = useMemo(() => {
    return ipos.filter(ipo =>
      ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ipos, searchQuery]);

  const tableData: IPOTableRow[] = filteredIPOs.map(ipo => {
    const issuePrice = parseFloat(ipo.ipo_details.price.replace(/[^\d.]/g, "") || "0");

    return {
      slug: ipo.slug,
      name: ipo.name,
      // Custom render for dates column
      dates: (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>Open: {ipo.dates.open}</span>
          <span>Close: {ipo.dates.close}</span>
        </div>
      ),
      price: (
        <div className="flex flex-col">
          <span className="text-sm">₹{issuePrice}</span>
          <span className="text-[10px] text-muted-foreground">Lot: {ipo.ipo_details.lot}</span>
        </div>
      ),
      gmp: (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold",
            ipo.current_gmp > 0 ? "text-success" : ipo.current_gmp < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {formatCurrency(ipo.current_gmp)}
          </span>
          <span className={cn(
            "text-xs",
            (ipo.gmp_percent || 0) > 0 ? "text-success" : (ipo.gmp_percent || 0) < 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            {formatPercent(ipo.gmp_percent || 0)}
          </span>
        </div>
      ),
      estListing: (
        <div className="flex flex-col">
          <span className="font-semibold">{formatCurrency(ipo.estimated_listing)}</span>
          <span className="text-[10px] text-muted-foreground">
            Gain: {formatCurrency(ipo.estimated_listing - issuePrice)}
          </span>
        </div>
      ),
      rating: (
        <Badge variant="outline" className={cn(
          "w-max",
          ipo.rating.score >= 4 ? "bg-success/10 text-success hover:bg-success/20 border-success/20" :
            ipo.rating.score === 3 ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20" :
              "bg-muted text-muted-foreground"
        )}>
          {ipo.rating.label}
        </Badge>
      ),
      // Raw values for sorting
      rawValue_gmp: ipo.current_gmp,
      rawValue_estListing: ipo.estimated_listing,
      rawValue_name: ipo.name
    };
  });

  // Top gainers (positive GMP)
  const topGainers = useMemo(() => {
    return [...ipos]
      .sort((a, b) => (b.gmp_percent || 0) - (a.gmp_percent || 0))
      .filter(i => i.current_gmp > 0)
      .slice(0, 5);
  }, [ipos]);

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-4 md:py-6 space-y-6">
        <BreadcrumbNav items={[{ label: "GMP Today" }]} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <header>
            <h1 className="text-xl md:text-3xl font-bold mb-1.5">{pageSettings.h1}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">{pageSettings.subheading}</p>
          </header>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search IPOs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Top GMP Cards - Mobile scrollable */}
        {topGainers.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
              <h2 className="text-lg font-semibold">Top GMP Movers</h2>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 py-1">
              <div className="flex gap-3 md:grid md:grid-cols-5 min-w-max md:min-w-0">
                {topGainers.map((ipo, index) => (
                  <Link key={ipo.slug} href={`/ipo/${ipo.slug}`} className="shrink-0 w-48 md:w-auto group">
                    <Card className={cn(
                      "card-hover h-full transition-all duration-300",
                      index === 0 ? "border-orange-500/30 bg-orange-500/5 shadow-sm" : "hover:border-primary/20"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                            #{index + 1}
                          </Badge>
                          {ipo.rating.score >= 4 && (
                            <Flame className="h-3.5 w-3.5 text-orange-500" />
                          )}
                        </div>
                        <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {ipo.name}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">GMP</span>
                            <span className="text-sm font-bold text-success">
                              {formatCurrency(ipo.current_gmp)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Return</span>
                            <span className="text-xs font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded">
                              {formatPercent(ipo.gmp_percent || 0)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t text-[10px] text-muted-foreground flex justify-between">
                          <span>Listing: {ipo.estimated_listing}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GMP Table */}
          <div className="lg:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Live GMP Tracker</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {filteredIPOs.length} IPOs found
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isMobile ? (
                  // Mobile: Detailed list view
                  <div className="divide-y max-h-[800px] overflow-y-auto">
                    {filteredIPOs.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No IPOs found matching your search.
                      </div>
                    ) : (
                      filteredIPOs.map((ipo) => (
                        <Link
                          key={ipo.slug}
                          href={`/ipo/${ipo.slug}`}
                          className="flex flex-col gap-3 p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-medium text-sm line-clamp-2">{ipo.name}</h3>
                            <Badge variant={ipo.current_gmp > 0 ? "default" : "outline"} className={cn(
                              "shrink-0 ml-1",
                              ipo.current_gmp > 0 ? "bg-success hover:bg-success/90" : ""
                            )}>
                              {formatCurrency(ipo.current_gmp)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider">Price</span>
                              <span className="font-medium text-foreground">₹{ipo.ipo_details.price}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] uppercase tracking-wider">Est. Listing</span>
                              <span className="font-medium text-foreground">{formatCurrency(ipo.estimated_listing)}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase tracking-wider">Dates</span>
                              <span className="font-medium text-foreground">{ipo.dates.open} - {ipo.dates.close}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] uppercase tracking-wider">Rating</span>
                              <span className={cn(
                                "font-medium",
                                ipo.rating.score >= 3 ? "text-success" : "text-foreground"
                              )}>{ipo.rating.label}</span>
                            </div>
                          </div>

                          {ipo.last_updated && (
                            <div className="text-[10px] text-muted-foreground text-right italic">
                              Updated: {ipo.last_updated}
                            </div>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <IPOTable
                      columns={tableColumns}
                      data={tableData}
                      isLoading={false}
                      emptyMessage="No GMP data available matching your search"
                      onRowClick={(row) => window.location.href = `/ipo/${row.slug}`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calculator Sidebar */}
          <aside className="space-y-6">
            <Card className="border shadow-sm sticky top-20">
              <CardHeader className="p-4 border-b bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Calculator className="h-4 w-4" />
                  Quick Profit Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {selectedIPO ? (
                  <GMPCalculator
                    issuePrice={selectedIPO.issuePrice}
                    gmp={selectedIPO.gmp}
                    lotSize={selectedIPO.lotSize}
                  />
                ) : topGainers[0] ? (
                  <>
                    <div className="bg-primary/5 rounded-lg p-3 mb-4 border border-primary/10">
                      <p className="text-xs text-muted-foreground mb-1">Calculating for top gainer:</p>
                      <p className="font-medium text-sm text-primary">{topGainers[0].name}</p>
                    </div>
                    <GMPCalculator
                      issuePrice={parseFloat(topGainers[0].ipo_details.price.replace(/[^\d.]/g, "") || "0")}
                      gmp={topGainers[0].current_gmp || 0}
                      lotSize={parseInt(topGainers[0].ipo_details.lot.replace(/[^\d]/g, "") || "1")}
                    />
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    Select an IPO to calculate profit
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-sm font-semibold">Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y text-sm">
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Active IPOs</span>
                    <span className="font-tabular font-medium">{ipos.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Positive Sentiment</span>
                    <span className="font-tabular font-medium text-success">
                      {ipos.filter(i => i.current_gmp > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Avg. GMP Returns</span>
                    <span className="font-tabular font-medium">
                      {formatPercent(ipos.reduce((acc, curr) => acc + (curr.gmp_percent || 0), 0) / (ipos.length || 1))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
