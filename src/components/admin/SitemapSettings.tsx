import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SitemapSettings() {
  const { settings, updateSiteSettings } = useAdmin();
  const [copied, setCopied] = useState(false);

  const sitemapConfig = settings.site.sitemapConfig || {
    baseUrl: "https://ipohut.com",
  };

  const sitemapUrl = `${sitemapConfig.baseUrl}/sitemap.xml`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopied(true);
    toast.success("Sitemap URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Configuration</CardTitle>
          <CardDescription>
            Configure your sitemap settings. The sitemap is dynamically generated with all your pages and IPO details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl">Base URL</Label>
            <Input
              id="baseUrl"
              value={sitemapConfig.baseUrl}
              onChange={(e) =>
                updateSiteSettings({
                  sitemapConfig: { ...sitemapConfig, baseUrl: e.target.value },
                })
              }
              placeholder="https://yourdomain.com"
            />
            <p className="text-sm text-muted-foreground">
              The base URL for your website. This will be used in sitemap and canonical URLs.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Sitemap URL</Label>
            <div className="flex gap-2">
              <Input value={sitemapUrl} readOnly className="bg-muted" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Submit this URL to Google Search Console and Bing Webmaster Tools.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Included Pages</CardTitle>
          <CardDescription>
            The sitemap automatically includes the following pages:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Homepage</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Mainboard IPO & SME IPO pages</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>GMP Tracker, Allotment Status, Calendar</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Performance Tracker & Statistics</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>All Tools pages</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>All IPO detail pages (dynamically added)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>All IPO allotment check pages (dynamically added)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
