import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, FileText, Code, Download, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { settings, updateSiteSettings, updatePageSettings, logout, exportSettings, importSettings, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [importJson, setImportJson] = useState("");

  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  const handleExport = () => {
    const json = exportSettings();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ipo-admin-settings.json";
    a.click();
    toast.success("Settings exported!");
  };

  const handleImport = () => {
    if (importSettings(importJson)) {
      toast.success("Settings imported!");
      setImportJson("");
    } else {
      toast.error("Invalid JSON");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold">← Back to Site</Link>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold">Admin Panel</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="branding">
          <TabsList className="mb-6">
            <TabsTrigger value="branding"><Settings className="h-4 w-4 mr-2" />Branding</TabsTrigger>
            <TabsTrigger value="pages"><FileText className="h-4 w-4 mr-2" />Page SEO</TabsTrigger>
            <TabsTrigger value="scripts"><Code className="h-4 w-4 mr-2" />Scripts</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="branding">
            <Card>
              <CardHeader><CardTitle>Site Branding</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input value={settings.site.branding.siteName} onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, siteName: e.target.value } })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input value={settings.site.branding.logoUrl} onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, logoUrl: e.target.value } })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={settings.site.branding.tagline} onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, tagline: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>Title Suffix</Label>
                  <Input value={settings.site.defaultSeo.titleSuffix} onChange={e => updateSiteSettings({ defaultSeo: { ...settings.site.defaultSeo, titleSuffix: e.target.value } })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <div className="space-y-6">
              {Object.entries(settings.pages).map(([key, page]) => (
                <Card key={key}>
                  <CardHeader><CardTitle className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={page.title} onChange={e => updatePageSettings(key as any, { title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={page.description} onChange={e => updatePageSettings(key as any, { description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>H1 Heading</Label>
                        <Input value={page.h1} onChange={e => updatePageSettings(key as any, { h1: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Input value={page.subheading || ""} onChange={e => updatePageSettings(key as any, { subheading: e.target.value })} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scripts">
            <Card>
              <CardHeader><CardTitle>Header & Footer Scripts</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Header Scripts (Analytics, etc.)</Label>
                  <Textarea rows={6} value={settings.site.scripts.headerScripts} onChange={e => updateSiteSettings({ scripts: { ...settings.site.scripts, headerScripts: e.target.value } })} placeholder="<script>...</script>" />
                </div>
                <div className="space-y-2">
                  <Label>Footer Scripts</Label>
                  <Textarea rows={6} value={settings.site.scripts.footerScripts} onChange={e => updateSiteSettings({ scripts: { ...settings.site.scripts, footerScripts: e.target.value } })} placeholder="<script>...</script>" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Export Settings</CardTitle></CardHeader>
                <CardContent>
                  <Button onClick={handleExport}><Download className="h-4 w-4 mr-2" />Download JSON</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Import Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Textarea rows={4} value={importJson} onChange={e => setImportJson(e.target.value)} placeholder="Paste JSON here..." />
                  <Button onClick={handleImport}><Upload className="h-4 w-4 mr-2" />Import</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
