import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { IPOPEMetrics } from "@/types/ipo";

interface KeyMetricsProps {
  peMetrics: IPOPEMetrics;
}

export function KeyMetrics({ peMetrics }: KeyMetricsProps) {
  const kpi = peMetrics?.KPI;
  
  if (!kpi || Object.keys(kpi).length === 0) return null;

  const metrics = [
    { label: "RoNW", value: kpi.RoNW },
    { label: "ROE", value: kpi.ROE },
    { label: "Price to Book", value: kpi["Price to Book Value"] },
  ].filter(m => m.value);

  if (metrics.length === 0) return null;

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Gauge className="h-4 w-4" />
          Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {metrics.map((metric) => (
            <div 
              key={metric.label} 
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50"
            >
              <span className="text-xs sm:text-sm text-muted-foreground">{metric.label}</span>
              <span className="text-sm sm:text-base font-semibold font-tabular">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
