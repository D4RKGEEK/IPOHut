"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut, Settings, FileText, Code, Download, Palette,
  Home, PanelBottom, BarChart3, Save, RotateCcw, Clock,
  AlertCircle, LayoutGrid, Menu, Eye, Globe
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  GeneralSettings,
  SEOSettings,
  AppearanceSettings,
  HomePageSettings,
  FooterSettings,
  AnalyticsSettings,
  ScriptsSettings,
  BackupSettings,
  IPODetailSettings,
  NavigationSettings,
  PageVisibilitySettings,
  SitemapSettings,
} from "@/components/admin";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const {
    logout,
    isAuthenticated,
    isDirty,
    saveSettings,
    discardChanges,
    lastSavedAt
  } = useAdmin();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/admin/login");
    return null;
  }

  const handleSave = () => {
    saveSettings();
    toast.success("Settings saved successfully!");
  };

  const handleDiscard = () => {
    discardChanges();
    toast.info("Changes discarded");
  };

  const handleLogout = () => {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to logout?");
      if (!confirmed) return;
    }
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold hover:text-primary transition-colors">
              ← Back to Site
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Status */}
            {lastSavedAt && (
              <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Saved {formatDistanceToNow(new Date(lastSavedAt), { addSuffix: true })}
              </span>
            )}

            {/* Unsaved Indicator */}
            {isDirty && (
              <span className="text-xs text-warning flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3" />
                Unsaved changes
              </span>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isDirty && (
                <>
                  <Button variant="ghost" size="sm" onClick={handleDiscard}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Discard
                  </Button>
                  <Button size="sm" onClick={handleSave} className="bg-success hover:bg-success/90">
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="gap-2">
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Navigation</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Pages</span>
            </TabsTrigger>
            <TabsTrigger value="homepage" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="ipodetail" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">IPO Detail</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="gap-2">
              <PanelBottom className="h-4 w-4" />
              <span className="hidden sm:inline">Footer</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="scripts" className="gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Scripts</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Backup</span>
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Sitemap</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="navigation">
            <NavigationSettings />
          </TabsContent>

          <TabsContent value="pages">
            <PageVisibilitySettings />
          </TabsContent>

          <TabsContent value="homepage">
            <HomePageSettings />
          </TabsContent>

          <TabsContent value="ipodetail">
            <IPODetailSettings />
          </TabsContent>

          <TabsContent value="footer">
            <FooterSettings />
          </TabsContent>

          <TabsContent value="seo">
            <SEOSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsSettings />
          </TabsContent>

          <TabsContent value="scripts">
            <ScriptsSettings />
          </TabsContent>

          <TabsContent value="backup">
            <BackupSettings />
          </TabsContent>

          <TabsContent value="sitemap">
            <SitemapSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Save Button (Mobile) */}
      {isDirty && (
        <div className="fixed bottom-4 right-4 md:hidden flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDiscard}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-success hover:bg-success/90 shadow-lg">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      )}
    </div>
  );
}
