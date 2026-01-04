import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Users, IndianRupee, PiggyBank } from "lucide-react";

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
    <Card>
      <CardHeader className="border-b p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <div>
            <CardTitle className="text-base font-medium">IPO Investment Calculator</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Calculate returns and allotment chances
            </CardDescription>
          </div>
        </div>
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
            <Label htmlFor="totalApplications" className="text-xs">Total Applications</Label>
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
            <Label htmlFor="retailShares" className="text-xs">Retail Shares</Label>
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
  );
}
