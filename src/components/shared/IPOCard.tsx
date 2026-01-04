import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import { formatCurrency, formatPercent, formatSubscription, getDaysUntil } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
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
}: IPOCardProps) {
  const daysUntilClose = getDaysUntil(closeDate);
  const isPositiveGMP = gmp !== undefined && gmp >= 0;

  return (
    <Link to={`/ipo/${slug}`}>
      <Card className={cn("card-hover border", className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm">{name}</h3>
            <StatusBadge status={status} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <TypeBadge type={ipoType} />
            {issuePrice && (
              <span className="text-sm text-muted-foreground">
                {formatCurrency(issuePrice)}
              </span>
            )}
          </div>

          {/* GMP Display */}
          {gmp !== undefined && (
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-md mb-3",
              isPositiveGMP ? "bg-success/5" : "bg-destructive/5"
            )}>
              {isPositiveGMP ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "font-tabular font-semibold",
                isPositiveGMP ? "text-success" : "text-destructive"
              )}>
                GMP: {formatCurrency(gmp)}
              </span>
              {gmpPercent !== undefined && (
                <span className={cn(
                  "font-tabular text-sm",
                  isPositiveGMP ? "text-success" : "text-destructive"
                )}>
                  ({formatPercent(gmpPercent)})
                </span>
              )}
            </div>
          )}

          {/* Subscription */}
          {subscriptionTimes !== undefined && subscriptionTimes > 0 && (
            <div className="text-sm text-muted-foreground mb-2">
              Subscription: <span className="font-tabular font-medium text-foreground">{formatSubscription(subscriptionTimes)}</span>
            </div>
          )}

          {/* Countdown for open IPOs */}
          {status.toLowerCase() === "open" && daysUntilClose !== null && daysUntilClose >= 0 && (
            <div className="flex items-center gap-1 text-sm text-warning mt-2">
              <Clock className="h-3.5 w-3.5" />
              <span className="animate-countdown">
                {daysUntilClose === 0 ? "Closing today!" : `Closing in ${daysUntilClose} day${daysUntilClose > 1 ? "s" : ""}`}
              </span>
            </div>
          )}

          {/* Listing date for upcoming */}
          {status.toLowerCase() === "upcoming" && listingDate && (
            <div className="text-xs text-muted-foreground mt-2">
              Expected listing: {listingDate}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
