import { useIPONews } from "@/hooks/useIPO";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, TrendingUp, Calendar, Bell, CheckCircle } from "lucide-react";
import { IPONews } from "@/types/ipo";

const getNewsIcon = (type: string) => {
  switch (type) {
    case "opening_today":
    case "closing_today":
      return Calendar;
    case "listing":
    case "gmp":
      return TrendingUp;
    case "allotment_date":
    case "shares_credited":
      return CheckCircle;
    default:
      return Bell;
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-destructive";
    case "medium":
      return "text-warning";
    default:
      return "text-muted-foreground";
  }
};

export function NewsTicker() {
  const { data, isLoading, error } = useIPONews({ limit: 20 });

  const newsData = data?.data;
  const loading = isLoading;

  if (loading) {
    return (
      <div className="bg-muted/50 border-y overflow-hidden py-2">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-40" />
        </div>
      </div>
    );
  }

  if (error || !newsData?.length) {
    return null;
  }

  const newsItems = newsData;

  // Duplicate items for seamless loop
  const tickerItems = [...newsItems, ...newsItems];

  return (
    <div className="bg-muted/30 border-y overflow-hidden">
      <div className="flex items-center">
        {/* Live indicator */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-destructive/10 border-r">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
          <span className="text-xs font-semibold text-destructive uppercase tracking-wide">Live</span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex items-center whitespace-nowrap py-2">
            {tickerItems.map((item, index) => {
              const Icon = getNewsIcon(item.type);
              return (
                <Link
                  key={`${item.ipo_id}-${index}`}
                  href={`/ipo/${item.ipo_slug}`}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 text-sm hover:text-primary transition-colors",
                    getPriorityClass(item.priority)
                  )}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-medium">{item.ipo_name}:</span>
                  <span>{item.title}</span>
                  <span className="text-border mx-4">•</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
