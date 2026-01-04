import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePageSettings() {
  const { settings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Announcement Banner */}
      <Card>
        <CardHeader>
          <CardTitle>Announcement Banner</CardTitle>
          <CardDescription>Display a highlighted message at the top of the home page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Banner</Label>
              <p className="text-xs text-muted-foreground">Show announcement on home page</p>
            </div>
            <Switch 
              checked={settings.site.homePageConfig.announcementEnabled} 
              onCheckedChange={checked => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, announcementEnabled: checked } 
              })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementBanner">Banner Message</Label>
            <Textarea 
              id="announcementBanner"
              rows={2}
              value={settings.site.homePageConfig.announcementBanner} 
              onChange={e => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, announcementBanner: e.target.value } 
              })} 
              placeholder="Important announcement here..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Section Visibility</CardTitle>
          <CardDescription>Toggle which sections appear on the home page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>News Ticker</Label>
              <p className="text-xs text-muted-foreground">Scrolling news at the top</p>
            </div>
            <Switch 
              checked={settings.site.homePageConfig.showNewsTicker} 
              onCheckedChange={checked => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, showNewsTicker: checked } 
              })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Open IPOs</Label>
              <p className="text-xs text-muted-foreground">IPOs currently accepting subscriptions</p>
            </div>
            <Switch 
              checked={settings.site.homePageConfig.showOpenIPOs} 
              onCheckedChange={checked => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, showOpenIPOs: checked } 
              })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Upcoming IPOs</Label>
              <p className="text-xs text-muted-foreground">IPOs scheduled to open soon</p>
            </div>
            <Switch 
              checked={settings.site.homePageConfig.showUpcomingIPOs} 
              onCheckedChange={checked => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, showUpcomingIPOs: checked } 
              })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recently Listed</Label>
              <p className="text-xs text-muted-foreground">IPOs that recently got listed</p>
            </div>
            <Switch 
              checked={settings.site.homePageConfig.showRecentlyListed} 
              onCheckedChange={checked => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, showRecentlyListed: checked } 
              })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Gainers & Losers</Label>
              <p className="text-xs text-muted-foreground">Top performing and worst performing IPOs</p>
            </div>
            <Switch 
              checked={settings.site.homePageConfig.showGainersLosers} 
              onCheckedChange={checked => updateSiteSettings({ 
                homePageConfig: { ...settings.site.homePageConfig, showGainersLosers: checked } 
              })} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
