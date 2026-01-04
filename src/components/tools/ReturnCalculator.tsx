import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export function ReturnCalculator() {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Return Calculator
        </CardTitle>
        <CardDescription>
          Calculate listing gains, current returns, and target prices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="listing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listing">Listing Gain</TabsTrigger>
            <TabsTrigger value="current">Current Return</TabsTrigger>
            <TabsTrigger value="target">Target Price</TabsTrigger>
          </TabsList>

          {/* Listing Gain Calculator */}
          <TabsContent value="listing" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="listingIssuePrice">Issue Price (₹)</Label>
                <Input
                  id="listingIssuePrice"
                  type="number"
                  value={listingIssuePrice}
                  onChange={(e) => setListingIssuePrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingPrice">Listing Price (₹)</Label>
                <Input
                  id="listingPrice"
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingLotSize">Lot Size</Label>
                <Input
                  id="listingLotSize"
                  type="number"
                  value={listingLotSize}
                  onChange={(e) => setListingLotSize(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingLots">Lots Allotted</Label>
                <Input
                  id="listingLots"
                  type="number"
                  value={listingLots}
                  onChange={(e) => setListingLots(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Listing Gain</p>
                  <p className={`text-2xl font-bold ${isListingProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {isListingProfit ? "+" : ""}{listingGainPercent.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Gain per Share</p>
                  <p className={`text-2xl font-bold ${isListingProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {isListingProfit ? "+" : ""}₹{listingGainPerShare.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                  <p className="text-2xl font-bold">₹{listingTotalInvestment.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className={isListingProfit ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    {isListingProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    Total {isListingProfit ? "Profit" : "Loss"}
                  </div>
                  <p className={`text-2xl font-bold ${isListingProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {isListingProfit ? "+" : ""}₹{listingTotalProfit.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Current Return Calculator */}
          <TabsContent value="current" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="buyPrice">Buy Price (₹)</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPrice">Current Price (₹)</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Return</p>
                  <p className={`text-2xl font-bold ${isCurrentProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {isCurrentProfit ? "+" : ""}{currentReturnPercent.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Investment</p>
                  <p className="text-2xl font-bold">₹{currentTotalInvestment.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                  <p className="text-2xl font-bold">₹{currentTotalValue.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className={isCurrentProfit ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    {isCurrentProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {isCurrentProfit ? "Profit" : "Loss"}
                  </div>
                  <p className={`text-2xl font-bold ${isCurrentProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {isCurrentProfit ? "+" : ""}₹{currentTotalProfit.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Target Price Calculator */}
          <TabsContent value="target" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetIssuePrice">Issue Price (₹)</Label>
                <Input
                  id="targetIssuePrice"
                  type="number"
                  value={targetIssuePrice}
                  onChange={(e) => setTargetIssuePrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredReturn">Desired Return (%)</Label>
                <Input
                  id="desiredReturn"
                  type="number"
                  value={desiredReturn}
                  onChange={(e) => setDesiredReturn(Number(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    Required Listing Price
                  </div>
                  <p className="text-3xl font-bold text-primary">₹{targetPrice.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    For {desiredReturn}% return
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Required GMP</p>
                  <p className={`text-3xl font-bold ${requiredGMP >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {requiredGMP >= 0 ? "+" : ""}₹{requiredGMP.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    GMP needed to achieve target
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-6">
          * All calculations are for educational purposes only. Actual returns may vary.
        </p>
      </CardContent>
    </Card>
  );
}
