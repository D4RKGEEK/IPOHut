import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";

interface LotSizeTableProps {
  lotSizeTable: Array<Array<string | number>>;
}

export function LotSizeTable({ lotSizeTable }: LotSizeTableProps) {
  if (!lotSizeTable || lotSizeTable.length < 2) return null;

  // First row is header
  const headers = lotSizeTable[0] as string[];
  const rows = lotSizeTable.slice(1);

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Package className="h-4 w-4" />
          Lot Size Details
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, idx) => (
                <TableHead 
                  key={idx} 
                  className={idx === 0 ? "min-w-[100px]" : "text-right min-w-[80px]"}
                >
                  {String(header)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {(row as Array<string | number>).map((cell, cellIdx) => (
                  <TableCell 
                    key={cellIdx} 
                    className={cellIdx === 0 ? "font-medium text-xs sm:text-sm" : "text-right font-tabular text-xs sm:text-sm"}
                  >
                    {String(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
