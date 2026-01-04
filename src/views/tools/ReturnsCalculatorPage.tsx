"use client";

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Link from "next/link";
import { MainLayout } from "@/components/layout";
import { IPOSelector, SelectedIPO } from "@/components/shared/IPOSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, BarChart3, PieChart, ArrowLeft, ExternalLink } from "lucide-react";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";

interface ReturnsCalculatorPageProps {
  initialIPOList?: SelectedIPO[];
}

export default function ReturnsCalculatorPage({ initialIPOList }: ReturnsCalculatorPageProps) {
  const [selectedIPO, setSelectedIPO] = useState<SelectedIPO | null>(null);

  // Track page
  useScrollTracking("returns-calculator");
  useTimeOnPage("returns-calculator");

  // Listing gain calculator
  const [listingIssuePrice, setListingIssuePrice] = useState<number>(100);
  const [listingPrice, setListingPrice] = useState<number>(150);
  const [listingLotSize, setListingLotSize] = useState<number>(100);
  const [listingLots, setListingLots] = useState<number>(1);

  // Current return calculator
  const [buyPrice, setBuyPrice] = useState<number>(100);
  const [currentPrice, setCurrentPrice] = useState<number>(150);
  const [quantity, setQuantity] = useState<number>(100);

  // Target price calculator
  const [targetIssuePrice, setTargetIssuePrice] = useState<number>(100);
  const [desiredReturn, setDesiredReturn] = useState<number>(50);

  // Auto-fill when IPO is selected
  useEffect(() => {
    if (selectedIPO) {
      setListingIssuePrice(selectedIPO.issuePrice || 100);
      setListingLotSize(selectedIPO.lotSize || 100);
      // Estimate listing price based on GMP
      if (selectedIPO.gmp) {
        setListingPrice(selectedIPO.issuePrice + selectedIPO.gmp);
      }
      setBuyPrice(selectedIPO.issuePrice || 100);
      setQuantity(selectedIPO.lotSize || 100);
      setTargetIssuePrice(selectedIPO.issuePrice || 100);
      analytics.ipoSelect("returns-calculator", selectedIPO.name);
    }
  }, [selectedIPO]);

  // Listing gain calculations
  const listingGainPercent = listingIssuePrice > 0 ? ((listingPrice - listingIssuePrice) / listingIssuePrice) * 100 : 0;
  const listingGainPerShare = listingPrice - listingIssuePrice;
  const listingTotalInvestment = listingIssuePrice * listingLotSize * listingLots;
  const listingCurrentValue = listingPrice * listingLotSize * listingLots;
  const listingTotalProfit = listingCurrentValue - listingTotalInvestment;

  // Current return calculations
  const currentReturnPercent = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;
  const currentTotalInvestment = buyPrice * quantity;
  const currentTotalValue = currentPrice * quantity;
  const currentTotalProfit = currentTotalValue - currentTotalInvestment;

  // Target price calculation
  const targetPrice = targetIssuePrice * (1 + desiredReturn / 100);
  const requiredGMP = targetPrice - targetIssuePrice;

  const isListingProfit = listingGainPercent >= 0;
  const isCurrentProfit = currentReturnPercent >= 0;

  return (
    <MainLayout>
      <Helmet>
        <title>IPO Returns Calculator - Calculate Listing Gains & Target Price | IPO Watch</title>
        <meta
          name="description"
          content="Calculate IPO listing gains, current returns, and target prices. Select any IPO to auto-load its data and analyze potential returns."
        />
      </Helmet>

      <section className="border-b">
        <div className="container py-5 md:py-8">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h1 className="text-xl md:text-2xl font-semibold">IPO Returns Calculator</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Calculate listing gains, current returns, and target prices for any IPO.
          </p>
        </div>
      </section>

      <div className="container py-4 md:py-6">
        <Card>
          <CardHeader className="border-b p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-medium">Select IPO or Enter Details</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Choose an IPO to auto-fill data or enter manually
                </CardDescription>
              </div>
              <IPOSelector
                value={selectedIPO}
                onSelect={setSelectedIPO}
                className="w-full sm:w-[280px]"
                initialData={initialIPOList}
              />
            </div>
            {selectedIPO && (
              <div className="flex items-center gap-2 mt-3">
                {selectedIPO.ipoType && (
                  <Badge variant="outline" className="text-xs">
                    {selectedIPO.ipoType.toUpperCase()}
                  </Badge>
                )}
                {selectedIPO.status && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedIPO.status}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Price: ₹{selectedIPO.issuePrice} • Lot: {selectedIPO.lotSize}
                </span>
                <Link href={`/ipo/${selectedIPO.slug}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  View Details <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="listing" className="space-y-4">
              <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-md grid grid-cols-3 gap-0.5">
                <TabsTrigger
                  value="listing"
                  className="py-2 text-xs rounded-md data-[state=active]:bg-background"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                  Listing Gain
                </TabsTrigger>
                <TabsTrigger
                  value="current"
                  className="py-2 text-xs rounded-md data-[state=active]:bg-background"
                >
                  <PieChart className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                  Current Return
                </TabsTrigger>
                <TabsTrigger
                  value="target"
                  className="py-2 text-xs rounded-md data-[state=active]:bg-background"
                >
                  <Target className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
                  Target Price
                </TabsTrigger>
              </TabsList>

              {/* Listing Gain Calculator */}
              <TabsContent value="listing" className="space-y-4">
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="listingIssuePrice" className="text-xs">Issue Price (₹)</Label>
                    <Input
                      id="listingIssuePrice"
                      type="number"
                      value={listingIssuePrice}
                      onChange={(e) => setListingIssuePrice(Number(e.target.value))}
                      min={0}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="listingPrice" className="text-xs">Listing Price (₹)</Label>
                    <Input
                      id="listingPrice"
                      type="number"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(Number(e.target.value))}
                      min={0}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="listingLotSize" className="text-xs">Lot Size</Label>
                    <Input
                      id="listingLotSize"
                      type="number"
                      value={listingLotSize}
                      onChange={(e) => setListingLotSize(Number(e.target.value))}
                      min={1}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="listingLots" className="text-xs">Lots Allotted</Label>
                    <Input
                      id="listingLots"
                      type="number"
                      value={listingLots}
                      onChange={(e) => setListingLots(Number(e.target.value))}
                      min={1}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Listing Gain</p>
                    <p className={`text-lg font-tabular font-medium ${isListingProfit ? "text-success" : "text-destructive"}`}>
                      {isListingProfit ? "+" : ""}{listingGainPercent.toFixed(1)}%
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Per Share</p>
                    <p className={`text-lg font-tabular font-medium ${isListingProfit ? "text-success" : "text-destructive"}`}>
                      {isListingProfit ? "+" : ""}₹{listingGainPerShare}
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Investment</p>
                    <p className="text-lg font-tabular font-medium">₹{listingTotalInvestment.toLocaleString()}</p>
                  </div>

                  <div className={`p-3 rounded-md border ${isListingProfit ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      {isListingProfit ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      {isListingProfit ? "Profit" : "Loss"}
                    </div>
                    <p className={`text-lg font-tabular font-medium ${isListingProfit ? "text-success" : "text-destructive"}`}>
                      {isListingProfit ? "+" : ""}₹{listingTotalProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Current Return Calculator */}
              <TabsContent value="current" className="space-y-4">
                <div className="grid gap-3 grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="buyPrice" className="text-xs">Buy Price (₹)</Label>
                    <Input
                      id="buyPrice"
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      min={0}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPrice" className="text-xs">Current Price (₹)</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(Number(e.target.value))}
                      min={0}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="quantity" className="text-xs">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min={1}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Return</p>
                    <p className={`text-lg font-tabular font-medium ${isCurrentProfit ? "text-success" : "text-destructive"}`}>
                      {isCurrentProfit ? "+" : ""}{currentReturnPercent.toFixed(1)}%
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Investment</p>
                    <p className="text-lg font-tabular font-medium">₹{currentTotalInvestment.toLocaleString()}</p>
                  </div>

                  <div className="p-3 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                    <p className="text-lg font-tabular font-medium">₹{currentTotalValue.toLocaleString()}</p>
                  </div>

                  <div className={`p-3 rounded-md border ${isCurrentProfit ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      {isCurrentProfit ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      {isCurrentProfit ? "Profit" : "Loss"}
                    </div>
                    <p className={`text-lg font-tabular font-medium ${isCurrentProfit ? "text-success" : "text-destructive"}`}>
                      {isCurrentProfit ? "+" : ""}₹{currentTotalProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Target Price Calculator */}
              <TabsContent value="target" className="space-y-4">
                <div className="grid gap-3 grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="targetIssuePrice" className="text-xs">Issue Price (₹)</Label>
                    <Input
                      id="targetIssuePrice"
                      type="number"
                      value={targetIssuePrice}
                      onChange={(e) => setTargetIssuePrice(Number(e.target.value))}
                      min={0}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="desiredReturn" className="text-xs">Desired Return (%)</Label>
                    <Input
                      id="desiredReturn"
                      type="number"
                      value={desiredReturn}
                      onChange={(e) => setDesiredReturn(Number(e.target.value))}
                      className="h-10 text-sm font-tabular"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 grid-cols-2">
                  <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Target className="h-3 w-3 text-primary" />
                      Target Listing Price
                    </div>
                    <p className="text-2xl font-tabular font-medium text-primary">₹{targetPrice.toFixed(0)}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      For {desiredReturn}% return
                    </p>
                  </div>

                  <div className="p-4 rounded-md bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-1">Required GMP</p>
                    <p className={`text-2xl font-tabular font-medium ${requiredGMP >= 0 ? "text-success" : "text-destructive"}`}>
                      {requiredGMP >= 0 ? "+" : ""}₹{requiredGMP.toFixed(0)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      GMP needed for target
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <p className="text-[10px] text-muted-foreground text-center mt-5">
              * For educational purposes only.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
