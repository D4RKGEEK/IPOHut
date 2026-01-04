import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import { formatCurrency, formatPercent, formatSubscription, getDaysUntil } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface IPOCardProps {
  name: string;
  slug: string;
  status: string;
  ipoType: "mainboard" | "sme";
  issuePrice?: number;
  gmp?: number;
  gmpPercent?: number;
  subscriptionTimes?: number;
  closeDate?: string;
  listingDate?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function IPOCard({
  name,
  slug,
  status,
  ipoType,
  issuePrice,
  gmp,
  gmpPercent,
  subscriptionTimes,
  closeDate,
  listingDate,
  className,
  style,
}: IPOCardProps) {
  const daysUntilClose = getDaysUntil(closeDate);
  const isPositiveGMP = gmp !== undefined && gmp >= 0;

  return (
    <Link to={`/ipo/${slug}`} className="group block">
      <Card className={cn("card-interactive h-full overflow-hidden", className)} style={style}>
        <CardContent className="p-0">
          {/* Header with gradient accent */}
          <div className={cn(
            "px-5 py-4 border-b",
            status.toLowerCase() === "open" && "bg-gradient-to-r from-success/5 to-transparent border-success/10",
            status.toLowerCase() === "upcoming" && "bg-gradient-to-r from-primary/5 to-transparent border-primary/10",
            status.toLowerCase() === "closed" && "bg-gradient-to-r from-destructive/5 to-transparent border-destructive/10",
          )}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-foreground line-clamp-1 text-base group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <TypeBadge type={ipoType} />
                  {issuePrice && (
                    <span className="text-sm font-tabular text-muted-foreground">
                      {formatCurrency(issuePrice)}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3">
            {/* GMP Display */}
            {gmp !== undefined && (
              <div className={cn(
                "flex items-center justify-between p-3 rounded-xl",
                isPositiveGMP 
                  ? "bg-success/8 border border-success/15" 
                  : "bg-destructive/8 border border-destructive/15"
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    isPositiveGMP ? "bg-success/20" : "bg-destructive/20"
                  )}>
                    {isPositiveGMP ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Grey Market Premium</div>
                    <div className={cn(
                      "font-tabular font-bold text-lg",
                      isPositiveGMP ? "text-success" : "text-destructive"
                    )}>
                      {formatCurrency(gmp)}
                    </div>
                  </div>
                </div>
                {gmpPercent !== undefined && (
                  <div className={cn(
                    "text-sm font-tabular font-semibold px-2 py-1 rounded-lg",
                    isPositiveGMP 
                      ? "bg-success/15 text-success" 
                      : "bg-destructive/15 text-destructive"
                  )}>
                    {formatPercent(gmpPercent)}
                  </div>
                )}
              </div>
            )}

            {/* Subscription */}
            {subscriptionTimes !== undefined && subscriptionTimes > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subscription</span>
                <span className="font-tabular font-semibold text-foreground bg-secondary px-2 py-0.5 rounded-md">
                  {formatSubscription(subscriptionTimes)}
                </span>
              </div>
            )}

            {/* Countdown for open IPOs */}
            {status.toLowerCase() === "open" && daysUntilClose !== null && daysUntilClose >= 0 && (
              <div className={cn(
                "flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium",
                daysUntilClose === 0 
                  ? "bg-warning/10 text-warning border border-warning/20" 
                  : "bg-primary/5 text-primary border border-primary/10"
              )}>
                <Clock className="h-4 w-4" />
                <span>
                  {daysUntilClose === 0 ? "Closing today!" : `Closing in ${daysUntilClose} day${daysUntilClose > 1 ? "s" : ""}`}
                </span>
              </div>
            )}

            {/* Listing date for upcoming */}
            {status.toLowerCase() === "upcoming" && listingDate && (
              <div className="text-xs text-muted-foreground">
                Expected listing: <span className="font-medium text-foreground">{listingDate}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t bg-muted/30 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">View details</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}