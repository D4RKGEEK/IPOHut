import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, TrendingDown, Target, BarChart3, PieChart } from "lucide-react";

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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/20 rounded-xl">
            <BarChart3 className="h-6 w-6 text-accent" />
          </div>
          <div>
            <CardTitle className="font-display">Return Calculator</CardTitle>
            <CardDescription>
              Calculate listing gains, current returns, and target prices
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="listing" className="space-y-6">
          <TabsList className="w-full h-auto p-1.5 bg-muted/50 rounded-xl grid grid-cols-3 gap-1">
            <TabsTrigger 
              value="listing" 
              className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft font-medium"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Listing Gain
            </TabsTrigger>
            <TabsTrigger 
              value="current" 
              className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft font-medium"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Current
            </TabsTrigger>
            <TabsTrigger 
              value="target" 
              className="py-3 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft font-medium"
            >
              <Target className="h-4 w-4 mr-2" />
              Target
            </TabsTrigger>
          </TabsList>

          {/* Listing Gain Calculator */}
          <TabsContent value="listing" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="listingIssuePrice" className="text-sm font-medium">Issue Price (₹)</Label>
                <Input
                  id="listingIssuePrice"
                  type="number"
                  value={listingIssuePrice}
                  onChange={(e) => setListingIssuePrice(Number(e.target.value))}
                  min={0}
                  className="h-12 text-lg font-tabular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingPrice" className="text-sm font-medium">Listing Price (₹)</Label>
                <Input
                  id="listingPrice"
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(Number(e.target.value))}
                  min={0}
                  className="h-12 text-lg font-tabular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingLotSize" className="text-sm font-medium">Lot Size</Label>
                <Input
                  id="listingLotSize"
                  type="number"
                  value={listingLotSize}
                  onChange={(e) => setListingLotSize(Number(e.target.value))}
                  min={1}
                  className="h-12 text-lg font-tabular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listingLots" className="text-sm font-medium">Lots Allotted</Label>
                <Input
                  id="listingLots"
                  type="number"
                  value={listingLots}
                  onChange={(e) => setListingLots(Number(e.target.value))}
                  min={1}
                  className="h-12 text-lg font-tabular"
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Listing Gain</p>
                <p className={`text-2xl font-display font-bold font-tabular ${isListingProfit ? "text-success" : "text-destructive"}`}>
                  {isListingProfit ? "+" : ""}{listingGainPercent.toFixed(2)}%
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Gain per Share</p>
                <p className={`text-2xl font-display font-bold font-tabular ${isListingProfit ? "text-success" : "text-destructive"}`}>
                  {isListingProfit ? "+" : ""}₹{listingGainPerShare.toLocaleString()}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Total Investment</p>
                <p className="text-2xl font-display font-bold font-tabular">₹{listingTotalInvestment.toLocaleString()}</p>
              </div>

              <div className={`p-5 rounded-2xl border ${isListingProfit ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {isListingProfit ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                  Total {isListingProfit ? "Profit" : "Loss"}
                </div>
                <p className={`text-2xl font-display font-bold font-tabular ${isListingProfit ? "text-success" : "text-destructive"}`}>
                  {isListingProfit ? "+" : ""}₹{listingTotalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Current Return Calculator */}
          <TabsContent value="current" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="buyPrice" className="text-sm font-medium">Buy Price (₹)</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  min={0}
                  className="h-12 text-lg font-tabular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPrice" className="text-sm font-medium">Current Price (₹)</Label>
                <Input
                  id="currentPrice"
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  min={0}
                  className="h-12 text-lg font-tabular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                  className="h-12 text-lg font-tabular"
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Return</p>
                <p className={`text-2xl font-display font-bold font-tabular ${isCurrentProfit ? "text-success" : "text-destructive"}`}>
                  {isCurrentProfit ? "+" : ""}{currentReturnPercent.toFixed(2)}%
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Investment</p>
                <p className="text-2xl font-display font-bold font-tabular">₹{currentTotalInvestment.toLocaleString()}</p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Current Value</p>
                <p className="text-2xl font-display font-bold font-tabular">₹{currentTotalValue.toLocaleString()}</p>
              </div>

              <div className={`p-5 rounded-2xl border ${isCurrentProfit ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {isCurrentProfit ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                  {isCurrentProfit ? "Profit" : "Loss"}
                </div>
                <p className={`text-2xl font-display font-bold font-tabular ${isCurrentProfit ? "text-success" : "text-destructive"}`}>
                  {isCurrentProfit ? "+" : ""}₹{currentTotalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Target Price Calculator */}
          <TabsContent value="target" className="space-y-6 animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetIssuePrice" className="text-sm font-medium">Issue Price (₹)</Label>
                <Input
                  id="targetIssuePrice"
                  type="number"
                  value={targetIssuePrice}
                  onChange={(e) => setTargetIssuePrice(Number(e.target.value))}
                  min={0}
                  className="h-12 text-lg font-tabular"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredReturn" className="text-sm font-medium">Desired Return (%)</Label>
                <Input
                  id="desiredReturn"
                  type="number"
                  value={desiredReturn}
                  onChange={(e) => setDesiredReturn(Number(e.target.value))}
                  className="h-12 text-lg font-tabular"
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  Required Listing Price
                </div>
                <p className="text-4xl font-display font-bold text-primary font-tabular">₹{targetPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  For {desiredReturn}% return on investment
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-2">Required GMP</p>
                <p className={`text-4xl font-display font-bold font-tabular ${requiredGMP >= 0 ? "text-success" : "text-destructive"}`}>
                  {requiredGMP >= 0 ? "+" : ""}₹{requiredGMP.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  GMP needed to achieve your target
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-8">
          * All calculations are for educational purposes only. Actual returns may vary based on market conditions.
        </p>
      </CardContent>
    </Card>
  );
}