import { useAdmin } from "@/contexts/AdminContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function ScriptsSettings() {
  const { settings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Warning */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Caution: Custom Scripts</p>
              <p className="text-muted-foreground mt-1">
                Only add scripts from trusted sources. Malicious scripts can compromise your site's security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header Scripts */}
      <Card>
        <CardHeader>
          <CardTitle>Header Scripts</CardTitle>
          <CardDescription>Scripts added to the &lt;head&gt; section (analytics, fonts, etc.)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headerScripts">Header Script Code</Label>
            <Textarea 
              id="headerScripts"
              rows={8}
              value={settings.site.scripts.headerScripts} 
              onChange={e => updateSiteSettings({ 
                scripts: { ...settings.site.scripts, headerScripts: e.target.value } 
              })} 
              placeholder="<script>...</script>"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Add Google Analytics, fonts, or other head scripts here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Scripts */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Scripts</CardTitle>
          <CardDescription>Scripts added before the closing &lt;/body&gt; tag</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerScripts">Footer Script Code</Label>
            <Textarea 
              id="footerScripts"
              rows={8}
              value={settings.site.scripts.footerScripts} 
              onChange={e => updateSiteSettings({ 
                scripts: { ...settings.site.scripts, footerScripts: e.target.value } 
              })} 
              placeholder="<script>...</script>"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Add chat widgets, tracking pixels, or other footer scripts here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
