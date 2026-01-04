import { MainLayout } from "@/components/layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useGMPIPOs } from "@/hooks/useIPO";
import { IPOTable, IPOTableColumn, IPOTableRow, GMPCalculator, StatusBadge, TypeBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent, getGainLossClass } from "@/lib/api";
import { TrendingUp, TrendingDown, Calculator } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const tableColumns: IPOTableColumn[] = [
  { key: "name", label: "IPO Name", sortable: true },
  { key: "ipoType", label: "Type", hideOnMobile: true },
  { key: "status", label: "Status" },
  { key: "issuePrice", label: "Issue Price" },
  { key: "gmp", label: "GMP", sortable: true },
  { key: "gmpPercent", label: "GMP %", sortable: true },
  { key: "estimatedListing", label: "Est. Listing", hideOnMobile: true },
];

export default function GMPTrackerPage() {
  const { settings } = useAdmin();
  const { data, isLoading } = useGMPIPOs(100);
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
      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{pageSettings.h1}</h1>
          <p className="text-muted-foreground">{pageSettings.subheading}</p>
        </header>

        {/* Top GMP Cards */}
        {topGainers.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topGainers.map((ipo, index) => (
              <Link key={ipo.ipo_id} to={`/ipo/${ipo.slug}`}>
                <Card className={cn(
                  "border card-hover",
                  index === 0 && "border-success/30 bg-success/5"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <TypeBadge type={ipo.ipo_type} />
                    </div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-1">{ipo.name}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="font-tabular font-bold text-success">
                        {formatCurrency(ipo.gmp)}
                      </span>
                      <span className="font-tabular text-sm text-success">
                        ({formatPercent(ipo.gmp_percent)})
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GMP Table */}
          <div className="lg:col-span-2">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-base">All IPOs with GMP</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <IPOTable
                    columns={tableColumns}
                    data={tableData}
                    isLoading={isLoading}
                    emptyMessage="No IPO GMP data available"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculator Sidebar */}
          <div className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calculator className="h-4 w-4" />
                  Profit Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedIPO ? (
                  <GMPCalculator
                    issuePrice={selectedIPO.issuePrice}
                    gmp={selectedIPO.gmp}
                    lotSize={selectedIPO.lotSize}
                  />
                ) : topGainers[0] ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Calculating for: <span className="font-medium text-foreground">{topGainers[0].name}</span>
                    </p>
                    <GMPCalculator
                      issuePrice={topGainers[0].issue_price}
                      gmp={topGainers[0].gmp || 0}
                      lotSize={topGainers[0].lot_size || 1}
                    />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select an IPO to calculate potential profit
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Total IPOs with GMP</span>
                  <span className="font-tabular font-medium">{ipos.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Positive GMP</span>
                  <span className="font-tabular font-medium text-success">
                    {ipos.filter(i => i.gmp && i.gmp > 0).length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Negative GMP</span>
                  <span className="font-tabular font-medium text-destructive">
                    {ipos.filter(i => i.gmp && i.gmp < 0).length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Highest GMP</span>
                  <span className="font-tabular font-medium text-success">
                    {formatCurrency(topGainers[0]?.gmp || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
