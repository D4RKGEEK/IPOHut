import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Users, IndianRupee, Percent, PiggyBank } from "lucide-react";

export function IPOInvestmentCalculator() {
  const [issuePrice, setIssuePrice] = useState<number>(100);
  const [lotSize, setLotSize] = useState<number>(100);
  const [gmp, setGmp] = useState<number>(50);
  const [numLots, setNumLots] = useState<number>(1);
  const [totalApplications, setTotalApplications] = useState<number>(100000);
  const [retailShares, setRetailShares] = useState<number>(1000000);

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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Calculator className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display">IPO Investment Calculator</CardTitle>
            <CardDescription>
              Calculate your investment, expected returns, and allotment chances
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Input Section */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="issuePrice" className="text-sm font-medium">Issue Price (₹)</Label>
            <Input
              id="issuePrice"
              type="number"
              value={issuePrice}
              onChange={(e) => setIssuePrice(Number(e.target.value))}
              min={0}
              className="h-12 text-lg font-tabular"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lotSize" className="text-sm font-medium">Lot Size</Label>
            <Input
              id="lotSize"
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(Number(e.target.value))}
              min={1}
              className="h-12 text-lg font-tabular"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gmp" className="text-sm font-medium">Current GMP (₹)</Label>
            <Input
              id="gmp"
              type="number"
              value={gmp}
              onChange={(e) => setGmp(Number(e.target.value))}
              className="h-12 text-lg font-tabular"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numLots" className="text-sm font-medium">Number of Lots</Label>
            <Input
              id="numLots"
              type="number"
              value={numLots}
              onChange={(e) => setNumLots(Number(e.target.value))}
              min={1}
              max={13}
              className="h-12 text-lg font-tabular"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalApplications" className="text-sm font-medium">Est. Total Applications</Label>
            <Input
              id="totalApplications"
              type="number"
              value={totalApplications}
              onChange={(e) => setTotalApplications(Number(e.target.value))}
              min={1}
              className="h-12 text-lg font-tabular"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retailShares" className="text-sm font-medium">Retail Shares Offered</Label>
            <Input
              id="retailShares"
              type="number"
              value={retailShares}
              onChange={(e) => setRetailShares(Number(e.target.value))}
              min={1}
              className="h-12 text-lg font-tabular"
            />
          </div>
        </div>

        <Separator />

        {/* Results Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 rounded-2xl bg-muted/50 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <IndianRupee className="h-4 w-4" />
              Investment per Lot
            </div>
            <p className="text-2xl font-display font-bold font-tabular">₹{investmentPerLot.toLocaleString()}</p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/50 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <PiggyBank className="h-4 w-4" />
              Total Investment
            </div>
            <p className="text-2xl font-display font-bold font-tabular">₹{totalInvestment.toLocaleString()}</p>
          </div>

          <div className={`p-5 rounded-2xl border ${isPositive ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              Expected Profit
            </div>
            <p className={`text-2xl font-display font-bold font-tabular ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? "+" : ""}₹{totalExpectedProfit.toLocaleString()}
            </p>
            <p className={`text-sm font-tabular mt-1 ${isPositive ? "text-success/80" : "text-destructive/80"}`}>
              {percentReturn >= 0 ? "+" : ""}{percentReturn.toFixed(1)}% return
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/50 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              Allotment Chance
            </div>
            <p className="text-2xl font-display font-bold font-tabular">{allotmentRatio.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Based on est. applications
            </p>
          </div>
        </div>

        {/* Listing Price Highlight */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Listing Price</p>
              <p className="text-4xl font-display font-bold text-primary font-tabular">
                ₹{estimatedListingPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Issue Price</p>
              <p className="text-2xl font-display font-semibold font-tabular">₹{issuePrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * GMP is indicative and actual listing price may vary. Allotment probability is an estimate based on assumed applications.
        </p>
      </CardContent>
    </Card>
  );
}