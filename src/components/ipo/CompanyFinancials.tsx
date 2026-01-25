import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Banknote, TrendingUp, Info } from "lucide-react";
import { IPOFinancials, AIData } from "@/types/ipo";

interface CompanyFinancialsProps {
  financials: IPOFinancials;
  aiData?: AIData;
}

export function CompanyFinancials({ financials, aiData }: CompanyFinancialsProps) {
  if (!financials || Object.keys(financials).length === 0) return null;

  // Get years from first available metric
  const firstMetric = financials.Assets || financials["Total Income"] || financials["Profit After Tax"];
  const years = firstMetric ? Object.keys(firstMetric) : [];

  if (years.length === 0) return null;

  const metrics = [
    { key: "Assets", label: "Total Assets" },
    { key: "Total Income", label: "Revenue" },
    { key: "Profit After Tax", label: "Profit (PAT)" },
    { key: "EBITDA", label: "EBITDA" },
    { key: "NET Worth", label: "Net Worth" },
  ].filter(m => financials[m.key as keyof IPOFinancials]);

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-4 border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Banknote className="h-4 w-4 text-primary" />
          Financial Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Financial Outlook from AI */}
        {aiData?.financial_summary && (
          <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/30">
            <div className="flex gap-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md h-fit shrink-0">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">
                  Outlook
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiData.financial_summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financials Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/5 hover:bg-muted/5 border-b border-border/50">
                <TableHead className="w-[180px] pl-4 sm:pl-6 text-xs uppercase tracking-wider font-semibold">Metric</TableHead>
                {years.map(year => (
                  <TableHead key={year} className="text-right min-w-[100px] text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    {year}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map(({ key, label }, index) => {
                const values = financials[key as keyof IPOFinancials] as Record<string, string | number> | undefined;
                if (!values) return null;

                const isProfit = key === "Profit After Tax";

                return (
                  <TableRow key={key} className="border-b border-border/50 hover:bg-muted/5 transition-colors">
                    <TableCell className="font-medium text-sm pl-4 sm:pl-6 py-3">
                      {label}
                      {isProfit && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded">Key</span>}
                    </TableCell>
                    {years.map(year => (
                      <TableCell key={year} className="text-right font-tabular text-sm py-3">
                        {typeof values[year] === "number"
                          ? (
                            <span className={isProfit && (values[year] as number) < 0 ? "text-red-500" : ""}>
                              {values[year].toLocaleString()}
                            </span>
                          )
                          : values[year] || "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="p-3 bg-muted/20 border-t flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
          <Info className="h-3 w-3" />
          Figures in ₹ Crores
        </div>
      </CardContent>
    </Card>
  );
}
