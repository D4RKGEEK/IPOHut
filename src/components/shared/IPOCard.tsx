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
      <Card className={cn("card-hover h-full", className)} style={style}>
        <CardContent className="p-3 md:p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <TypeBadge type={ipoType} />
                {issuePrice && (
                  <span className="text-xs font-tabular text-muted-foreground">
                    {formatCurrency(issuePrice)}
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* GMP Display */}
          {gmp !== undefined && (
            <div className={cn(
              "flex items-center justify-between p-2 rounded-md mb-2",
              isPositiveGMP ? "bg-success/5" : "bg-destructive/5"
            )}>
              <div className="flex items-center gap-1.5">
                {isPositiveGMP ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className="text-xs text-muted-foreground">GMP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-tabular",
                  isPositiveGMP ? "text-success" : "text-destructive"
                )}>
                  {formatCurrency(gmp)}
                </span>
                {gmpPercent !== undefined && (
                  <span className={cn(
                    "text-xs font-tabular",
                    isPositiveGMP ? "text-success" : "text-destructive"
                  )}>
                    ({formatPercent(gmpPercent)})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Subscription */}
          {subscriptionTimes !== undefined && subscriptionTimes > 0 && (
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Subscription</span>
              <span className="font-tabular text-foreground">
                {formatSubscription(subscriptionTimes)}
              </span>
            </div>
          )}

          {/* Countdown for open IPOs */}
          {status.toLowerCase() === "open" && daysUntilClose !== null && daysUntilClose >= 0 && (
            <div className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs",
              daysUntilClose === 0 
                ? "bg-warning/10 text-warning" 
                : "bg-muted text-muted-foreground"
            )}>
              <Clock className="h-3 w-3" />
              <span>
                {daysUntilClose === 0 ? "Closes today" : `${daysUntilClose}d left`}
              </span>
            </div>
          )}

          {/* Listing date for upcoming */}
          {status.toLowerCase() === "upcoming" && listingDate && (
            <div className="text-xs text-muted-foreground">
              Opens: <span className="text-foreground">{listingDate}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
