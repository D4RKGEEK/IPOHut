import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Menu, X, TrendingUp, Calendar, BarChart3, CheckCircle, Calculator, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navItems = [
  { href: "/mainboard-ipo", label: "Mainboard", icon: TrendingUp },
  { href: "/sme-ipo", label: "SME", icon: BarChart3 },
  { href: "/ipo-gmp-today", label: "GMP Today", icon: Sparkles },
  { href: "/ipo-allotment-status", label: "Allotment", icon: CheckCircle },
  { href: "/ipo-calendar", label: "Calendar", icon: Calendar },
  { href: "/ipo-listing-performance", label: "Performance", icon: BarChart3 },
  { href: "/tools", label: "Tools", icon: Calculator },
];

export function Header() {
  const { settings } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 font-display font-bold text-foreground group">
          {settings.site.branding.logoUrl ? (
            <img 
              src={settings.site.branding.logoUrl} 
              alt={settings.site.branding.siteName} 
              className="h-9 w-auto"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-soft group-hover:shadow-medium transition-shadow">
              <TrendingUp className="h-5 w-5" />
            </div>
          )}
          <span className="hidden sm:inline-block text-lg">{settings.site.branding.siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden border-t bg-card overflow-hidden transition-all duration-300 ease-out",
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container py-4 space-y-1">
          {navItems.map((item, idx) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}