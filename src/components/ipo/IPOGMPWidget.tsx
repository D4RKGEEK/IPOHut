import { Card, CardContent } from "@/components/ui/card";
import { IPOGMPData } from "@/types/ipo";
import { TrendingUp, TrendingDown, Flame, Clock } from "lucide-react";
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
    label: "Good"
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

  // Rating display
  const getRatingStars = () => {
    const rating = displayData.rating?.score ?? Math.min(5, Math.max(1, Math.floor(gmpPercent / 10) + 1));
    return Array.from({ length: 5 }, (_, i) => (
      <Flame
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "text-accent fill-accent" : "text-muted-foreground/30"
        )}
      />
    ));
  };

  return (
    <Card className={cn(
      "border-2 overflow-hidden",
      isPositive ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">Grey Market Premium</span>
          <div className="flex items-center gap-1">{getRatingStars()}</div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          {isPositive ? (
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success shrink-0" />
          ) : (
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-destructive shrink-0" />
          )}
          <div>
            <span className={cn(
              "text-2xl sm:text-4xl font-bold font-tabular",
              isPositive ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(gmp)}
            </span>
            <span className={cn(
              "text-base sm:text-xl font-tabular ml-2",
              isPositive ? "text-success" : "text-destructive"
            )}>
              ({formatPercent(gmpPercent)})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
          <div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Est. Listing</div>
            <div className="text-sm sm:text-base font-semibold font-tabular">
              {formatCurrency(estimatedListing)}
            </div>
          </div>
          <div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Profit/Lot</div>
            <div className={cn(
              "text-sm sm:text-base font-semibold font-tabular",
              profitPerLot >= 0 ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(profitPerLot)}
            </div>
          </div>
        </div>

        {displayData.last_updated && (
          <div className="flex items-center gap-1 mt-3 text-[10px] sm:text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated: {displayData.last_updated}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
