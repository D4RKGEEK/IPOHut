import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AppearanceSettings() {
  const { settings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the look and feel of your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Allow users to toggle dark mode</p>
            </div>
            <Switch 
              checked={settings.site.theme.enableDarkMode} 
              onCheckedChange={checked => updateSiteSettings({ theme: { ...settings.site.theme, enableDarkMode: checked } })} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultTheme">Default Theme</Label>
            <Select 
              value={settings.site.theme.defaultTheme}
              onValueChange={value => updateSiteSettings({ theme: { ...settings.site.theme, defaultTheme: value as 'light' | 'dark' | 'system' } })}
            >
              <SelectTrigger id="defaultTheme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Preference</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color (HSL)</Label>
            <Input 
              id="primaryColor"
              value={settings.site.theme.primaryColor} 
              onChange={e => updateSiteSettings({ theme: { ...settings.site.theme, primaryColor: e.target.value } })} 
              placeholder="hsl(142 76% 36%)"
            />
            <p className="text-xs text-muted-foreground">Enter an HSL color value</p>
          </div>
        </CardContent>
      </Card>

      {/* Content Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Content Labels</CardTitle>
          <CardDescription>Customize button text and messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkAllotmentButton">Check Allotment Button</Label>
              <Input 
                id="checkAllotmentButton"
                value={settings.site.labels.checkAllotmentButton} 
                onChange={e => updateSiteSettings({ labels: { ...settings.site.labels, checkAllotmentButton: e.target.value } })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewDetailsButton">View Details Button</Label>
              <Input 
                id="viewDetailsButton"
                value={settings.site.labels.viewDetailsButton} 
                onChange={e => updateSiteSettings({ labels: { ...settings.site.labels, viewDetailsButton: e.target.value } })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscribeButton">Subscribe/Apply Button</Label>
              <Input 
                id="subscribeButton"
                value={settings.site.labels.subscribeButton} 
                onChange={e => updateSiteSettings({ labels: { ...settings.site.labels, subscribeButton: e.target.value } })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noDataMessage">No Data Message</Label>
              <Input 
                id="noDataMessage"
                value={settings.site.labels.noDataMessage} 
                onChange={e => updateSiteSettings({ labels: { ...settings.site.labels, noDataMessage: e.target.value } })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loadingMessage">Loading Message</Label>
              <Input 
                id="loadingMessage"
                value={settings.site.labels.loadingMessage} 
                onChange={e => updateSiteSettings({ labels: { ...settings.site.labels, loadingMessage: e.target.value } })} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
