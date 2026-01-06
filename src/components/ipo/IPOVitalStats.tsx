import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPOBasicInfo, IPOTimeline as IPOTimelineType, IPOSubscriptionStatus, IPOListingInfo } from "@/types/ipo";
import { TrendingUp, TrendingDown, Calendar, IndianRupee, Package } from "lucide-react";

interface IPOVitalStatsProps {
  basicInfo: IPOBasicInfo;
  timeline: IPOTimelineType;
  subscription?: IPOSubscriptionStatus;
  listingInfo?: IPOListingInfo;
  gainLossPercent?: number;
}

export function IPOVitalStats({ basicInfo, timeline, subscription, listingInfo, gainLossPercent }: IPOVitalStatsProps) {
  // Find total subscription times if available
  const totalSubRow = subscription?.SubscriptionTable?.find(
    row => row.category?.toLowerCase() === "total" || row.Category?.toLowerCase() === "total"
  );

  const totalSubscription = totalSubRow?.["Subscription (times)"]
    || totalSubRow?.["Subscription (x)"]
    || totalSubRow?.subscription_times;

  const issuePrice = basicInfo["Issue Price"];
  const lotSize = basicInfo["Lot Size"];
  const issueSize = basicInfo["Total Issue Size"];
  const priceBand = basicInfo["Price Band"];
  const faceValue = basicInfo["Face Value"];
  const freshIssue = basicInfo["Fresh Issue"];
  const ofs = basicInfo["Offer for Sale"];
  const listingDate = timeline["Listing"] || timeline["Tentative Listing Date"];

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50/50 to-gray-50/50 dark:from-slate-900/20 dark:to-gray-900/20">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Key Statistics
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">

          {/* Pricing Section */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <IndianRupee className="h-3 w-3" />
              Pricing
            </h4>
            <div className="space-y-2.5">
              {issuePrice && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Issue Price</span>
                  <span className="text-sm font-semibold">{issuePrice}</span>
                </div>
              )}
              {priceBand && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Price Band</span>
                  <span className="text-sm font-semibold">{priceBand}</span>
                </div>
              )}
              {faceValue && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Face Value</span>
                  <span className="text-sm font-semibold">{faceValue}</span>
                </div>
              )}
              {lotSize && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Lot Size</span>
                  <span className="text-sm font-semibold">{lotSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* Issue Details Section */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Package className="h-3 w-3" />
              Issue Details
            </h4>
            <div className="space-y-2.5">
              {issueSize && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Total Size</span>
                  <span className="text-sm font-semibold">{issueSize}</span>
                </div>
              )}
              {freshIssue && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Fresh Issue</span>
                  <span className="text-sm font-semibold">{freshIssue}</span>
                </div>
              )}
              {ofs && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">OFS</span>
                  <span className="text-sm font-semibold">{ofs}</span>
                </div>
              )}
              {listingDate && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Listing Date
                  </span>
                  <span className="text-sm font-semibold">{listingDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Section */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <TrendingUp className="h-3 w-3" />
              Performance
            </h4>
            <div className="space-y-2.5">
              {totalSubscription && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Subscription</span>
                  <span className={`text-sm font-semibold ${parseFloat(String(totalSubscription)) >= 1 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}>
                    {totalSubscription}x
                  </span>
                </div>
              )}
              {gainLossPercent !== undefined && gainLossPercent !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Listing Gain</span>
                  <span className={`text-sm font-semibold flex items-center gap-1 ${gainLossPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}>
                    {gainLossPercent >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {gainLossPercent}%
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
