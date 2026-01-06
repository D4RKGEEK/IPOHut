import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface AboutCompanyProps {
  about: {
    about_company?: string;
    lists?: string[];
  };
  aiAbout?: string; // AI-generated description takes priority
}

export function AboutCompany({ about, aiAbout }: AboutCompanyProps) {
  // Prioritize AI-generated description, fallback to regular about_company
  const description = aiAbout || about?.about_company;

  if (!description && (!about?.lists || about.lists.length === 0)) return null;

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Building2 className="h-4 w-4" />
          About the Company
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {about.lists && about.lists.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="text-xs font-medium text-foreground mb-2">Key Highlights</div>
            <ul className="space-y-2">
              {about.lists.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
