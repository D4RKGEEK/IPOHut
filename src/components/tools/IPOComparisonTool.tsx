import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-chart-3/5 to-transparent border-b">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-chart-3/10 rounded-xl">
            <GitCompare className="h-6 w-6 text-chart-3" />
          </div>
          <div>
            <CardTitle className="font-display">IPO Comparison Tool</CardTitle>
            <CardDescription>
              Compare multiple IPOs side by side to find the best opportunity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* IPO Input Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ipos.map((ipo, index) => (
            <Card key={ipo.id} className="relative border-2 hover:border-primary/30 transition-colors">
              <CardContent className="pt-5 space-y-4">
                {ipos.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeIPO(ipo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">IPO Name</Label>
                  <Input
                    value={ipo.name}
                    onChange={(e) => updateIPO(ipo.id, "name", e.target.value)}
                    placeholder="Enter IPO name"
                    className="h-11"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Issue Price (₹)</Label>
                    <Input
                      type="number"
                      value={ipo.issuePrice || ""}
                      onChange={(e) => updateIPO(ipo.id, "issuePrice", Number(e.target.value))}
                      className="font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Lot Size</Label>
                    <Input
                      type="number"
                      value={ipo.lotSize || ""}
                      onChange={(e) => updateIPO(ipo.id, "lotSize", Number(e.target.value))}
                      className="font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">GMP (₹)</Label>
                    <Input
                      type="number"
                      value={ipo.gmp || ""}
                      onChange={(e) => updateIPO(ipo.id, "gmp", Number(e.target.value))}
                      className="font-tabular"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Subscription (x)</Label>
                    <Input
                      type="number"
                      value={ipo.subscription || ""}
                      onChange={(e) => updateIPO(ipo.id, "subscription", Number(e.target.value))}
                      className="font-tabular"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Issue Size (₹ Cr)</Label>
                  <Input
                    type="number"
                    value={ipo.issueSize || ""}
                    onChange={(e) => updateIPO(ipo.id, "issueSize", Number(e.target.value))}
                    className="font-tabular"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {ipos.length < 5 && (
            <Card 
              className="border-2 border-dashed cursor-pointer hover:bg-muted/30 hover:border-primary/40 transition-all flex items-center justify-center min-h-[280px] group"
              onClick={addIPO}
            >
              <CardContent className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                <div className="p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                  <Plus className="h-8 w-8" />
                </div>
                <span className="font-medium">Add IPO</span>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="min-w-[140px] font-display font-semibold">Metric</TableHead>
                {ipos.map((ipo) => (
                  <TableHead key={ipo.id} className="min-w-[120px] text-center font-display font-semibold">
                    {ipo.name || "—"}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Issue Price</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center font-tabular">
                    ₹{ipo.issuePrice.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lot Size</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center font-tabular">
                    {ipo.lotSize.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Min Investment</TableCell>
                {ipos.map((ipo) => {
                  const metrics = calculateMetrics(ipo);
                  const isBest = metrics.minInvestment === getBestValue("minInvestment") && metrics.minInvestment > 0;
                  return (
                    <TableCell key={ipo.id} className="text-center">
                      <span className={`font-tabular ${isBest ? "text-success font-semibold inline-flex items-center gap-1" : ""}`}>
                        {isBest && <Trophy className="h-3.5 w-3.5" />}
                        ₹{metrics.minInvestment.toLocaleString()}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GMP</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className={`text-center font-tabular font-semibold ${ipo.gmp >= 0 ? "text-success" : "text-destructive"}`}>
                    {ipo.gmp >= 0 ? "+" : ""}₹{ipo.gmp}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium">Expected Return</TableCell>
                {ipos.map((ipo) => {
                  const metrics = calculateMetrics(ipo);
                  const isBest = metrics.expectedReturn === getBestValue("expectedReturn") && metrics.expectedReturn > 0;
                  return (
                    <TableCell key={ipo.id} className="text-center">
                      <span className={`font-tabular font-semibold inline-flex items-center gap-1 justify-center ${isBest ? "text-success" : ""}`}>
                        {isBest && <Trophy className="h-3.5 w-3.5" />}
                        {metrics.expectedReturn >= 0 ? "+" : ""}{metrics.expectedReturn.toFixed(1)}%
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium">Profit per Lot</TableCell>
                {ipos.map((ipo) => {
                  const metrics = calculateMetrics(ipo);
                  const isBest = metrics.profitPerLot === getBestValue("profitPerLot") && metrics.profitPerLot > 0;
                  return (
                    <TableCell key={ipo.id} className="text-center">
                      <span className={`font-tabular font-semibold inline-flex items-center gap-1 justify-center ${isBest ? "text-success" : ""}`}>
                        {isBest && <Trophy className="h-3.5 w-3.5" />}
                        {metrics.profitPerLot >= 0 ? "+" : ""}₹{metrics.profitPerLot.toLocaleString()}
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Subscription</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center font-tabular">
                    {ipo.subscription}x
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Issue Size</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center font-tabular">
                    ₹{ipo.issueSize} Cr
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-success" />
          Trophy indicates the best value for each metric
        </p>
      </CardContent>
    </Card>
  );
}