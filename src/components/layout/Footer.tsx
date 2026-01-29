"use client";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import { Twitter, Facebook, Linkedin, Youtube, Send, TrendingUp, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { settings } = useAdmin();
  const currentYear = new Date().getFullYear();
  const footer = settings.site.footer;

  // Apply template variables to copyright text
  const copyrightText = footer.copyrightText
    .replace("{year}", String(currentYear))
    .replace("{siteName}", settings.site.branding.siteName);

  const socialLinks = settings.site.socialLinks;
  const hasSocialLinks = footer.showSocialLinks && Object.values(socialLinks).some(link => link.trim() !== "");
  const visibleSections = footer.sections.filter(s => s.visible);

  return (
    <footer className="border-t bg-gradient-to-b from-card to-muted/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand - Takes more space */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 font-display font-bold text-foreground mb-4 group" aria-label={`Go to ${settings.site.branding.siteName} home`}>
              {settings.site.branding.logoUrl ? (
                <img
                  src={settings.site.branding.logoUrl}
                  alt={settings.site.branding.siteName}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-soft group-hover:shadow-medium transition-shadow">
                  <TrendingUp className="h-5 w-5" />
                </div>
              )}
              <span className="text-lg">{settings.site.branding.siteName}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              {settings.site.branding.tagline}
            </p>

            {/* Social Links */}
            {hasSocialLinks && (
              <div className="flex items-center gap-1">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-primary/10 rounded-xl transition-all hover:scale-110"
                    aria-label={`${settings.site.branding.siteName} on Twitter`}
                  >
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-primary/10 rounded-xl transition-all hover:scale-110"
                    aria-label={`${settings.site.branding.siteName} on Facebook`}
                  >
                    <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-primary/10 rounded-xl transition-all hover:scale-110"
                    aria-label={`${settings.site.branding.siteName} on LinkedIn`}
                  >
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-primary/10 rounded-xl transition-all hover:scale-110"
                    aria-label={`${settings.site.branding.siteName} on YouTube`}
                  >
                    <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
                {socialLinks.telegram && (
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 hover:bg-primary/10 rounded-xl transition-all hover:scale-110"
                    aria-label={`${settings.site.branding.siteName} on Telegram`}
                  >
                    <Send className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Sections from Admin */}
          {visibleSections.map((section) => (
            <div key={section.id} className="md:col-span-2">
              <h3 className="font-display font-semibold text-sm mb-4 text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Disclaimer */}
          <div className={`md:col-span-${4 - Math.min(visibleSections.length, 2)}`}>
            <h3 className="font-display font-semibold text-sm mb-4 text-foreground">Disclaimer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {footer.disclaimer}
            </p>

            {/* Contact Info */}
            {footer.showContact && (settings.site.contact.email || settings.site.contact.phone) && (
              <div className="space-y-2 text-sm">
                {settings.site.contact.email && (
                  <a
                    href={`mailto:${settings.site.contact.email}`}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {settings.site.contact.email}
                  </a>
                )}
                {settings.site.contact.phone && (
                  <a
                    href={`tel:${settings.site.contact.phone}`}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {settings.site.contact.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{copyrightText}</p>

          {/* Custom Links */}
          {footer.customLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {footer.customLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-xs hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <p className="text-xs">
            Made with precision for Indian investors
          </p>
        </div>
      </div>

      {/* Footer Scripts */}
      {settings.site.scripts.footerScripts && (
        <div dangerouslySetInnerHTML={{ __html: settings.site.scripts.footerScripts }} />
      )}
    </footer>
  );
}
