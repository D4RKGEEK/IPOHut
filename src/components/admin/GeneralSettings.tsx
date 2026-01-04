import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GeneralSettings() {
  const { settings, updateSiteSettings } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Site Branding</CardTitle>
          <CardDescription>Customize your site's name, logo, and tagline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName"
                value={settings.site.branding.siteName} 
                onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, siteName: e.target.value } })} 
                placeholder="IPO Watch"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input 
                id="tagline"
                value={settings.site.branding.tagline} 
                onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, tagline: e.target.value } })} 
                placeholder="Your trusted source for IPO insights"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input 
                id="logoUrl"
                value={settings.site.branding.logoUrl} 
                onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, logoUrl: e.target.value } })} 
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <Input 
                id="faviconUrl"
                value={settings.site.branding.faviconUrl} 
                onChange={e => updateSiteSettings({ branding: { ...settings.site.branding, faviconUrl: e.target.value } })} 
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Your contact details displayed on the site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={settings.site.contact.email} 
                onChange={e => updateSiteSettings({ contact: { ...settings.site.contact, email: e.target.value } })} 
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                value={settings.site.contact.phone} 
                onChange={e => updateSiteSettings({ contact: { ...settings.site.contact, phone: e.target.value } })} 
                placeholder="+91 1234567890"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address"
              value={settings.site.contact.address} 
              onChange={e => updateSiteSettings({ contact: { ...settings.site.contact, address: e.target.value } })} 
              placeholder="123 Main St, City, Country"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Connect your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input 
                id="twitter"
                value={settings.site.socialLinks.twitter} 
                onChange={e => updateSiteSettings({ socialLinks: { ...settings.site.socialLinks, twitter: e.target.value } })} 
                placeholder="https://twitter.com/yourprofile"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input 
                id="facebook"
                value={settings.site.socialLinks.facebook} 
                onChange={e => updateSiteSettings({ socialLinks: { ...settings.site.socialLinks, facebook: e.target.value } })} 
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin"
                value={settings.site.socialLinks.linkedin} 
                onChange={e => updateSiteSettings({ socialLinks: { ...settings.site.socialLinks, linkedin: e.target.value } })} 
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input 
                id="youtube"
                value={settings.site.socialLinks.youtube} 
                onChange={e => updateSiteSettings({ socialLinks: { ...settings.site.socialLinks, youtube: e.target.value } })} 
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram</Label>
              <Input 
                id="telegram"
                value={settings.site.socialLinks.telegram} 
                onChange={e => updateSiteSettings({ socialLinks: { ...settings.site.socialLinks, telegram: e.target.value } })} 
                placeholder="https://t.me/yourchannel"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
