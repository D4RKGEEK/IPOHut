"use client";

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { IPOSelector, SelectedIPO } from "@/components/shared/IPOSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Plus, Trash2, Trophy, ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";

interface CompareIPO {
  id: string;
  selected: SelectedIPO | null;
}

interface CompareIPOPageProps {
  initialIPOList?: SelectedIPO[];
}

export default function CompareIPOPage({ initialIPOList }: CompareIPOPageProps) {
  const [ipos, setIpos] = useState<CompareIPO[]>([
    { id: crypto.randomUUID(), selected: null },
    { id: crypto.randomUUID(), selected: null },
  ]);

  // Track page
  useScrollTracking("compare-ipo");
  useTimeOnPage("compare-ipo");

  const addIPO = () => {
    if (ipos.length < 5) {
      setIpos([...ipos, { id: crypto.randomUUID(), selected: null }]);
    }
  };

  const removeIPO = (id: string, ipoName?: string) => {
    if (ipos.length > 2) {
      setIpos(ipos.filter((ipo) => ipo.id !== id));
      if (ipoName) analytics.compareRemove(ipoName);
    }
  };

  const selectIPO = (id: string, ipo: SelectedIPO | null, position: number) => {
    setIpos(ipos.map((item) =>
      item.id === id ? { ...item, selected: ipo } : item
    ));
    if (ipo) analytics.compareAdd(ipo.name, position);
  };

  // Calculate derived values
  const calculateMetrics = (ipo: SelectedIPO | null) => {
    if (!ipo) return { minInvestment: 0, estimatedListing: 0, expectedReturn: 0, profitPerLot: 0 };
    const minInvestment = ipo.issuePrice * ipo.lotSize;
    const estimatedListing = ipo.issuePrice + (ipo.gmp || 0);
    const expectedReturn = ipo.issuePrice > 0 ? (((ipo.gmp || 0) / ipo.issuePrice) * 100) : 0;
    const profitPerLot = (ipo.gmp || 0) * ipo.lotSize;
    return { minInvestment, estimatedListing, expectedReturn, profitPerLot };
  };

  // Find best values for highlighting
  const getBestValue = (field: string) => {
    const validIpos = ipos.filter(i => i.selected);
    if (validIpos.length === 0) return 0;

    const values = validIpos.map((item) => {
      const metrics = calculateMetrics(item.selected);
      switch (field) {
        case "expectedReturn": return metrics.expectedReturn;
        case "minInvestment": return metrics.minInvestment;
        case "profitPerLot": return metrics.profitPerLot;
        case "subscription": return item.selected?.subscriptionTimes || 0;
        case "gmp": return item.selected?.gmp || 0;
        default: return 0;
      }
    });

    if (field === "minInvestment") {
      return Math.min(...values.filter(v => v > 0));
    }
    return Math.max(...values);
  };

  const validIpos = ipos.filter(i => i.selected);

  return (
    <MainLayout>
      <Helmet>
        <title>Compare IPOs - Side by Side IPO Comparison Tool | IPO Watch</title>
        <meta
          name="description"
          content="Compare multiple IPOs side by side. Analyze issue price, GMP, subscription, returns and more to make better investment decisions."
        />
      </Helmet>

      <section className="border-b">
        <div className="container py-5 md:py-8">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="h-5 w-5 text-chart-3" />
            <h1 className="text-xl md:text-2xl font-semibold">Compare IPOs</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Select multiple IPOs to compare key metrics side by side.
          </p>
        </div>
      </section>

      <div className="container py-4 md:py-6 space-y-6">
        {/* IPO Selection Cards */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 min-w-max md:min-w-0">
            {ipos.map((item, index) => (
              <Card key={item.id} className="relative w-72 md:w-auto shrink-0 border">
                <CardContent className="p-4 space-y-3">
                  {ipos.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeIPO(item.id, item.selected?.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">IPO {index + 1}</p>
                    <IPOSelector
                      value={item.selected}
                      onSelect={(ipo) => selectIPO(item.id, ipo, index + 1)}
                      className="w-full"
                      placeholder="Select IPO..."
                      initialData={initialIPOList}
                    />
                  </div>

                  {item.selected && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        {item.selected.ipoType && (
                          <Badge variant="outline" className="text-[10px]">
                            {item.selected.ipoType.toUpperCase()}
                          </Badge>
                        )}
                        {item.selected.status && (
                          <Badge variant="secondary" className="text-[10px]">
                            {item.selected.status}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-tabular font-medium">₹{item.selected.issuePrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lot</p>
                          <p className="font-tabular font-medium">{item.selected.lotSize}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">GMP</p>
                          <p className={cn(
                            "font-tabular font-medium",
                            (item.selected.gmp || 0) >= 0 ? "text-success" : "text-destructive"
                          )}>
                            ₹{item.selected.gmp || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Subs</p>
                          <p className="font-tabular font-medium">{item.selected.subscriptionTimes?.toFixed(1) || "—"}x</p>
                        </div>
                      </div>
                      <Link
                        href={`/ipo/${item.selected.slug}`}
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {ipos.length < 5 && (
              <Card
                className="border border-dashed cursor-pointer hover:bg-muted/30 flex items-center justify-center w-72 md:w-auto shrink-0 min-h-[200px]"
                onClick={addIPO}
              >
                <CardContent className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Add IPO to Compare</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {validIpos.length >= 2 && (
          <Card>
            <CardHeader className="border-b p-4 md:p-6">
              <CardTitle className="text-base font-medium">Comparison Results</CardTitle>
              <CardDescription className="text-xs">
                <Trophy className="h-3 w-3 text-success inline mr-1" />
                Trophy indicates the best value in each category
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-md divide-y text-sm overflow-x-auto">
                {/* Header */}
                <div className="flex bg-muted/50 text-xs min-w-max">
                  <div className="w-28 shrink-0 p-3 font-medium">Metric</div>
                  {validIpos.map((item) => (
                    <div key={item.id} className="w-36 shrink-0 p-3 text-center font-medium truncate">
                      {item.selected?.name.replace(" IPO", "").replace(" Ltd.", "") || "—"}
                    </div>
                  ))}
                </div>

                {/* Min Investment */}
                <div className="flex text-xs min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">Min Investment</div>
                  {validIpos.map((item) => {
                    const metrics = calculateMetrics(item.selected);
                    const isBest = metrics.minInvestment === getBestValue("minInvestment") && metrics.minInvestment > 0;
                    return (
                      <div key={item.id} className="w-36 shrink-0 p-3 text-center font-tabular">
                        <span className={cn("flex items-center justify-center gap-0.5", isBest && "text-success font-medium")}>
                          {isBest && <Trophy className="h-2.5 w-2.5" />}
                          ₹{metrics.minInvestment.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* GMP */}
                <div className="flex text-xs bg-muted/30 min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">GMP</div>
                  {validIpos.map((item) => {
                    const gmp = item.selected?.gmp || 0;
                    const isBest = gmp === getBestValue("gmp") && gmp > 0;
                    return (
                      <div key={item.id} className="w-36 shrink-0 p-3 text-center font-tabular">
                        <span className={cn(
                          "flex items-center justify-center gap-0.5",
                          gmp >= 0 ? (isBest ? "text-success font-medium" : "text-success") : "text-destructive"
                        )}>
                          {isBest && <Trophy className="h-2.5 w-2.5" />}
                          ₹{gmp}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Expected Return */}
                <div className="flex text-xs min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">Expected Return</div>
                  {validIpos.map((item) => {
                    const metrics = calculateMetrics(item.selected);
                    const isBest = metrics.expectedReturn === getBestValue("expectedReturn") && metrics.expectedReturn > 0;
                    return (
                      <div key={item.id} className="w-36 shrink-0 p-3 text-center font-tabular">
                        <span className={cn(
                          "flex items-center justify-center gap-0.5",
                          metrics.expectedReturn >= 0 ? (isBest ? "text-success font-medium" : "") : "text-destructive"
                        )}>
                          {isBest && <Trophy className="h-2.5 w-2.5" />}
                          {metrics.expectedReturn >= 0 ? "+" : ""}{metrics.expectedReturn.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Profit Per Lot */}
                <div className="flex text-xs bg-muted/30 min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">Profit/Lot</div>
                  {validIpos.map((item) => {
                    const metrics = calculateMetrics(item.selected);
                    const isBest = metrics.profitPerLot === getBestValue("profitPerLot") && metrics.profitPerLot > 0;
                    return (
                      <div key={item.id} className="w-36 shrink-0 p-3 text-center font-tabular">
                        <span className={cn(
                          "flex items-center justify-center gap-0.5",
                          metrics.profitPerLot >= 0 ? (isBest ? "text-success font-medium" : "") : "text-destructive"
                        )}>
                          {isBest && <Trophy className="h-2.5 w-2.5" />}
                          ₹{metrics.profitPerLot.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Subscription */}
                <div className="flex text-xs min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">Subscription</div>
                  {validIpos.map((item) => {
                    const subs = item.selected?.subscriptionTimes || 0;
                    const isBest = subs === getBestValue("subscription") && subs > 0;
                    return (
                      <div key={item.id} className="w-36 shrink-0 p-3 text-center font-tabular">
                        <span className={cn("flex items-center justify-center gap-0.5", isBest && "text-success font-medium")}>
                          {isBest && <Trophy className="h-2.5 w-2.5" />}
                          {subs ? `${subs.toFixed(2)}x` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* IPO Type */}
                <div className="flex text-xs bg-muted/30 min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">Type</div>
                  {validIpos.map((item) => (
                    <div key={item.id} className="w-36 shrink-0 p-3 text-center">
                      {item.selected?.ipoType ? (
                        <Badge variant="outline" className="text-[10px]">
                          {item.selected.ipoType.toUpperCase()}
                        </Badge>
                      ) : "—"}
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="flex text-xs min-w-max">
                  <div className="w-28 shrink-0 p-3 text-muted-foreground">Status</div>
                  {validIpos.map((item) => (
                    <div key={item.id} className="w-36 shrink-0 p-3 text-center">
                      {item.selected?.status ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {item.selected.status}
                        </Badge>
                      ) : "—"}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {validIpos.length < 2 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <GitCompare className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select at least 2 IPOs to compare</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
