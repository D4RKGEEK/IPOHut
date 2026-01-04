import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { IPOSelector, SelectedIPO } from "@/components/shared/IPOSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Users, IndianRupee, PiggyBank, ArrowLeft, ExternalLink } from "lucide-react";
import { analytics, useScrollTracking, useTimeOnPage } from "@/hooks/useAnalytics";

export default function InvestmentCalculatorPage() {
  const [selectedIPO, setSelectedIPO] = useState<SelectedIPO | null>(null);
  const [issuePrice, setIssuePrice] = useState<number>(100);
  const [lotSize, setLotSize] = useState<number>(100);
  const [gmp, setGmp] = useState<number>(50);
  const [numLots, setNumLots] = useState<number>(1);
  const [totalApplications, setTotalApplications] = useState<number>(100000);
  const [retailShares, setRetailShares] = useState<number>(1000000);

  // Track page
  useScrollTracking("investment-calculator");
  useTimeOnPage("investment-calculator");

  // Auto-fill when IPO is selected
  useEffect(() => {
    if (selectedIPO) {
      setIssuePrice(selectedIPO.issuePrice || 100);
      setLotSize(selectedIPO.lotSize || 100);
      setGmp(selectedIPO.gmp || 0);
      analytics.ipoSelect("investment-calculator", selectedIPO.name);
    }
  }, [selectedIPO]);

  // Calculations
  const investmentPerLot = issuePrice * lotSize;
  const totalInvestment = investmentPerLot * numLots;
  const estimatedListingPrice = issuePrice + gmp;
  const profitPerLot = gmp * lotSize;
  const totalExpectedProfit = profitPerLot * numLots;
  const percentReturn = issuePrice > 0 ? ((gmp / issuePrice) * 100) : 0;

  // Allotment probability calculation
  const totalSharesApplied = totalApplications * lotSize;
  const allotmentRatio = retailShares > 0 && totalSharesApplied > 0 
    ? Math.min((retailShares / totalSharesApplied) * 100, 100) 
    : 0;

  const isPositive = gmp >= 0;

  return (
    <MainLayout>
      <Helmet>
        <title>IPO Investment Calculator - Calculate Returns & Allotment Chances | IPO Watch</title>
        <meta 
          name="description" 
          content="Calculate IPO investment returns, expected profit, and allotment probability. Select any IPO to auto-load its data." 
        />
      </Helmet>

      <section className="border-b">
        <div className="container py-5 md:py-8">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="h-5 w-5 text-primary" />
            <h1 className="text-xl md:text-2xl font-semibold">IPO Investment Calculator</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Calculate returns, profit per lot, and allotment chances for any IPO.
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
                <Link to={`/ipo/${selectedIPO.slug}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  View Details <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-5">
            {/* Input Section */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="issuePrice" className="text-xs">Issue Price (₹)</Label>
                <Input
                  id="issuePrice"
                  type="number"
                  value={issuePrice}
                  onChange={(e) => setIssuePrice(Number(e.target.value))}
                  min={0}
                  className="h-10 text-sm font-tabular"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lotSize" className="text-xs">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  value={lotSize}
                  onChange={(e) => setLotSize(Number(e.target.value))}
                  min={1}
                  className="h-10 text-sm font-tabular"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gmp" className="text-xs">GMP (₹)</Label>
                <Input
                  id="gmp"
                  type="number"
                  value={gmp}
                  onChange={(e) => setGmp(Number(e.target.value))}
                  className="h-10 text-sm font-tabular"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="numLots" className="text-xs">No. of Lots</Label>
                <Input
                  id="numLots"
                  type="number"
                  value={numLots}
                  onChange={(e) => setNumLots(Number(e.target.value))}
                  min={1}
                  max={13}
                  className="h-10 text-sm font-tabular"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="totalApplications" className="text-xs">Total Applications (Est.)</Label>
                <Input
                  id="totalApplications"
                  type="number"
                  value={totalApplications}
                  onChange={(e) => setTotalApplications(Number(e.target.value))}
                  min={1}
                  className="h-10 text-sm font-tabular"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="retailShares" className="text-xs">Retail Shares (Est.)</Label>
                <Input
                  id="retailShares"
                  type="number"
                  value={retailShares}
                  onChange={(e) => setRetailShares(Number(e.target.value))}
                  min={1}
                  className="h-10 text-sm font-tabular"
                />
              </div>
            </div>

            <Separator />

            {/* Results Section */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <div className="p-3 rounded-md bg-muted/50 border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <IndianRupee className="h-3 w-3" />
                  Per Lot
                </div>
                <p className="text-lg font-tabular font-medium">₹{investmentPerLot.toLocaleString()}</p>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <PiggyBank className="h-3 w-3" />
                  Total Investment
                </div>
                <p className="text-lg font-tabular font-medium">₹{totalInvestment.toLocaleString()}</p>
              </div>

              <div className={`p-3 rounded-md border ${isPositive ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="h-3 w-3" />
                  Expected Profit
                </div>
                <p className={`text-lg font-tabular font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                  {isPositive ? "+" : ""}₹{totalExpectedProfit.toLocaleString()}
                </p>
                <p className={`text-xs font-tabular ${isPositive ? "text-success/70" : "text-destructive/70"}`}>
                  {percentReturn >= 0 ? "+" : ""}{percentReturn.toFixed(1)}%
                </p>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Users className="h-3 w-3" />
                  Allotment
                </div>
                <p className="text-lg font-tabular font-medium">{allotmentRatio.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">chance</p>
              </div>
            </div>

            {/* Listing Price */}
            <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Est. Listing Price</p>
                  <p className="text-2xl font-tabular font-medium text-primary">
                    ₹{estimatedListingPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Issue Price</p>
                  <p className="text-lg font-tabular font-medium">₹{issuePrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              * GMP is indicative. Actual listing price may vary.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
