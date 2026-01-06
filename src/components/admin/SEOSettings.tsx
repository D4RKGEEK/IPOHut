import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PAGE_LABELS: Record<string, string> = {
  home: "Home Page",
  ipoDetail: "IPO Detail Page",
  mainboard: "Mainboard IPO",
  sme: "SME IPO",
  gmpTracker: "GMP Tracker",
  allotmentStatus: "Allotment Status",
  calendar: "IPO Calendar",
  performance: "Performance Tracker",
};

export function SEOSettings() {
  const { settings, updateSiteSettings, updatePageSettings } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Default SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Default SEO Settings</CardTitle>
          <CardDescription>Global SEO settings applied across the site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titleSuffix">Title Suffix</Label>
            <Input
              id="titleSuffix"
              value={settings.site.defaultSeo.titleSuffix}
              onChange={e => updateSiteSettings({ defaultSeo: { ...settings.site.defaultSeo, titleSuffix: e.target.value } })}
              placeholder=" | IPO Watch 2026"
            />
            <p className="text-xs text-muted-foreground">Appended to all page titles</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultDescription">Default Meta Description</Label>
            <Textarea
              id="defaultDescription"
              rows={3}
              value={settings.site.defaultSeo.defaultDescription}
              onChange={e => updateSiteSettings({ defaultSeo: { ...settings.site.defaultSeo, defaultDescription: e.target.value } })}
              placeholder="Your site's default description..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ogImage">Default OG Image URL</Label>
              <Input
                id="ogImage"
                value={settings.site.defaultSeo.ogImage}
                onChange={e => updateSiteSettings({ defaultSeo: { ...settings.site.defaultSeo, ogImage: e.target.value } })}
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterHandle">Twitter Handle</Label>
              <Input
                id="twitterHandle"
                value={settings.site.defaultSeo.twitterHandle}
                onChange={e => updateSiteSettings({ defaultSeo: { ...settings.site.defaultSeo, twitterHandle: e.target.value } })}
                placeholder="@yourhandle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variables Cheat Sheet */}
      <Card>
        <CardHeader>
          <CardTitle>Available Variable Templates</CardTitle>
          <CardDescription>Use these variables in your IPO Detail Page Title and Description templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{ipo_name}`}</code> - IPO Name</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{company_name}`}</code> - Company</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{gmp_value}`}</code> - Current GMP</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{gmp_percent}`}</code> - GMP %</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{listing_date}`}</code> - List Date</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{open_date}`}</code> - Open Date</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{close_date}`}</code> - Close Date</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{issue_price}`}</code> - Price</div>
            <div className="p-2 border rounded bg-muted/50"><code className="text-primary">{`{subscription_times}`}</code> - Subs (x)</div>
          </div>
        </CardContent>
      </Card>

      {/* Page-specific SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Page-Specific SEO</CardTitle>
          <CardDescription>Customize SEO for each page</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(settings.pages).map(([key, page]) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-sm font-medium">
                  {PAGE_LABELS[key] || key}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input
                      value={page.title}
                      onChange={e => updatePageSettings(key as any, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea
                      rows={2}
                      value={page.description}
                      onChange={e => updatePageSettings(key as any, { description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>H1 Heading</Label>
                      <Input
                        value={page.h1}
                        onChange={e => updatePageSettings(key as any, { h1: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subheading</Label>
                      <Input
                        value={page.subheading || ""}
                        onChange={e => updatePageSettings(key as any, { subheading: e.target.value })}
                      />
                    </div>
                  </div>
                  {key === "ipoDetail" && (
                    <>
                      <div className="space-y-2">
                        <Label>Title Template</Label>
                        <Input
                          value={(page as any).titleTemplate || ""}
                          onChange={e => updatePageSettings("ipoDetail", { titleTemplate: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use variables: {"{ipo_name}"}, {"{gmp_value}"}, {"{gmp_percent}"}, {"{listing_date}"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Description Template</Label>
                        <Textarea
                          rows={2}
                          value={(page as any).descriptionTemplate || ""}
                          onChange={e => updatePageSettings("ipoDetail", { descriptionTemplate: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
