import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusLower = status.toLowerCase().replace("_", " ");
  
  const getVariant = () => {
    switch (statusLower) {
      case "open":
        return "bg-success/10 text-success border-success/20 hover:bg-success/20";
      case "closed":
        return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20";
      case "listed":
      case "recently listed":
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
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
        return "Recently Listed";
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium text-xs", getVariant(), className)}
    >
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
        "font-medium text-xs",
        type === "mainboard" 
          ? "bg-primary/5 text-primary border-primary/20" 
          : "bg-warning/10 text-warning border-warning/20",
        className
      )}
    >
      {type === "mainboard" ? "Mainboard" : "SME"}
    </Badge>
  );
}
