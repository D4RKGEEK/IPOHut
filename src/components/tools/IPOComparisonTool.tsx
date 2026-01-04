import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitCompare, Plus, Trash2 } from "lucide-react";

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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-primary" />
          IPO Comparison Tool
        </CardTitle>
        <CardDescription>
          Compare multiple IPOs side by side
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* IPO Input Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ipos.map((ipo) => (
            <Card key={ipo.id} className="relative">
              <CardContent className="pt-4 space-y-3">
                {ipos.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeIPO(ipo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
                
                <div className="space-y-2">
                  <Label>IPO Name</Label>
                  <Input
                    value={ipo.name}
                    onChange={(e) => updateIPO(ipo.id, "name", e.target.value)}
                    placeholder="Enter IPO name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Issue Price (₹)</Label>
                    <Input
                      type="number"
                      value={ipo.issuePrice || ""}
                      onChange={(e) => updateIPO(ipo.id, "issuePrice", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Lot Size</Label>
                    <Input
                      type="number"
                      value={ipo.lotSize || ""}
                      onChange={(e) => updateIPO(ipo.id, "lotSize", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">GMP (₹)</Label>
                    <Input
                      type="number"
                      value={ipo.gmp || ""}
                      onChange={(e) => updateIPO(ipo.id, "gmp", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Subscription (x)</Label>
                    <Input
                      type="number"
                      value={ipo.subscription || ""}
                      onChange={(e) => updateIPO(ipo.id, "subscription", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Issue Size (₹ Cr)</Label>
                  <Input
                    type="number"
                    value={ipo.issueSize || ""}
                    onChange={(e) => updateIPO(ipo.id, "issueSize", Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {ipos.length < 5 && (
            <Card 
              className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-center min-h-[200px]"
              onClick={addIPO}
            >
              <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
                <Plus className="h-8 w-8" />
                <span className="text-sm">Add IPO</span>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comparison Table */}
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Metric</TableHead>
                {ipos.map((ipo) => (
                  <TableHead key={ipo.id} className="min-w-[100px] text-center">
                    {ipo.name || "—"}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Issue Price</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center">
                    ₹{ipo.issuePrice.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lot Size</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center">
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
                    <TableCell key={ipo.id} className={`text-center ${isBest ? "text-green-600 dark:text-green-400 font-semibold" : ""}`}>
                      ₹{metrics.minInvestment.toLocaleString()}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">GMP</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className={`text-center ${ipo.gmp >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {ipo.gmp >= 0 ? "+" : ""}₹{ipo.gmp}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Expected Return</TableCell>
                {ipos.map((ipo) => {
                  const metrics = calculateMetrics(ipo);
                  const isBest = metrics.expectedReturn === getBestValue("expectedReturn") && metrics.expectedReturn > 0;
                  return (
                    <TableCell key={ipo.id} className={`text-center font-semibold ${isBest ? "text-green-600 dark:text-green-400" : ""}`}>
                      {metrics.expectedReturn >= 0 ? "+" : ""}{metrics.expectedReturn.toFixed(1)}%
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Profit per Lot</TableCell>
                {ipos.map((ipo) => {
                  const metrics = calculateMetrics(ipo);
                  const isBest = metrics.profitPerLot === getBestValue("profitPerLot") && metrics.profitPerLot > 0;
                  return (
                    <TableCell key={ipo.id} className={`text-center ${isBest ? "text-green-600 dark:text-green-400 font-semibold" : ""}`}>
                      {metrics.profitPerLot >= 0 ? "+" : ""}₹{metrics.profitPerLot.toLocaleString()}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Subscription</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center">
                    {ipo.subscription}x
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Issue Size</TableCell>
                {ipos.map((ipo) => (
                  <TableCell key={ipo.id} className="text-center">
                    ₹{ipo.issueSize} Cr
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Highlighted values indicate the best option for each metric
        </p>
      </CardContent>
    </Card>
  );
}
