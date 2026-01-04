import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { FooterLink } from "@/types/admin";

export function FooterSettings() {
  const { settings, updateSiteSettings } = useAdmin();

  const addLink = () => {
    const newLink: FooterLink = {
      id: crypto.randomUUID(),
      label: "",
      url: "",
    };
    updateSiteSettings({
      footer: {
        ...settings.site.footer,
        customLinks: [...settings.site.footer.customLinks, newLink],
      },
    });
  };

  const updateLink = (id: string, field: 'label' | 'url', value: string) => {
    updateSiteSettings({
      footer: {
        ...settings.site.footer,
        customLinks: settings.site.footer.customLinks.map(link =>
          link.id === id ? { ...link, [field]: value } : link
        ),
      },
    });
  };

  const removeLink = (id: string) => {
    updateSiteSettings({
      footer: {
        ...settings.site.footer,
        customLinks: settings.site.footer.customLinks.filter(link => link.id !== id),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Copyright & Disclaimer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
          <CardDescription>Customize copyright text and disclaimer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input 
              id="copyrightText"
              value={settings.site.footer.copyrightText} 
              onChange={e => updateSiteSettings({ 
                footer: { ...settings.site.footer, copyrightText: e.target.value } 
              })} 
              placeholder="© {year} {siteName}. All rights reserved."
            />
            <p className="text-xs text-muted-foreground">
              Use {"{year}"} for current year and {"{siteName}"} for site name
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disclaimer">Disclaimer</Label>
            <Textarea 
              id="disclaimer"
              rows={3}
              value={settings.site.footer.disclaimer} 
              onChange={e => updateSiteSettings({ 
                footer: { ...settings.site.footer, disclaimer: e.target.value } 
              })} 
              placeholder="Investment disclaimer..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custom Footer Links</CardTitle>
              <CardDescription>Add additional links to the footer</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addLink}>
              <Plus className="h-4 w-4 mr-1" /> Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {settings.site.footer.customLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No custom links added yet
            </p>
          ) : (
            <div className="space-y-3">
              {settings.site.footer.customLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <Input 
                    value={link.label} 
                    onChange={e => updateLink(link.id, 'label', e.target.value)} 
                    placeholder="Link Label"
                    className="flex-1"
                  />
                  <Input 
                    value={link.url} 
                    onChange={e => updateLink(link.id, 'url', e.target.value)} 
                    placeholder="URL"
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeLink(link.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
