import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Briefcase, ChevronDown } from "lucide-react";
import { IPOLeadManager } from "@/types/ipo";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LeadManagersListProps {
  leadManagers: IPOLeadManager[];
}

export function LeadManagersList({ leadManagers }: LeadManagersListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!leadManagers || leadManagers.length === 0) return null;

  const visibleManagers = leadManagers.slice(0, 3);
  const hiddenManagers = leadManagers.slice(3);

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Briefcase className="h-4 w-4" />
          Lead Managers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {visibleManagers.map((manager, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-2 text-xs sm:text-sm text-foreground"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {manager.name}
            </div>
          ))}
          
          {hiddenManagers.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleContent>
                <div className="space-y-2 pt-2">
                  {hiddenManagers.map((manager, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 text-xs sm:text-sm text-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {manager.name}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
              <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform",
                  isOpen && "rotate-180"
                )} />
                {isOpen ? "Show less" : `+${hiddenManagers.length} more`}
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
