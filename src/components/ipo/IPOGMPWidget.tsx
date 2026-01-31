import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { IPOGMPData } from "@/types/ipo";
import { TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";
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
  const displayData = showDummyData ? DUMMY_GMP_DATA : gmpData;

  if (!displayData) return null;

  const gmp = displayData.current_gmp ?? 0;
  const isPositive = gmp > 0;
  const isZero = gmp === 0;
  const gmpPercent = issuePrice > 0 ? (gmp / issuePrice) * 100 : 0;
  const estimatedListing = displayData.estimated_listing ?? (issuePrice + gmp);
  const profitPerLot = gmp * lotSize;

  const formatLastUpdated = (updatedStr?: string) => {
    if (!updatedStr) return null;
    const parsedDate = new Date(updatedStr);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (updatedStr.includes('ago') || updatedStr.includes('hour') || updatedStr.includes('min')) {
      return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return updatedStr;
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm group">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Main GMP Display */}
          <div className={cn(
            "flex-1 p-5 flex flex-col justify-center relative overflow-hidden",
            isZero
              ? "bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-transparent dark:from-slate-500/20"
              : isPositive
                ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20"
                : "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/20"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                isZero ? "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400" :
                  isPositive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
              )}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : isZero ? <Clock className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live GMP</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className={cn(
                "text-4xl font-black tracking-tighter text-foreground font-tabular",
                isZero && "text-muted-foreground/30"
              )}>
                {isZero ? "TBA" : formatCurrency(gmp)}
              </span>
              {!isZero && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-sm font-bold backdrop-blur-sm",
                  isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}>
                  {isPositive ? "+" : ""}{formatPercent(gmpPercent).replace('%', '')}%
                </span>
              )}
            </div>

            {displayData.last_updated && (
              <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground/60">
                <Clock className="h-3 w-3" />
                Updated: {formatLastUpdated(displayData.last_updated)}
              </div>
            )}
          </div>

          {/* Stats Breakdown */}
          <div className="flex-[1.2] grid grid-cols-2 bg-muted/30 divide-x divide-y sm:divide-y-0 border-t sm:border-t-0 sm:border-l">
            <div className="p-5 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Listing</span>
              <span className="text-xl font-bold font-tabular">{isZero ? "TBA" : formatCurrency(estimatedListing)}</span>
            </div>

            <div className="p-5 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Profit/Lot</span>
              <span className={cn(
                "text-xl font-bold font-tabular",
                isZero ? "text-muted-foreground/30" : (isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")
              )}>
                {isZero ? "TBA" : formatCurrency(profitPerLot)}
              </span>
            </div>
          </div>
        </div>

        {/* Interlinking Footer */}
        <Link
          href="/ipo-gmp-today"
          className="flex items-center justify-between px-5 py-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all border-t group/link"
        >
          <span className="text-xs font-bold flex items-center gap-2">
            View Live Grey Market Tracker
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
