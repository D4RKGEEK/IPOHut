import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const statusLower = status.toLowerCase().replace("_", " ");
  
  const getVariant = () => {
    switch (statusLower) {
      case "open":
        return "bg-success/10 text-success border-success/30";
      case "closed":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/30";
      case "listed":
      case "recently listed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLabel = () => {
    switch (statusLower) {
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      case "upcoming":
        return "Upcoming";
      case "listed":
        return "Listed";
      case "recently listed":
        return "Listed";
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] px-1.5 py-0.5 font-normal",
        getVariant(), 
        className
      )}
    >
      {showDot && statusLower === "open" && (
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse mr-1" />
      )}
      {getLabel()}
    </Badge>
  );
}

interface TypeBadgeProps {
  type: "mainboard" | "sme";
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] px-1.5 py-0.5 font-normal",
        type === "mainboard" 
          ? "bg-chart-3/10 text-chart-3 border-chart-3/30" 
          : "bg-warning/10 text-warning border-warning/30",
        className
      )}
    >
      {type === "mainboard" ? "MB" : "SME"}
    </Badge>
  );
}
