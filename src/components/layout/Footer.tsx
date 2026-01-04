import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export function Footer() {
  const { settings } = useAdmin();
  const currentYear = new Date().getFullYear();

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
            <p className="text-sm text-muted-foreground">
              {settings.site.branding.tagline}
            </p>
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
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Disclaimer</h4>
            <p className="text-xs text-muted-foreground">
              The information provided is for educational purposes only. 
              Please consult with a SEBI registered investment advisor before making any investment decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} {settings.site.branding.siteName}. All rights reserved.</p>
        </div>
      </div>

      {/* Footer Scripts */}
      {settings.site.scripts.footerScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.site.scripts.footerScripts }} />
      )}
    </footer>
  );
}
