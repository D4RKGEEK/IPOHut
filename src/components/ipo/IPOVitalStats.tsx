import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPOBasicInfo, IPOTimeline as IPOTimelineType, IPOSubscriptionStatus, IPOListingInfo } from "@/types/ipo";
import { TrendingUp, TrendingDown, Calendar, IndianRupee, Package } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const listingDate = timeline["Listing"] || timeline["Tentative Listing Date"];

  const items = [
    {
      label: "Price Band",
      value: priceBand || issuePrice,
      icon: IndianRupee,
      show: !!(priceBand || issuePrice)
    },
    {
      label: "Lot Size",
      value: lotSize,
      icon: Package,
      show: !!lotSize
    },
    {
      label: "Total Issue",
      value: issueSize,
      icon: Package,
      show: !!issueSize
    },
    {
      label: "Subscription",
      value: totalSubscription ? `${totalSubscription}x` : null,
      icon: TrendingUp,
      show: !!totalSubscription,
      valueClass: parseFloat(String(totalSubscription)) >= 1 ? "text-emerald-600 dark:text-emerald-400" : ""
    },
    {
      label: "Listing Date",
      value: listingDate,
      icon: Calendar,
      show: !!listingDate
    },
    {
      label: "Listing Gain",
      value: gainLossPercent !== undefined ? `${gainLossPercent}%` : null,
      icon: gainLossPercent && gainLossPercent >= 0 ? TrendingUp : TrendingDown,
      show: gainLossPercent !== undefined,
      valueClass: gainLossPercent && gainLossPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
    }
  ].filter(item => item.show);

  if (items.length === 0) return null;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 border-b bg-muted/40">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 border-b md:border-b-0">
          {items.map((item, i) => (
            <div key={i} className={cn(
              "p-4 flex flex-col justify-center",
              i >= 2 ? "border-t md:border-t-0" : "" // Handle border logic for grid
            )}>
              <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
              </div>
              <div className={cn("text-sm font-semibold", item.valueClass)}>
                {item.value || "—"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
