import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { IPOObjective } from "@/types/ipo";

interface ObjectivesListProps {
  objectives: IPOObjective[];
}

export function ObjectivesList({ objectives }: ObjectivesListProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Target className="h-4 w-4" />
          IPO Objectives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {objectives.map((obj, idx) => (
            <div 
              key={idx} 
              className="flex gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                {obj.serial_no || idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {obj.objective}
                </p>
                {obj.expected_amount && (
                  <p className="text-xs text-muted-foreground mt-1 font-tabular">
                    Amount: {obj.expected_amount}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
