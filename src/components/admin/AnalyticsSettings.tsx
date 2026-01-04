import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsSettings() {
  const { settings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
          <CardDescription>Configure analytics and tracking tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input 
              id="googleAnalyticsId"
              value={settings.site.analytics.googleAnalyticsId} 
              onChange={e => updateSiteSettings({ 
                analytics: { ...settings.site.analytics, googleAnalyticsId: e.target.value } 
              })} 
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              Your Google Analytics 4 measurement ID
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="googleSearchConsoleId">Google Search Console</Label>
            <Input 
              id="googleSearchConsoleId"
              value={settings.site.analytics.googleSearchConsoleId} 
              onChange={e => updateSiteSettings({ 
                analytics: { ...settings.site.analytics, googleSearchConsoleId: e.target.value } 
              })} 
              placeholder="HTML tag verification code"
            />
            <p className="text-xs text-muted-foreground">
              Meta tag content for Search Console verification
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
            <Input 
              id="facebookPixelId"
              value={settings.site.analytics.facebookPixelId} 
              onChange={e => updateSiteSettings({ 
                analytics: { ...settings.site.analytics, facebookPixelId: e.target.value } 
              })} 
              placeholder="1234567890123456"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure the data source for IPO information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiBaseUrl">API Base URL</Label>
            <Input 
              id="apiBaseUrl"
              value={settings.site.apiConfig.baseUrl} 
              onChange={e => updateSiteSettings({ 
                apiConfig: { ...settings.site.apiConfig, baseUrl: e.target.value } 
              })} 
              placeholder="https://beta.ipowatch.in/api"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cacheMinutes">Cache Duration (minutes)</Label>
            <Input 
              id="cacheMinutes"
              type="number"
              value={settings.site.apiConfig.cacheMinutes} 
              onChange={e => updateSiteSettings({ 
                apiConfig: { ...settings.site.apiConfig, cacheMinutes: parseInt(e.target.value) || 5 } 
              })} 
              placeholder="5"
            />
            <p className="text-xs text-muted-foreground">
              How long to cache API responses
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
