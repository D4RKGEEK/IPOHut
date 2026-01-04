import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

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

  const getDotColor = () => {
    switch (statusLower) {
      case "open":
        return "fill-success text-success";
      case "closed":
        return "fill-destructive text-destructive";
      case "upcoming":
        return "fill-primary text-primary";
      default:
        return "fill-muted-foreground text-muted-foreground";
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
        return "Recently Listed";
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium text-xs gap-1.5 px-2.5 py-1",
        getVariant(), 
        className
      )}
    >
      {showDot && statusLower === "open" && (
        <Circle className={cn("h-2 w-2 animate-pulse", getDotColor())} />
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
        "font-medium text-xs px-2.5 py-1",
        type === "mainboard" 
          ? "bg-chart-3/8 text-chart-3 border-chart-3/25" 
          : "bg-warning/8 text-warning border-warning/25",
        className
      )}
    >
      {type === "mainboard" ? "Mainboard" : "SME"}
    </Badge>
  );
}