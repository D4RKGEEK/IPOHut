import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/api";
import { Calculator, TrendingUp, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface GMPCalculatorProps {
  issuePrice: number;
  gmp: number;
  lotSize: number;
  className?: string;
}

export function GMPCalculator({ issuePrice, gmp, lotSize, className }: GMPCalculatorProps) {
  const [lots, setLots] = useState(1);
  
  const estimatedListingPrice = issuePrice + gmp;
  const investmentPerLot = issuePrice * lotSize;
  const totalInvestment = investmentPerLot * lots;
  const estimatedProfit = gmp * lotSize * lots;
  const percentReturn = ((gmp / issuePrice) * 100);

  const isProfit = gmp >= 0;

  return (
    <Card className={cn("border", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4 text-primary" />
          Profit Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="lots" className="text-sm">Number of Lots</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLots(Math.max(1, lots - 1))}
              disabled={lots <= 1}
            >
              -
            </Button>
            <Input
              id="lots"
              type="number"
              min={1}
              max={100}
              value={lots}
              onChange={(e) => setLots(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="text-center font-tabular w-20"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLots(Math.min(100, lots + 1))}
              disabled={lots >= 100}
            >
              +
            </Button>
          </div>
        </div>

        {/* Calculation breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Issue Price</span>
            <span className="font-tabular">{formatCurrency(issuePrice)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Current GMP</span>
            <span className={cn("font-tabular", isProfit ? "text-success" : "text-destructive")}>
              {isProfit ? "+" : ""}{formatCurrency(gmp)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Est. Listing Price</span>
            <span className="font-tabular font-medium">{formatCurrency(estimatedListingPrice)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Lot Size</span>
            <span className="font-tabular">{lotSize} shares</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Total Investment</span>
            <span className="font-tabular">{formatCurrency(totalInvestment)}</span>
          </div>
        </div>

        {/* Result */}
        <div className={cn(
          "rounded-md p-4 text-center",
          isProfit ? "bg-success/10" : "bg-destructive/10"
        )}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <IndianRupee className="h-5 w-5 text-destructive" />
            )}
            <span className="text-sm text-muted-foreground">
              {isProfit ? "Expected Profit" : "Expected Loss"}
            </span>
          </div>
          <div className={cn(
            "text-2xl font-bold font-tabular",
            isProfit ? "text-success" : "text-destructive"
          )}>
            {isProfit ? "+" : ""}{formatCurrency(estimatedProfit)}
          </div>
          <div className={cn(
            "text-sm font-tabular mt-1",
            isProfit ? "text-success/80" : "text-destructive/80"
          )}>
            ({isProfit ? "+" : ""}{percentReturn.toFixed(2)}% return)
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Based on current GMP. Actual listing price may vary.
        </p>
      </CardContent>
    </Card>
  );
}
