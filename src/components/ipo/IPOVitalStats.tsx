import { Card, CardContent } from "@/components/ui/card";
import { IPOBasicInfo, IPOTimeline as IPOTimelineType, IPOSubscriptionStatus, IPOListingInfo } from "@/types/ipo";

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

  const stats = [
    { label: "Issue Price", value: basicInfo["Issue Price"] },
    { label: "Lot Size", value: basicInfo["Lot Size"] },
    { label: "Issue Size", value: basicInfo["Total Issue Size"] },
    { label: "Price Band", value: basicInfo["Price Band"] },
    { label: "Face Value", value: basicInfo["Face Value"] },
    { label: "Fresh Issue", value: basicInfo["Fresh Issue"] },
    { label: "OFS", value: basicInfo["Offer for Sale"] },
    { label: "Listing Date", value: timeline["Listing"] || timeline["Tentative Listing Date"] },
    {
      label: "Total Subscription",
      value: totalSubscription ? `${totalSubscription}x` : null
    },
    {
      label: "Listing Gain",
      value: gainLossPercent ? `${gainLossPercent}%` : null,
      isGainLoss: true,
      gainValue: gainLossPercent
    },
  ].filter(stat => stat.value && stat.value !== "—");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat, index) => (
        <Card key={stat.label + index} className="border bg-card">
          <CardContent className="p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className={`text-sm sm:text-lg font-semibold font-tabular truncate ${stat.isGainLoss
                ? (stat.gainValue && stat.gainValue >= 0 ? "text-success" : "text-destructive")
                : stat.label === "Total Subscription" && stat.value
                  ? (parseFloat(String(stat.value)) >= 1 ? "text-success" : "text-destructive")
                  : ""
              }`}>
              {stat.value || "—"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
