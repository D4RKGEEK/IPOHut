import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import { IPOPromoterHolding } from "@/types/ipo";

interface PromoterHoldingProps {
  promoterHolding: IPOPromoterHolding;
}

export function PromoterHolding({ promoterHolding }: PromoterHoldingProps) {
  const { table, promoters } = promoterHolding;

  if (!table || Object.keys(table).length === 0) return null;

  // Parse the table data
  const metrics = Object.entries(table).filter(([key]) => 
    !key.toLowerCase().includes('promoter') || key.toLowerCase().includes('holding')
  );

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Users className="h-4 w-4" />
          Promoter Holding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {promoters && promoters.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-2">Promoters</div>
            <div className="flex flex-wrap gap-1.5">
              {promoters.map((promoter, idx) => (
                <span 
                  key={idx} 
                  className="text-xs bg-secondary px-2 py-1 rounded-md"
                >
                  {promoter}
                </span>
              ))}
            </div>
          </div>
        )}

        {metrics.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-xs sm:text-sm">{key}</TableCell>
                    <TableCell className="text-right font-tabular text-xs sm:text-sm">
                      {String(value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
