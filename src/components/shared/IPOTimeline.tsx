import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TimelineStep {
  label: string;
  date: string;
  status: "completed" | "current" | "upcoming";
}

interface IPOTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function IPOTimeline({ steps, className }: IPOTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.label} className="flex gap-4">
            {/* Icon and line */}
            <div className="flex flex-col items-center">
              {step.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              ) : step.status === "current" ? (
                <div className="relative">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                </div>
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
              )}
              {!isLast && (
                <div className={cn(
                  "w-0.5 flex-1 min-h-[32px]",
                  step.status === "completed" ? "bg-success" : "bg-border"
                )} />
              )}
            </div>

            {/* Content */}
            <div className={cn(
              "pb-6",
              step.status === "upcoming" && "opacity-60"
            )}>
              <div className={cn(
                "font-medium text-sm",
                step.status === "current" && "text-primary"
              )}>
                {step.label}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {step.date}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
