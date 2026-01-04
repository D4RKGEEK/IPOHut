import { useAdmin } from "@/contexts/AdminContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PageVisibilitySettings() {
  const { settings, updateSiteSettings } = useAdmin();
  const visibility = settings.site.pageVisibility;

  const updateVisibility = (page: keyof typeof visibility, value: boolean) => {
    updateSiteSettings({
      pageVisibility: { ...visibility, [page]: value },
    });
  };

  const pages = [
    { key: 'home' as const, label: 'Home Page', description: 'Main landing page' },
    { key: 'mainboard' as const, label: 'Mainboard IPO', description: '/mainboard-ipo' },
    { key: 'sme' as const, label: 'SME IPO', description: '/sme-ipo' },
    { key: 'gmpTracker' as const, label: 'GMP Tracker', description: '/ipo-gmp-today' },
    { key: 'allotmentStatus' as const, label: 'Allotment Status', description: '/ipo-allotment-status' },
    { key: 'calendar' as const, label: 'IPO Calendar', description: '/ipo-calendar' },
    { key: 'performance' as const, label: 'Performance Tracker', description: '/ipo-listing-performance' },
    { key: 'tools' as const, label: 'Tools', description: '/tools' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Visibility</CardTitle>
        <CardDescription>Enable or disable pages from being accessible</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pages.map((page) => (
            <div key={page.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label>{page.label}</Label>
                <p className="text-xs text-muted-foreground">{page.description}</p>
              </div>
              <Switch 
                checked={visibility[page.key]} 
                onCheckedChange={v => updateVisibility(page.key, v)} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
