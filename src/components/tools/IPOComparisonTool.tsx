import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GitCompare, Plus, Trash2, Trophy } from "lucide-react";

interface IPOData {
  id: string;
  name: string;
  issuePrice: number;
  lotSize: number;
  gmp: number;
  subscription: number;
  issueSize: number;
}

const defaultIPO: IPOData = {
  id: crypto.randomUUID(),
  name: "",
  issuePrice: 0,
  lotSize: 0,
  gmp: 0,
  subscription: 0,
  issueSize: 0,
};

export function IPOComparisonTool() {
  const [ipos, setIpos] = useState<IPOData[]>([
    { ...defaultIPO, id: crypto.randomUUID(), name: "IPO 1" },
    { ...defaultIPO, id: crypto.randomUUID(), name: "IPO 2" },
  ]);

  const addIPO = () => {
    if (ipos.length < 5) {
      setIpos([...ipos, { ...defaultIPO, id: crypto.randomUUID(), name: `IPO ${ipos.length + 1}` }]);
    }
  };

  const removeIPO = (id: string) => {
    if (ipos.length > 2) {
      setIpos(ipos.filter((ipo) => ipo.id !== id));
    }
  };

  const updateIPO = (id: string, field: keyof IPOData, value: string | number) => {
    setIpos(ipos.map((ipo) => 
      ipo.id === id ? { ...ipo, [field]: value } : ipo
    ));
  };

  // Calculate derived values
  const calculateMetrics = (ipo: IPOData) => {
    const minInvestment = ipo.issuePrice * ipo.lotSize;
    const estimatedListing = ipo.issuePrice + ipo.gmp;
    const expectedReturn = ipo.issuePrice > 0 ? ((ipo.gmp / ipo.issuePrice) * 100) : 0;
    const profitPerLot = ipo.gmp * ipo.lotSize;
    return { minInvestment, estimatedListing, expectedReturn, profitPerLot };
  };

  // Find best values for highlighting
  const getBestValue = (field: string) => {
    const values = ipos.map((ipo) => {
      const metrics = calculateMetrics(ipo);
      switch (field) {
        case "expectedReturn": return metrics.expectedReturn;
        case "minInvestment": return metrics.minInvestment;
        case "profitPerLot": return metrics.profitPerLot;
        case "subscription": return ipo.subscription;
        default: return 0;
      }
    });
    
    if (field === "minInvestment") {
      return Math.min(...values.filter(v => v > 0));
    }
    return Math.max(...values);
  };

  return (
    <Card>
      <CardHeader className="border-b p-4 md:p-6">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-chart-3" />
          <div>
            <CardTitle className="text-base font-medium">IPO Comparison</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Compare multiple IPOs side by side
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-5">
        {/* IPO Input Cards - Horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 min-w-max md:min-w-0">
            {ipos.map((ipo) => (
              <Card key={ipo.id} className="relative w-64 md:w-auto shrink-0 border">
                <CardContent className="p-3 space-y-3">
                  {ipos.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeIPO(ipo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">IPO Name</Label>
                    <Input
                      value={ipo.name}
                      onChange={(e) => updateIPO(ipo.id, "name", e.target.value)}
                      placeholder="Enter name"
                      className="h-9 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Price (₹)</Label>
                      <Input
                        type="number"
                        value={ipo.issuePrice || ""}
                        onChange={(e) => updateIPO(ipo.id, "issuePrice", Number(e.target.value))}
                        className="h-8 text-xs font-tabular"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Lot Size</Label>
                      <Input
                        type="number"
                        value={ipo.lotSize || ""}
                        onChange={(e) => updateIPO(ipo.id, "lotSize", Number(e.target.value))}
                        className="h-8 text-xs font-tabular"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">GMP (₹)</Label>
                      <Input
                        type="number"
                        value={ipo.gmp || ""}
                        onChange={(e) => updateIPO(ipo.id, "gmp", Number(e.target.value))}
                        className="h-8 text-xs font-tabular"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Subs (x)</Label>
                      <Input
                        type="number"
                        value={ipo.subscription || ""}
                        onChange={(e) => updateIPO(ipo.id, "subscription", Number(e.target.value))}
                        className="h-8 text-xs font-tabular"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {ipos.length < 5 && (
              <Card 
                className="border border-dashed cursor-pointer hover:bg-muted/30 flex items-center justify-center w-64 md:w-auto shrink-0 min-h-[180px]"
                onClick={addIPO}
              >
                <CardContent className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Add IPO</span>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Comparison Results - Mobile optimized */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground">Comparison</h3>
          <div className="border rounded-md divide-y text-sm">
            {/* Header */}
            <div className="flex bg-muted/50 text-xs">
              <div className="w-24 shrink-0 p-2 font-medium">Metric</div>
              {ipos.map((ipo) => (
                <div key={ipo.id} className="flex-1 p-2 text-center font-medium truncate">
                  {ipo.name || "—"}
                </div>
              ))}
            </div>
            
            {/* Rows */}
            <div className="flex text-xs">
              <div className="w-24 shrink-0 p-2 text-muted-foreground">Investment</div>
              {ipos.map((ipo) => {
                const metrics = calculateMetrics(ipo);
                const isBest = metrics.minInvestment === getBestValue("minInvestment") && metrics.minInvestment > 0;
                return (
                  <div key={ipo.id} className="flex-1 p-2 text-center font-tabular">
                    <span className={isBest ? "text-success" : ""}>
                      ₹{(metrics.minInvestment / 1000).toFixed(0)}k
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex text-xs bg-muted/30">
              <div className="w-24 shrink-0 p-2 text-muted-foreground">Return</div>
              {ipos.map((ipo) => {
                const metrics = calculateMetrics(ipo);
                const isBest = metrics.expectedReturn === getBestValue("expectedReturn") && metrics.expectedReturn > 0;
                return (
                  <div key={ipo.id} className="flex-1 p-2 text-center font-tabular">
                    <span className={`flex items-center justify-center gap-0.5 ${isBest ? "text-success font-medium" : ""}`}>
                      {isBest && <Trophy className="h-2.5 w-2.5" />}
                      {metrics.expectedReturn >= 0 ? "+" : ""}{metrics.expectedReturn.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex text-xs">
              <div className="w-24 shrink-0 p-2 text-muted-foreground">Profit/Lot</div>
              {ipos.map((ipo) => {
                const metrics = calculateMetrics(ipo);
                const isBest = metrics.profitPerLot === getBestValue("profitPerLot") && metrics.profitPerLot > 0;
                return (
                  <div key={ipo.id} className="flex-1 p-2 text-center font-tabular">
                    <span className={`flex items-center justify-center gap-0.5 ${isBest ? "text-success font-medium" : ""}`}>
                      {isBest && <Trophy className="h-2.5 w-2.5" />}
                      ₹{metrics.profitPerLot.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex text-xs bg-muted/30">
              <div className="w-24 shrink-0 p-2 text-muted-foreground">Subs</div>
              {ipos.map((ipo) => (
                <div key={ipo.id} className="flex-1 p-2 text-center font-tabular">
                  {ipo.subscription}x
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <Trophy className="h-2.5 w-2.5 text-success" />
          Trophy = best value
        </p>
      </CardContent>
    </Card>
  );
}
