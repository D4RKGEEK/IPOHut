import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";
import { IPOFinancials } from "@/types/ipo";

interface CompanyFinancialsProps {
  financials: IPOFinancials;
}

export function CompanyFinancials({ financials }: CompanyFinancialsProps) {
  if (!financials || Object.keys(financials).length === 0) return null;

  // Get years from first available metric
  const firstMetric = financials.Assets || financials["Total Income"] || financials["Profit After Tax"];
  const years = firstMetric ? Object.keys(firstMetric) : [];

  if (years.length === 0) return null;

  const metrics = [
    { key: "Assets", label: "Assets" },
    { key: "Total Income", label: "Total Income" },
    { key: "Profit After Tax", label: "PAT" },
    { key: "EBITDA", label: "EBITDA" },
    { key: "NET Worth", label: "Net Worth" },
  ].filter(m => financials[m.key as keyof IPOFinancials]);

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <BarChart3 className="h-4 w-4" />
          Company Financials
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Metric</TableHead>
              {years.map(year => (
                <TableHead key={year} className="text-right min-w-[80px]">{year}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map(({ key, label }) => {
              const values = financials[key as keyof IPOFinancials] as Record<string, string | number> | undefined;
              if (!values) return null;
              
              return (
                <TableRow key={key}>
                  <TableCell className="font-medium text-xs sm:text-sm">{label}</TableCell>
                  {years.map(year => (
                    <TableCell key={year} className="text-right font-tabular text-xs sm:text-sm">
                      {typeof values[year] === "number" 
                        ? values[year].toLocaleString() 
                        : values[year] || "—"}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <p className="text-[10px] text-muted-foreground mt-3">* All values in ₹ Crores</p>
      </CardContent>
    </Card>
  );
}
