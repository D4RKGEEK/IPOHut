import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Twitter, Facebook, Linkedin, Youtube, Send } from "lucide-react";

export function Footer() {
  const { settings } = useAdmin();
  const currentYear = new Date().getFullYear();

  // Apply template variables to copyright text
  const copyrightText = settings.site.footer.copyrightText
    .replace("{year}", String(currentYear))
    .replace("{siteName}", settings.site.branding.siteName);

  const socialLinks = settings.site.socialLinks;
  const hasSocialLinks = Object.values(socialLinks).some(link => link.trim() !== "");

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground mb-3">
              {settings.site.branding.logoUrl ? (
                <img 
                  src={settings.site.branding.logoUrl} 
                  alt={settings.site.branding.siteName} 
                  className="h-6 w-auto"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                  IPO
                </div>
              )}
              <span>{settings.site.branding.siteName}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              {settings.site.branding.tagline}
            </p>
            
            {/* Social Links */}
            {hasSocialLinks && (
              <div className="flex items-center gap-2">
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-md transition-colors">
                    <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-md transition-colors">
                    <Facebook className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-md transition-colors">
                    <Linkedin className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-md transition-colors">
                    <Youtube className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
                {socialLinks.telegram && (
                  <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-muted rounded-md transition-colors">
                    <Send className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">IPO Types</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/mainboard-ipo" className="hover:text-foreground transition-colors">Mainboard IPO</Link></li>
              <li><Link to="/sme-ipo" className="hover:text-foreground transition-colors">SME IPO</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/ipo-gmp-today" className="hover:text-foreground transition-colors">GMP Tracker</Link></li>
              <li><Link to="/ipo-allotment-status" className="hover:text-foreground transition-colors">Allotment Status</Link></li>
              <li><Link to="/ipo-calendar" className="hover:text-foreground transition-colors">IPO Calendar</Link></li>
              <li><Link to="/ipo-listing-performance" className="hover:text-foreground transition-colors">Performance Tracker</Link></li>
              {/* Custom Links */}
              {settings.site.footer.customLinks.map(link => (
                <li key={link.id}>
                  <a 
                    href={link.url} 
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Disclaimer</h4>
            <p className="text-xs text-muted-foreground">
              {settings.site.footer.disclaimer}
            </p>
            
            {/* Contact Info */}
            {(settings.site.contact.email || settings.site.contact.phone) && (
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                {settings.site.contact.email && (
                  <p>
                    <a href={`mailto:${settings.site.contact.email}`} className="hover:text-foreground transition-colors">
                      {settings.site.contact.email}
                    </a>
                  </p>
                )}
                {settings.site.contact.phone && (
                  <p>
                    <a href={`tel:${settings.site.contact.phone}`} className="hover:text-foreground transition-colors">
                      {settings.site.contact.phone}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>{copyrightText}</p>
        </div>
      </div>

      {/* Footer Scripts */}
      {settings.site.scripts.footerScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.site.scripts.footerScripts }} />
      )}
    </footer>
  );
}
