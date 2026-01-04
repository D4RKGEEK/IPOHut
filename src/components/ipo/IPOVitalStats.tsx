import { Card, CardContent } from "@/components/ui/card";
import { IPOBasicInfo, IPOTimeline as IPOTimelineType } from "@/types/ipo";

interface IPOVitalStatsProps {
  basicInfo: IPOBasicInfo;
  timeline: IPOTimelineType;
}

export function IPOVitalStats({ basicInfo, timeline }: IPOVitalStatsProps) {
  const stats = [
    { label: "Issue Price", value: basicInfo["Issue Price"] },
    { label: "Lot Size", value: basicInfo["Lot Size"] },
    { label: "Issue Size", value: basicInfo["Total Issue Size"] },
    { label: "Price Band", value: basicInfo["Price Band"] },
    { label: "Face Value", value: basicInfo["Face Value"] },
    { label: "Fresh Issue", value: basicInfo["Fresh Issue"] },
    { label: "OFS", value: basicInfo["Offer for Sale"] },
    { label: "Listing Date", value: timeline["Tentative Listing Date"] },
  ].filter(stat => stat.value && stat.value !== "—");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border bg-card">
          <CardContent className="p-3 sm:p-4">
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="text-sm sm:text-lg font-semibold font-tabular truncate">
              {stat.value || "—"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
