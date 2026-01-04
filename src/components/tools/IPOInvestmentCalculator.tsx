import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Users, IndianRupee } from "lucide-react";

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
  const sharesApplied = numLots * lotSize;
  const totalSharesApplied = totalApplications * lotSize;
  const allotmentRatio = retailShares > 0 && totalSharesApplied > 0 
    ? Math.min((retailShares / totalSharesApplied) * 100, 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          IPO Investment Calculator
        </CardTitle>
        <CardDescription>
          Calculate your investment, expected returns, and allotment chances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="issuePrice">Issue Price (₹)</Label>
            <Input
              id="issuePrice"
              type="number"
              value={issuePrice}
              onChange={(e) => setIssuePrice(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lotSize">Lot Size</Label>
            <Input
              id="lotSize"
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gmp">Current GMP (₹)</Label>
            <Input
              id="gmp"
              type="number"
              value={gmp}
              onChange={(e) => setGmp(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numLots">Number of Lots</Label>
            <Input
              id="numLots"
              type="number"
              value={numLots}
              onChange={(e) => setNumLots(Number(e.target.value))}
              min={1}
              max={13}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalApplications">Est. Total Applications</Label>
            <Input
              id="totalApplications"
              type="number"
              value={totalApplications}
              onChange={(e) => setTotalApplications(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retailShares">Retail Shares Offered</Label>
            <Input
              id="retailShares"
              type="number"
              value={retailShares}
              onChange={(e) => setRetailShares(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <Separator />

        {/* Results Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <IndianRupee className="h-4 w-4" />
                Investment per Lot
              </div>
              <p className="text-2xl font-bold">₹{investmentPerLot.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <IndianRupee className="h-4 w-4" />
                Total Investment
              </div>
              <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className={gmp >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                Expected Profit
              </div>
              <p className={`text-2xl font-bold ${gmp >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {gmp >= 0 ? "+" : ""}₹{totalExpectedProfit.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {percentReturn >= 0 ? "+" : ""}{percentReturn.toFixed(1)}% return
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                Allotment Chance
              </div>
              <p className="text-2xl font-bold">{allotmentRatio.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on est. applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Listing Price */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Listing Price</p>
                <p className="text-3xl font-bold text-primary">₹{estimatedListingPrice.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Issue Price</p>
                <p className="text-xl font-semibold">₹{issuePrice.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          * GMP is indicative and actual listing price may vary. Allotment probability is an estimate.
        </p>
      </CardContent>
    </Card>
  );
}
