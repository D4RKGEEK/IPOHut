import { IPOLink } from "./IPOLink";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, TypeBadge } from "./StatusBadge";
import { formatCurrency, formatPercent, formatSubscription, getDaysUntil } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/hooks/useAnalytics";

interface IPOCardProps {
  name: string;
  slug: string;
  status: string;
  ipoType: "mainboard" | "sme";
  issuePrice?: number;
  issuePriceDisplay?: string;
  gmp?: number;
  gmpPercent?: number;
  subscriptionTimes?: number;
  closeDate?: string;
  listingDate?: string;
  logoUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function IPOCard({
  name,
  slug,
  status,
  ipoType,
  issuePrice,
  issuePriceDisplay,
  gmp,
  gmpPercent,
  subscriptionTimes,
  closeDate,
  listingDate,
  logoUrl,
  className,
  style,
}: IPOCardProps) {
  const daysUntilClose = getDaysUntil(closeDate);
  const isPositiveGMP = gmp !== undefined && gmp !== null && gmp >= 0;
  const showAllotmentLink = ["recently_listed", "listed"].includes(status.toLowerCase());

  // Only show GMP if we have data (not null or undefined)
  const hasGmpData = gmp !== undefined && gmp !== null;
  // Only show subscription if we have data (not 0 or undefined)
  const hasSubscriptionData = subscriptionTimes !== undefined && subscriptionTimes !== null && subscriptionTimes > 0;

  return (
    <Card className={cn("card-hover h-full border-border/40 bg-card/50 backdrop-blur-sm", className)} style={style}>
      <CardContent className="p-4">
        {/* Header */}
        <IPOLink
          href={`/ipo/${slug}`}
          logoUrl={logoUrl}
          className="group block"
          onClick={() => analytics.ipoCardClick(name, slug)}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <TypeBadge type={ipoType} />
                {(issuePriceDisplay || (issuePrice !== undefined && issuePrice !== null && issuePrice > 0)) && (
                  <span className="text-xs font-semibold text-muted-foreground/80">
                    {issuePriceDisplay || (issuePrice ? formatCurrency(issuePrice) : "")}
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={status} className="shrink-0" />
          </div>
        </IPOLink>

        {/* Info Grid for better data presentation */}
        <div className="space-y-3">
          {/* GMP Display - Only if data exists */}
          {hasGmpData && (
            <IPOLink
              href={`/ipo/${slug}`}
              logoUrl={logoUrl}
              onClick={() => analytics.ipoCardClick(name, slug)}
              className="block"
            >
              <div className={cn(
                "flex items-center justify-between p-2.5 rounded-xl border",
                isPositiveGMP
                  ? "bg-emerald-500/5 border-emerald-500/10"
                  : "bg-rose-500/5 border-rose-500/10"
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1 rounded-lg",
                    isPositiveGMP ? "bg-emerald-500/20" : "bg-rose-500/20"
                  )}>
                    {isPositiveGMP ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">GMP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-black font-tabular",
                    isPositiveGMP ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {formatCurrency(gmp)}
                  </span>
                  {gmpPercent !== undefined && gmpPercent !== null && (
                    <span className={cn(
                      "text-[10px] font-bold font-tabular px-1.5 py-0.5 rounded-md",
                      isPositiveGMP ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    )}>
                      {formatPercent(gmpPercent)}
                    </span>
                  )}
                </div>
              </div>
            </IPOLink>
          )}

          {/* Subscription & Timing */}
          <div className="flex flex-col gap-2">
            {hasSubscriptionData && (
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-muted-foreground">Subscription</span>
                <span className="text-sm font-bold text-foreground font-tabular bg-muted/50 px-2 py-0.5 rounded-lg">
                  {formatSubscription(subscriptionTimes!)}
                </span>
              </div>
            )}

            {/* Countdown for open IPOs */}
            {status.toLowerCase() === "open" && daysUntilClose !== null && daysUntilClose >= 0 && (
              <div className={cn(
                "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-colors",
                daysUntilClose === 0
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              )}>
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {daysUntilClose === 0 ? "CLOSES TODAY" : `${daysUntilClose} DAYS LEFT`}
                </span>
              </div>
            )}

            {/* Listing date for upcoming */}
            {status.toLowerCase() === "upcoming" && listingDate && (
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="font-medium text-muted-foreground">Opening Date</span>
                <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                  {listingDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Allotment Checker Link for closed/listed IPOs */}
        {showAllotmentLink && (
          <Link
            href={`/ipo/${slug}/allotment`}
            className="flex items-center justify-center gap-2 py-2.5 mt-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
            onClick={() => analytics.allotmentCheckClick(name)}
            aria-label={`Check allotment status for ${name}`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Check Allotment Status</span>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
