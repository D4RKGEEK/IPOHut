import { Card, CardContent } from "@/components/ui/card";
import { IPOGMPData } from "@/types/ipo";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/api";

interface IPOGMPWidgetProps {
  gmpData?: IPOGMPData;
  issuePrice: number;
  lotSize: number;
  showDummyData?: boolean;
}

const DUMMY_GMP_DATA: IPOGMPData = {
  current_gmp: 45,
  estimated_listing: 345,
  last_updated: "2 hours ago",
  rating: {
    score: 4,
    display: "Good"
  }
};

export function IPOGMPWidget({ gmpData, issuePrice, lotSize, showDummyData = false }: IPOGMPWidgetProps) {
  // Use dummy data if flag is true or if no real data is available
  const displayData = showDummyData ? DUMMY_GMP_DATA : gmpData;

  // If no data and not showing dummy, don't render
  if (!displayData) return null;

  const gmp = displayData.current_gmp ?? 0;
  const isPositive = gmp >= 0;
  const gmpPercent = issuePrice > 0 ? (gmp / issuePrice) * 100 : 0;
  const estimatedListing = displayData.estimated_listing ?? (issuePrice + gmp);
  const profitPerLot = gmp * lotSize;

  return (
    <Card className={cn(
      "border-none shadow-md overflow-hidden relative",
      isPositive
        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
        : "bg-gradient-to-br from-rose-500 to-red-600 text-white"
    )}>
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5 pointer-events-none" />

      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white/90 text-sm font-medium mb-1">Grey Market Premium</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-tabular tracking-tight">
                {formatCurrency(gmp)}
              </span>
              <span className="text-white/80 font-medium bg-white/20 px-1.5 py-0.5 rounded text-sm backdrop-blur-sm">
                {isPositive ? "+" : ""}{formatPercent(gmpPercent).replace('%', '')}%
              </span>
            </div>
          </div>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md shadow-sm">
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-white" />
            ) : (
              <TrendingDown className="h-6 w-6 text-white" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/70 text-xs mb-1">Est. Listing</div>
            <div className="text-lg font-bold font-tabular">
              {formatCurrency(estimatedListing)}
            </div>
          </div>
          <div className="bg-black/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-white/70 text-xs mb-1">Profit/Lot</div>
            <div className="text-lg font-bold font-tabular">
              {formatCurrency(profitPerLot)}
            </div>
          </div>
        </div>

        {displayData.last_updated && (
          <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-white/60">
            <Clock className="h-3 w-3" />
            Updated: {displayData.last_updated}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
