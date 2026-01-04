import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
    <ScrollArea className={cn("w-full", className)}>
      <div className="flex items-start gap-0 min-w-max pb-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.label} className="flex items-start">
              {/* Step */}
              <div className="flex flex-col items-center min-w-[70px] sm:min-w-[90px]">
                {/* Icon */}
                <div className="relative">
                  {step.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                  ) : step.status === "current" ? (
                    <div className="relative">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/40" />
                  )}
                </div>

                {/* Content */}
                <div className={cn(
                  "mt-2 text-center px-1",
                  step.status === "upcoming" && "opacity-50"
                )}>
                  <div className={cn(
                    "font-medium text-[10px] sm:text-xs leading-tight",
                    step.status === "current" && "text-primary",
                    step.status === "completed" && "text-success"
                  )}>
                    {step.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 font-tabular">
                    {step.date}
                  </div>
                </div>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className={cn(
                  "h-0.5 w-4 sm:w-6 mt-2.5 sm:mt-3 flex-shrink-0",
                  step.status === "completed" ? "bg-success" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
}
