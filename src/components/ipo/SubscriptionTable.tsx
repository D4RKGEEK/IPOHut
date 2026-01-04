import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import { IPOSubscriptionStatus, IPOSubscriptionRow } from "@/types/ipo";
import { formatSubscription } from "@/lib/api";

interface SubscriptionTableProps {
  subscription: IPOSubscriptionStatus;
}

// Helper to parse subscription times from various formats
function getSubscriptionTimes(row: IPOSubscriptionRow): number {
  if (typeof row.subscription_times === "number") return row.subscription_times;
  if (row["Subscription (times)"]) {
    const parsed = parseFloat(String(row["Subscription (times)"]).replace(/[^\d.]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// Helper to parse shares from various formats
function parseShares(value: number | string | undefined): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "number") return value.toLocaleString();
  // Remove commas and parse
  const cleaned = String(value).replace(/,/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? String(value) : num.toLocaleString();
}

export function SubscriptionTable({ subscription }: SubscriptionTableProps) {
  const rows = subscription?.SubscriptionTable;
  
  if (!rows || rows.length === 0) return null;

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Users className="h-4 w-4" />
          <span>Live Subscription Status</span>
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-xs font-normal text-muted-foreground">Live</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Category</TableHead>
              <TableHead className="text-right min-w-[80px]">Subscription</TableHead>
              <TableHead className="text-right min-w-[100px] hidden sm:table-cell">Shares Offered</TableHead>
              <TableHead className="text-right min-w-[100px] hidden sm:table-cell">Shares Bid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => {
              const subTimes = getSubscriptionTimes(row);
              const sharesOffered = row.shares_offered ?? row["Shares Offered"];
              const sharesBid = row.shares_bid ?? row["Shares Bid For"];

              return (
                <TableRow key={index}>
                  <TableCell className="font-medium text-xs sm:text-sm">{row.category}</TableCell>
                  <TableCell className="text-right font-tabular font-semibold text-primary text-xs sm:text-sm">
                    {formatSubscription(subTimes)}
                  </TableCell>
                  <TableCell className="text-right font-tabular text-xs sm:text-sm hidden sm:table-cell">
                    {parseShares(sharesOffered)}
                  </TableCell>
                  <TableCell className="text-right font-tabular text-xs sm:text-sm hidden sm:table-cell">
                    {parseShares(sharesBid)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {subscription.TotalApplications && (
          <div className="mt-4 text-xs sm:text-sm text-muted-foreground text-center">
            Total Applications: <span className="font-semibold text-foreground font-tabular">{subscription.TotalApplications.toLocaleString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
