"use client";

import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useGMPIPOs } from "@/hooks/useIPO";
import { IPOTable, IPOTableColumn, IPOTableRow, GMPCalculator, TypeBadge, BreadcrumbNav } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/api";
import { TrendingUp, Calculator } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "ipoType", label: "Type", hideOnMobile: true },
  { key: "status", label: "Status" },
  { key: "issuePrice", label: "Price" },
  { key: "gmp", label: "GMP", sortable: true },
  { key: "gmpPercent", label: "GMP %", sortable: true },
  { key: "estimatedListing", label: "Est. Listing", hideOnMobile: true },
];

import { IPOStatus, APIResponse } from "@/types/ipo";

interface GMPTrackerPageProps {
  initialData?: APIResponse<IPOStatus[]>;
}

export default function GMPTrackerPage({ initialData }: GMPTrackerPageProps) {
  const { settings } = useAdmin();
  const { data: queryData, isLoading: queryLoading } = useGMPIPOs(100);

  const data = initialData || queryData;
  const isLoading = !initialData && queryLoading;
  const isMobile = useIsMobile();
  const [selectedIPO, setSelectedIPO] = useState<{
    name: string;
    issuePrice: number;
    gmp: number;
    lotSize: number;
  } | null>(null);

  const pageSettings = settings.pages.gmpTracker;
  const ipos = data?.data || [];

  const tableData: IPOTableRow[] = ipos.map(ipo => ({
    slug: ipo.slug,
    name: ipo.name,
    status: ipo.status,
    ipoType: ipo.ipo_type,
    issuePrice: ipo.issue_price,
    gmp: ipo.gmp,
    gmpPercent: ipo.gmp_percent,
    estimatedListing: ipo.estimated_listing ? formatCurrency(ipo.estimated_listing) : "—",
  }));

  // Top gainers (positive GMP)
  const topGainers = ipos
    .filter(i => i.gmp && i.gmp > 0)
    .slice(0, 5);

  return (
    <MainLayout
      title={pageSettings.title}
      description={pageSettings.description}
    >
      <div className="container py-4 md:py-6 space-y-4">
        <BreadcrumbNav items={[{ label: "GMP Today" }]} />

        {/* Header */}
        <header>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">{pageSettings.h1}</h1>
          <p className="text-sm text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Top GMP Cards - Mobile scrollable */}
        {topGainers.length > 0 && (
          <section className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-2 md:grid md:grid-cols-5 min-w-max md:min-w-0">
              {topGainers.map((ipo, index) => (
                <Link key={ipo.ipo_id} href={`/ipo/${ipo.slug}`} className="shrink-0 w-40 md:w-auto">
                  <Card className={cn(
                    "card-hover h-full",
                    index === 0 && "border-success/30"
                  )}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-muted-foreground">
                          #{index + 1}
                        </span>
                        <TypeBadge type={ipo.ipo_type} />
                      </div>
                      <h3 className="text-xs font-medium mb-1.5 line-clamp-1">{ipo.name}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="font-tabular text-sm text-success">
                          {formatCurrency(ipo.gmp)}
                        </span>
                        <span className="font-tabular text-[10px] text-success">
                          ({formatPercent(ipo.gmp_percent)})
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* GMP Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="p-3 md:p-4 border-b">
                <CardTitle className="text-sm font-medium">All IPOs with GMP</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isMobile ? (
                  // Mobile: Simple list view
                  <div className="divide-y">
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="p-3 animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      ))
                    ) : ipos.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No GMP data available
                      </div>
                    ) : (
                      ipos.map((ipo) => (
                        <Link
                          key={ipo.ipo_id}
                          href={`/ipo/${ipo.slug}`}
                          className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{ipo.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ₹{ipo.issue_price} • {ipo.status}
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <div className={cn(
                              "text-sm font-tabular",
                              ipo.gmp && ipo.gmp >= 0 ? "text-success" : "text-destructive"
                            )}>
                              {formatCurrency(ipo.gmp || 0)}
                            </div>
                            <div className={cn(
                              "text-xs font-tabular",
                              ipo.gmp && ipo.gmp >= 0 ? "text-success" : "text-destructive"
                            )}>
                              {formatPercent(ipo.gmp_percent)}
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <IPOTable
                      columns={tableColumns}
                      data={tableData}
                      isLoading={isLoading}
                      emptyMessage="No IPO GMP data available"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calculator Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="p-3 md:p-4 border-b">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Calculator className="h-4 w-4" />
                  Profit Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4">
                {selectedIPO ? (
                  <GMPCalculator
                    issuePrice={selectedIPO.issuePrice}
                    gmp={selectedIPO.gmp}
                    lotSize={selectedIPO.lotSize}
                  />
                ) : topGainers[0] ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3">
                      Calculating for: <span className="text-foreground">{topGainers[0].name}</span>
                    </p>
                    <GMPCalculator
                      issuePrice={topGainers[0].issue_price}
                      gmp={topGainers[0].gmp || 0}
                      lotSize={topGainers[0].lot_size || 1}
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
              <CardHeader className="p-3 md:p-4 border-b">
                <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y text-sm">
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Total IPOs</span>
                    <span className="font-tabular">{ipos.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Positive GMP</span>
                    <span className="font-tabular text-success">
                      {ipos.filter(i => i.gmp && i.gmp > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Negative GMP</span>
                    <span className="font-tabular text-destructive">
                      {ipos.filter(i => i.gmp && i.gmp < 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-muted-foreground">Highest GMP</span>
                    <span className="font-tabular text-success">
                      {formatCurrency(topGainers[0]?.gmp || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
